import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FamilyMember } from "@/types/investment";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LiquidAssetsDialogProps {
  liquidAssets: number;
  onUpdate: (amount: number, owner: FamilyMember) => void;
}

export const LiquidAssetsDialog = ({ liquidAssets, onUpdate }: LiquidAssetsDialogProps) => {
  const [amount, setAmount] = useState(liquidAssets);
  const [owner, setOwner] = useState<FamilyMember>("Myself");
  const familyMembers: FamilyMember[] = ["Myself", "My Wife", "My Daughter"];
  const { toast } = useToast();

  useEffect(() => {
    fetchLiquidAssets();
  }, [owner]);

  const fetchLiquidAssets = async () => {
    try {
      console.log("Fetching liquid assets for owner:", owner);
      const { data, error } = await supabase
        .from("liquid_assets")
        .select("amount")
        .eq("owner", owner)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching liquid assets:", error);
        return;
      }

      if (data) {
        console.log("Found liquid assets:", data);
        setAmount(data.amount);
      } else {
        console.log("No liquid assets found for owner:", owner);
        setAmount(0);
      }
    } catch (error) {
      console.error("Error fetching liquid assets:", error);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving liquid assets for owner:", owner, "amount:", amount);
      
      const { data: existingData, error: checkError } = await supabase
        .from("liquid_assets")
        .select("id")
        .eq("owner", owner);

      if (checkError) {
        throw checkError;
      }

      let result;
      
      if (existingData && existingData.length > 0) {
        result = await supabase
          .from("liquid_assets")
          .update({ amount })
          .eq("owner", owner);
      } else {
        result = await supabase
          .from("liquid_assets")
          .insert([{ owner, amount }]);
      }

      if (result.error) {
        throw result.error;
      }

      console.log("Liquid assets saved successfully");
      onUpdate(amount, owner);
      toast({
        title: "Success",
        description: "Liquid assets updated successfully",
      });
    } catch (error) {
      console.error("Error saving liquid assets:", error);
      toast({
        title: "Error",
        description: "Failed to update liquid assets",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background">
        <DialogHeader>
          <DialogTitle>Update Liquid Assets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Select 
              value={owner} 
              onValueChange={(value) => setOwner(value as FamilyMember)}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg">
                {familyMembers.map((member) => (
                  <SelectItem 
                    key={member} 
                    value={member}
                    className="cursor-pointer hover:bg-accent focus:bg-accent"
                  >
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">
                Current liquid assets for {owner}: ₹{amount.toLocaleString()}
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Enter liquid assets amount"
                className="bg-background"
              />
            </div>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
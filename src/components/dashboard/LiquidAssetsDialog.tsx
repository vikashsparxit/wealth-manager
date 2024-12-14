import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FamilyMember } from "@/types/investment";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LiquidAssetsDialogProps {
  liquidAssets: number;
  onUpdate: (amount: number, owner: FamilyMember) => void;
}

export const LiquidAssetsDialog = ({ liquidAssets, onUpdate }: LiquidAssetsDialogProps) => {
  const [amount, setAmount] = useState(liquidAssets);
  const [owner, setOwner] = useState<FamilyMember>("Myself");
  const [currentAssets, setCurrentAssets] = useState<{[key: string]: number}>({});
  const familyMembers: FamilyMember[] = ["Myself", "My Wife", "My Daughter"];

  useEffect(() => {
    fetchLiquidAssets();
  }, [owner]);

  const fetchLiquidAssets = async () => {
    try {
      console.log("Fetching liquid assets for owner:", owner);
      const { data, error } = await supabase
        .from("liquid_assets")
        .select("owner, amount")
        .eq("owner", owner);

      if (error) {
        console.error("Error fetching liquid assets:", error);
        return;
      }

      // If no data exists yet, set amount to 0
      if (!data || data.length === 0) {
        console.log("No liquid assets found for owner:", owner);
        setAmount(0);
      } else {
        console.log("Found liquid assets:", data[0]);
        setAmount(data[0].amount);
      }
    } catch (error) {
      console.error("Error fetching liquid assets:", error);
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
            <Button onClick={() => onUpdate(amount, owner)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
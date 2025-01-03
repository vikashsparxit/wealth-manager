import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FamilyMember, LiquidAsset, FamilyRelationship } from "@/types/investment";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface LiquidAssetsDialogProps {
  liquidAssets: LiquidAsset[];
  onUpdate: (amount: number, owner: FamilyMember) => void;
  selectedMember: "Wealth Combined" | FamilyMember;
}

interface FamilyMemberData {
  name: FamilyMember;
  relationship?: FamilyRelationship;
}

export const LiquidAssetsDialog = ({ liquidAssets, onUpdate, selectedMember }: LiquidAssetsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const [owner, setOwner] = useState<FamilyMember>("Myself");
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberData[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const loadFamilyMembers = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('family_members')
        .select('name, relationship')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at');

      if (error) {
        console.error('Error loading family members:', error);
        return;
      }

      console.log("Loaded family members for liquid assets:", data);
      setFamilyMembers(data as FamilyMemberData[]);
    };

    if (open) {
      loadFamilyMembers();
    }
  }, [user, open]);

  useEffect(() => {
    if (selectedMember !== "Wealth Combined") {
      setOwner(selectedMember);
      const asset = liquidAssets.find(a => a.owner === selectedMember);
      setAmount(asset ? asset.amount.toString() : "0");
    } else {
      const asset = liquidAssets.find(a => a.owner === owner);
      setAmount(asset ? asset.amount.toString() : "0");
    }
  }, [selectedMember, owner, liquidAssets]);

  const handleSave = async () => {
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        throw new Error("Invalid amount");
      }

      const ownerToUpdate = selectedMember !== "Wealth Combined" ? selectedMember : owner;
      await onUpdate(numAmount, ownerToUpdate as FamilyMember);
      setOpen(false);
    } catch (error) {
      console.error("Error saving liquid assets:", error);
      toast({
        title: "Error",
        description: "Failed to update liquid assets. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 100);
    }
  };

  const getDisplayName = (member: FamilyMemberData) => {
    if (member.name === "Myself") {
      return "Myself (Primary)";
    }
    return `${member.name}${member.relationship ? ` (${member.relationship})` : ''}`;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Update Liquid Assets</DialogTitle>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              {selectedMember === "Wealth Combined" && familyMembers.length > 0 && (
                <Select 
                  value={owner} 
                  onValueChange={(value: FamilyMember) => {
                    setOwner(value);
                    const asset = liquidAssets.find(a => a.owner === value);
                    setAmount(asset ? asset.amount.toString() : "0");
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select owner" />
                  </SelectTrigger>
                  <SelectContent>
                    {familyMembers.map((member) => (
                      <SelectItem 
                        key={member.name} 
                        value={member.name}
                        className="cursor-pointer"
                      >
                        {getDisplayName(member)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div className="space-y-1">
                <label className="text-sm text-muted-foreground">
                  Current liquid assets for {selectedMember !== "Wealth Combined" ? selectedMember : owner}
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter liquid assets amount"
                />
              </div>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
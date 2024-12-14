import { useState, useEffect } from "react";
import { FamilyMember } from "@/types/investment";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { FamilyMemberData } from "./types";

export const useLiquidAssetsDialog = (
  liquidAssets: any[],
  selectedMember: "Wealth Combined" | FamilyMember,
  onUpdate: (amount: number, owner: FamilyMember) => void
) => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const [owner, setOwner] = useState<FamilyMember>("Myself");
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberData[]>([]);
  const [primaryMember, setPrimaryMember] = useState<FamilyMemberData | null>(null);
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
      
      // Find primary member and set it as default
      const primary = data.find(member => member.relationship === 'Primary User');
      if (primary) {
        setPrimaryMember({
          name: primary.name as FamilyMember,
          relationship: primary.relationship
        });
        setOwner(primary.name as FamilyMember);
      }
      
      setFamilyMembers(data.map(member => ({
        name: member.name as FamilyMember,
        relationship: member.relationship
      })));
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
    } else if (primaryMember) {
      // Set primary member as default when in combined view
      setOwner(primaryMember.name);
      const asset = liquidAssets.find(a => a.owner === primaryMember.name);
      setAmount(asset ? asset.amount.toString() : "0");
    }
  }, [selectedMember, owner, liquidAssets, primaryMember]);

  const handleSave = async () => {
    try {
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        throw new Error("Invalid amount");
      }

      const ownerToUpdate = selectedMember !== "Wealth Combined" ? selectedMember : owner;
      console.log("Updating liquid assets for owner:", ownerToUpdate, "amount:", numAmount);
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

  return {
    open,
    amount,
    owner,
    familyMembers,
    handleSave,
    handleOpenChange,
    setAmount,
    setOwner,
  };
};
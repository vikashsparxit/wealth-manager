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
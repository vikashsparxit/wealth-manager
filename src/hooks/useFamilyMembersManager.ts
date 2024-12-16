import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { FamilyMember, FamilyRelationship } from "@/types/investment";

export const useFamilyMembersManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { logUserActivity } = useActivityLogger();
  const [isLoading, setIsLoading] = useState(false);

  const addFamilyMember = async (name: string, relationship: FamilyRelationship) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('family_members')
        .insert([
          { name, relationship, user_id: user.id }
        ]);

      if (error) throw error;

      await logUserActivity(
        "family_member_added",
        `Added family member: ${name} (${relationship})`,
        { name, relationship }
      );

      toast({
        title: "Success",
        description: "Family member added successfully",
      });
    } catch (error) {
      console.error('Error adding family member:', error);
      toast({
        title: "Error",
        description: "Failed to add family member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFamilyMember = async (id: string, name: string, relationship: FamilyRelationship) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('family_members')
        .update({ name, relationship })
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await logUserActivity(
        "family_member_updated",
        `Updated family member: ${name} (${relationship})`,
        { name, relationship }
      );

      toast({
        title: "Success",
        description: "Family member updated successfully",
      });
    } catch (error) {
      console.error('Error updating family member:', error);
      toast({
        title: "Error",
        description: "Failed to update family member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateFamilyMember = async (member: { id: string; name: FamilyMember }) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('family_members')
        .update({ status: 'inactive' })
        .eq('id', member.id)
        .eq('user_id', user.id);

      if (error) throw error;

      await logUserActivity(
        "family_member_deactivated",
        `Deactivated family member: ${member.name}`,
        { memberId: member.id, name: member.name }
      );

      toast({
        title: "Success",
        description: "Family member deactivated successfully",
      });
    } catch (error) {
      console.error('Error deactivating family member:', error);
      toast({
        title: "Error",
        description: "Failed to deactivate family member",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    addFamilyMember,
    updateFamilyMember,
    deactivateFamilyMember,
  };
};
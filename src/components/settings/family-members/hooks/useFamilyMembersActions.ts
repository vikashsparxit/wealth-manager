import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FamilyMemberState, Member } from "../types";
import { Dispatch, SetStateAction } from "react";
import { FamilyRelationship } from "@/types/investment";

export const useFamilyMembersActions = (
  state: FamilyMemberState,
  setState: Dispatch<SetStateAction<FamilyMemberState>>,
  loadMembers: () => Promise<Member[]>
) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const addMember = async () => {
    if (!state.newMember.trim() || !user?.id) return;

    try {
      setState(prev => ({ ...prev, loading: true }));
      console.log("Adding new family member:", { 
        name: state.newMember, 
        relationship: state.relationship 
      });
      
      const { error } = await supabase
        .from("family_members")
        .insert({
          name: state.newMember.trim(),
          relationship: state.relationship as FamilyRelationship,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member added successfully",
      });
      
      setState(prev => ({ 
        ...prev, 
        newMember: "", 
        relationship: "Spouse"
      }));

      const members = await loadMembers();
      setState(prev => ({ ...prev, members }));
    } catch (error) {
      console.error("Error adding family member:", error);
      toast({
        title: "Error",
        description: "Failed to add family member",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const updateMember = async (id: string, newName: string, newRelationship: FamilyRelationship) => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      console.log("Updating family member:", { id, newName, newRelationship });
      
      const { error } = await supabase
        .from("family_members")
        .update({ 
          name: newName.trim(),
          relationship: newRelationship
        })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member updated successfully",
      });
      
      setState(prev => ({ ...prev, editingId: null }));
      const members = await loadMembers();
      setState(prev => ({ ...prev, members }));
    } catch (error) {
      console.error("Error updating family member:", error);
      toast({
        title: "Error",
        description: "Failed to update family member",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const toggleMemberStatus = async (member: Member) => {
    if (member.investment_count > 0 && member.status === 'active') {
      toast({
        title: "Cannot Deactivate",
        description: "This member has active investments. Please remove or reassign them first.",
        variant: "destructive",
      });
      return;
    }

    try {
      setState(prev => ({ ...prev, loading: true }));
      const newStatus = member.status === "active" ? "inactive" : "active";
      
      const { error } = await supabase
        .from("family_members")
        .update({ status: newStatus })
        .eq("id", member.id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member status updated successfully",
      });
      
      const members = await loadMembers();
      setState(prev => ({ ...prev, members }));
    } catch (error) {
      console.error("Error updating family member status:", error);
      toast({
        title: "Error",
        description: "Failed to update family member status",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  return {
    addMember,
    updateMember,
    toggleMemberStatus,
  };
};
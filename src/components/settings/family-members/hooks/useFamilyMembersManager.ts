import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Member, FamilyMemberState } from "../types";
import { FamilyRelationship } from "@/types/investment";

export const useFamilyMembersManager = () => {
  const [state, setState] = useState<FamilyMemberState>({
    newMember: "",
    relationship: "Other",
    members: [],
    loading: false,
    editingId: null,
    editValue: "",
    editRelationship: "Other",
  });

  const { toast } = useToast();
  const { user } = useAuth();

  const loadMembers = async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      if (!user) return;

      console.log("Loading family members for user:", user.id);
      
      // First, get the count of investments per family member
      const { data: investmentCounts, error: countError } = await supabase
        .from('investments')
        .select('owner, count')
        .eq('user_id', user.id)
        .group_by('owner');

      if (countError) {
        console.error("Error getting investment counts:", countError);
      }

      // Then get family members
      const { data: membersData, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (membersError) {
        console.error("Error loading family members:", membersError);
        throw membersError;
      }

      // Combine the data
      const formattedMembers = membersData.map(member => ({
        ...member,
        investment_count: investmentCounts?.find(count => count.owner === member.name)?.count || 0
      }));

      console.log("Loaded members with counts:", formattedMembers);
      setState(prev => ({ ...prev, members: formattedMembers }));
    } catch (error) {
      console.error("Error in loadMembers:", error);
      toast({
        title: "Error",
        description: "Failed to load family members",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

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
          relationship: state.relationship,
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
        relationship: "Other" 
      }));
      await loadMembers();
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
      await loadMembers();
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
      
      await loadMembers();
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

  useEffect(() => {
    if (user) {
      loadMembers();
    }
  }, [user]);

  return {
    state,
    setState,
    addMember,
    updateMember,
    toggleMemberStatus,
  };
};
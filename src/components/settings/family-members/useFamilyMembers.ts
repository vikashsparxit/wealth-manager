import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Member } from "./types";

export const useFamilyMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newMember, setNewMember] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const loadMembers = async () => {
    try {
      setLoading(true);
      if (!user) return;

      console.log("Loading family members for user:", user.id);
      
      // First, get all investments to count them manually
      const { data: investments, error: investmentsError } = await supabase
        .from('investments')
        .select('owner')
        .eq('user_id', user.id);

      if (investmentsError) {
        console.error("Error getting investments:", investmentsError);
        throw investmentsError;
      }

      // Count investments per owner
      const investmentCounts: Record<string, number> = {};
      investments?.forEach(inv => {
        investmentCounts[inv.owner] = (investmentCounts[inv.owner] || 0) + 1;
      });

      console.log("Investment counts:", investmentCounts);

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
        investment_count: investmentCounts[member.name] || 0
      }));

      console.log("Loaded members with counts:", formattedMembers);
      setMembers(formattedMembers);
    } catch (error) {
      console.error("Error in loadMembers:", error);
      toast({
        title: "Error",
        description: "Failed to load family members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMember = async () => {
    if (!newMember.trim() || !user?.id) return;

    try {
      setLoading(true);
      console.log("Adding new family member:", newMember);
      const { error } = await supabase
        .from("family_members")
        .insert([{ name: newMember.trim(), user_id: user.id }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member added successfully",
      });
      
      setNewMember("");
      await loadMembers();
    } catch (error) {
      console.error("Error adding family member:", error);
      toast({
        title: "Error",
        description: "Failed to add family member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (id: string, newName: string) => {
    try {
      setLoading(true);
      console.log("Updating family member:", { id, newName });
      const { error } = await supabase
        .from("family_members")
        .update({ name: newName.trim() })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member updated successfully",
      });
      
      setEditingId(null);
      await loadMembers();
    } catch (error) {
      console.error("Error updating family member:", error);
      toast({
        title: "Error",
        description: "Failed to update family member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      setLoading(true);
      const newStatus = member.status === "active" ? "inactive" : "active";
      console.log("Toggling member status:", { member, newStatus });
      
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
      setLoading(false);
    }
  };

  const startEditing = (member: Member) => {
    setEditingId(member.id);
    setEditValue(member.name);
  };

  useEffect(() => {
    if (user) {
      loadMembers();
    }
  }, [user]);

  return {
    members,
    loading,
    editingId,
    editValue,
    newMember,
    setEditValue,
    setNewMember,
    addMember,
    updateMember,
    toggleMemberStatus,
    startEditing,
    setEditingId,
  };
};
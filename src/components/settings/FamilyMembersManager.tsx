import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MemberWithInvestments } from "@/types/member";
import { AddMemberForm } from "./members/AddMemberForm";
import { MemberListItem } from "./members/MemberListItem";

export const FamilyMembersManager = () => {
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState<MemberWithInvestments[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const loadMembers = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const { data: membersWithCounts, error } = await supabase
        .from('family_members')
        .select(`
          id,
          name,
          status,
          investments:investments(count)
        `)
        .eq('user_id', user.id)
        .order('created_at');

      if (error) throw error;

      const formattedMembers = membersWithCounts.map(member => ({
        ...member,
        investment_count: member.investments?.[0]?.count || 0
      }));

      console.log("Loaded members with counts:", formattedMembers);
      setMembers(formattedMembers);
    } catch (error) {
      console.error("Error loading family members:", error);
      toast({
        title: "Error",
        description: "Failed to load family members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadMembers();
    }
  }, [user]);

  const addMember = async () => {
    if (!newMember.trim() || !user?.id) return;

    try {
      setLoading(true);
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

  const toggleMemberStatus = async (member: MemberWithInvestments) => {
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

  return (
    <Card className="p-6">
      <AddMemberForm
        newMember={newMember}
        loading={loading}
        onNewMemberChange={setNewMember}
        onAddMember={addMember}
      />

      <div className="space-y-2">
        {members.map((member) => (
          <MemberListItem
            key={member.id}
            member={member}
            editingId={editingId}
            editValue={editValue}
            loading={loading}
            onEdit={(member) => {
              setEditingId(member.id);
              setEditValue(member.name);
            }}
            onUpdate={updateMember}
            onCancelEdit={() => setEditingId(null)}
            onEditValueChange={setEditValue}
            onToggleStatus={toggleMemberStatus}
          />
        ))}
      </div>
    </Card>
  );
};
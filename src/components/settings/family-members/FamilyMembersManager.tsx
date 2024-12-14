import { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AddMemberForm } from "./AddMemberForm";
import { MembersList } from "./MembersList";
import { Member } from "./types";

export const FamilyMembersManager = () => {
  const [newMember, setNewMember] = useState("");
  const [relationship, setRelationship] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editRelationship, setEditRelationship] = useState("");
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
          relationship,
          status,
          investments:investments(count)
        `)
        .eq('user_id', user.id)
        .order('created_at');

      if (error) throw error;

      const formattedMembers = membersWithCounts.map(member => ({
        id: member.id,
        name: member.name,
        relationship: member.relationship || '',
        status: member.status,
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
    if (!newMember.trim() || !relationship.trim() || !user?.id) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("family_members")
        .insert([{ 
          name: newMember.trim(), 
          relationship: relationship.trim(),
          user_id: user.id 
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Family member added successfully",
      });
      
      setNewMember("");
      setRelationship("");
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

  const updateMember = async (id: string, newName: string, newRelationship: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("family_members")
        .update({ 
          name: newName.trim(),
          relationship: newRelationship.trim()
        })
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
    setEditRelationship(member.relationship || '');
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Family Members</DialogTitle>
      </DialogHeader>
      
      <Card className="p-6">
        <AddMemberForm
          newMember={newMember}
          relationship={relationship}
          loading={loading}
          onAdd={addMember}
          onMemberChange={setNewMember}
          onRelationshipChange={setRelationship}
        />

        <MembersList
          members={members}
          editingId={editingId}
          editValue={editValue}
          editRelationship={editRelationship}
          loading={loading}
          onEdit={startEditing}
          onUpdate={updateMember}
          onCancelEdit={() => setEditingId(null)}
          onToggleStatus={toggleMemberStatus}
          setEditValue={setEditValue}
          setEditRelationship={setEditRelationship}
        />
      </Card>
    </DialogContent>
  );
};
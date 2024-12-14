import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserPlus, UserMinus, Check, X, Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { FamilyMember } from "@/types/investment";

interface MemberWithInvestments extends { id: string; name: string; status: string } {
  investment_count?: number;
}

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

      // Get members with their investment counts
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

  const startEditing = (member: MemberWithInvestments) => {
    setEditingId(member.id);
    setEditValue(member.name);
  };

  return (
    <Card className="p-6">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Enter member name"
          value={newMember}
          onChange={(e) => setNewMember(e.target.value)}
          className="max-w-xs"
        />
        <Button onClick={addMember} disabled={loading || !newMember.trim()}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add Member
        </Button>
      </div>

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-2 bg-background rounded-lg border"
          >
            {editingId === member.id ? (
              <div className="flex items-center gap-2 flex-1 mr-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => updateMember(member.id, editValue)}
                  disabled={!editValue.trim() || editValue === member.name}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1 cursor-pointer" onClick={() => startEditing(member)}>
                  {member.name}
                  {member.investment_count > 0 && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({member.investment_count} investments)
                    </span>
                  )}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEditing(member)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={member.status === "active" ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleMemberStatus(member)}
                    disabled={loading}
                  >
                    {member.status === "active" ? (
                      <>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
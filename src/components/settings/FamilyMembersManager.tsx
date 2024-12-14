import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { UserPlus, UserMinus, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const FamilyMembersManager = () => {
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState<Array<{ id: string; name: string; status: string }>>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("family_members")
        .select("*")
        .eq("user_id", user?.id);

      if (error) throw error;
      setMembers(data || []);
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

  const toggleMemberStatus = async (id: string, currentStatus: string) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      const { error } = await supabase
        .from("family_members")
        .update({ status: newStatus })
        .eq("id", id);

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
      <h3 className="text-lg font-semibold mb-4">Manage Family Members</h3>
      
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
            <span>{member.name}</span>
            <div className="flex gap-2">
              <Button
                variant={member.status === "active" ? "destructive" : "default"}
                size="sm"
                onClick={() => toggleMemberStatus(member.id, member.status)}
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
          </div>
        ))}
      </div>
    </Card>
  );
};
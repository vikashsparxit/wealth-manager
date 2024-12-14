import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

interface AddMemberFormProps {
  newMember: string;
  loading: boolean;
  onNewMemberChange: (value: string) => void;
  onAddMember: () => void;
}

export const AddMemberForm = ({
  newMember,
  loading,
  onNewMemberChange,
  onAddMember,
}: AddMemberFormProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Enter member name"
        value={newMember}
        onChange={(e) => onNewMemberChange(e.target.value)}
        className="max-w-xs"
      />
      <Button onClick={onAddMember} disabled={loading || !newMember.trim()}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </div>
  );
};
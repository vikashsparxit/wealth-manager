import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";

interface Props {
  newMember: string;
  loading: boolean;
  onAdd: () => void;
  onChange: (value: string) => void;
}

export const AddMemberForm = ({ newMember, loading, onAdd, onChange }: Props) => {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Enter member name"
        value={newMember}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-xs"
      />
      <Button onClick={onAdd} disabled={loading || !newMember.trim()}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </div>
  );
};
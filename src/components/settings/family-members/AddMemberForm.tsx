import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { AddMemberFormProps } from "./types";

export const AddMemberForm = ({ 
  newMember, 
  relationship, 
  loading, 
  onAdd, 
  onMemberChange, 
  onRelationshipChange 
}: AddMemberFormProps) => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter member name"
          value={newMember}
          onChange={(e) => onMemberChange(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Relationship (e.g., Wife, Son)"
          value={relationship}
          onChange={(e) => onRelationshipChange(e.target.value)}
          className="flex-1"
        />
      </div>
      <Button onClick={onAdd} disabled={loading || !newMember.trim() || !relationship.trim()}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </div>
  );
};
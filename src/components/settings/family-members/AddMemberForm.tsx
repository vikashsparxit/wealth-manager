import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddMemberFormProps, RelationshipType } from "./types";

const relationships: RelationshipType[] = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export const AddMemberForm = ({ 
  newMember, 
  loading, 
  relationship,
  onAdd, 
  onChange,
  onRelationshipChange 
}: AddMemberFormProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Input
        placeholder="Enter member name"
        value={newMember}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-xs"
      />
      <Select value={relationship} onValueChange={onRelationshipChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Relationship" />
        </SelectTrigger>
        <SelectContent>
          {relationships.map((rel) => (
            <SelectItem key={rel} value={rel}>
              {rel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={onAdd} disabled={loading || !newMember.trim() || !relationship}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </div>
  );
};
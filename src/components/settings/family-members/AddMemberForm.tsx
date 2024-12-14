import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { AddMemberFormProps } from "./types";
import { FamilyRelationship } from "@/types/investment";

const relationshipOptions: FamilyRelationship[] = [
  "Primary User",
  "Spouse",
  "Son",
  "Daughter",
  "Other"
];

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
        <Select 
          value={relationship} 
          onValueChange={(value: FamilyRelationship) => onRelationshipChange(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select relationship" />
          </SelectTrigger>
          <SelectContent>
            {relationshipOptions.map((option) => (
              <SelectItem 
                key={option} 
                value={option}
                className="cursor-pointer"
              >
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onAdd} disabled={loading || !newMember.trim() || !relationship}>
        <UserPlus className="h-4 w-4 mr-2" />
        Add Member
      </Button>
    </div>
  );
};
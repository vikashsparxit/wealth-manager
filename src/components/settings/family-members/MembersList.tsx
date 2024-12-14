import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserMinus, Check, X, Edit2 } from "lucide-react";
import { MemberListProps } from "./types";
import { FamilyRelationship } from "@/types/investment";

const relationshipOptions: FamilyRelationship[] = [
  "Primary User",
  "Spouse",
  "Son",
  "Daughter",
  "Other"
];

export const MembersList = ({
  members,
  editingId,
  editValue,
  editRelationship,
  loading,
  onEdit,
  onUpdate,
  onCancelEdit,
  onToggleStatus,
  setEditValue,
  setEditRelationship,
}: MemberListProps) => {
  return (
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
                placeholder="Member name"
                autoFocus
              />
              <Select 
                value={editRelationship} 
                onValueChange={(value: FamilyRelationship) => setEditRelationship(value)}
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
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onUpdate(member.id, editValue, editRelationship)}
                disabled={!editValue.trim() || !editRelationship}
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onCancelEdit}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <span className="font-medium">{member.name}</span>
                {member.relationship && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({member.relationship})
                  </span>
                )}
                {member.investment_count > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {member.investment_count} investments
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(member)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant={member.status === "active" ? "destructive" : "default"}
                  size="sm"
                  onClick={() => onToggleStatus(member)}
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
  );
};
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserMinus, Check, X, Edit2, UserRound } from "lucide-react";
import { MemberItemProps } from "./types";
import { FamilyRelationship } from "@/types/investment";

const relationshipOptions: FamilyRelationship[] = [
  "Spouse",
  "Son",
  "Daughter",
  "Mother",
  "Father"
];

export const MemberItem = ({
  member,
  isEditing,
  editValue,
  editRelationship,
  loading,
  onEdit,
  onUpdate,
  onCancel,
  onToggleStatus,
  setEditValue,
  setEditRelationship,
}: MemberItemProps) => {
  const isPrimaryUser = member.relationship === "Primary User";

  return (
    <div className="flex items-center justify-between p-2 bg-background rounded-lg border">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1 mr-2">
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1"
            placeholder="Member name"
            autoFocus
          />
          {!isPrimaryUser && (
            <Select 
              value={editRelationship} 
              onValueChange={(value: FamilyRelationship) => setEditRelationship(value)}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg">
                {relationshipOptions.map((option) => (
                  <SelectItem 
                    key={option} 
                    value={option}
                    className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={onUpdate}
            disabled={!editValue.trim()}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center flex-1">
            {isPrimaryUser && <UserRound className="h-4 w-4 mr-2 text-primary" />}
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
              onClick={onEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            {!isPrimaryUser && (
              <Button
                variant={member.status === "active" ? "destructive" : "default"}
                size="sm"
                onClick={onToggleStatus}
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
            )}
          </div>
        </>
      )}
    </div>
  );
};
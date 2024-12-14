import { Button } from "@/components/ui/button";
import { UserMinus, Check, X, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Member } from "./types";

interface Props {
  members: Member[];
  editingId: string | null;
  editValue: string;
  loading: boolean;
  onEdit: (member: Member) => void;
  onUpdate: (id: string, newName: string) => void;
  onCancelEdit: () => void;
  onToggleStatus: (member: Member) => void;
  setEditValue: (value: string) => void;
}

export const FamilyMembersList = ({
  members,
  editingId,
  editValue,
  loading,
  onEdit,
  onUpdate,
  onCancelEdit,
  onToggleStatus,
  setEditValue,
}: Props) => {
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
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onUpdate(member.id, editValue)}
                disabled={!editValue.trim() || editValue === member.name}
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
              <span className="flex-1">
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMinus, Check, X, Edit2 } from "lucide-react";
import { MemberWithInvestments } from "@/types/member";

interface MemberListItemProps {
  member: MemberWithInvestments;
  editingId: string | null;
  editValue: string;
  loading: boolean;
  onEdit: (member: MemberWithInvestments) => void;
  onUpdate: (id: string, name: string) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
  onToggleStatus: (member: MemberWithInvestments) => void;
}

export const MemberListItem = ({
  member,
  editingId,
  editValue,
  loading,
  onEdit,
  onUpdate,
  onCancelEdit,
  onEditValueChange,
  onToggleStatus,
}: MemberListItemProps) => {
  const isEditing = editingId === member.id;

  return (
    <div className="flex items-center justify-between p-2 bg-background rounded-lg border">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1 mr-2">
          <Input
            value={editValue}
            onChange={(e) => onEditValueChange(e.target.value)}
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
          <span className="flex-1 cursor-pointer" onClick={() => onEdit(member)}>
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
  );
};
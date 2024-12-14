import { MemberListProps } from "./types";
import { MemberItem } from "./MemberItem";

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
        <MemberItem
          key={member.id}
          member={member}
          isEditing={editingId === member.id}
          editValue={editValue}
          editRelationship={editRelationship}
          loading={loading}
          onEdit={() => onEdit(member)}
          onUpdate={() => onUpdate(member.id, editValue, editRelationship)}
          onCancel={onCancelEdit}
          onToggleStatus={() => onToggleStatus(member)}
          setEditValue={setEditValue}
          setEditRelationship={setEditRelationship}
        />
      ))}
    </div>
  );
};
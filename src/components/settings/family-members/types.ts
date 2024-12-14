export interface Member {
  id: string;
  name: string;
  status: string;
  relationship?: string;
  investment_count: number;
}

export interface AddMemberFormProps {
  newMember: string;
  relationship: string;
  loading: boolean;
  onAdd: () => void;
  onMemberChange: (value: string) => void;
  onRelationshipChange: (value: string) => void;
}

export interface MemberListProps {
  members: Member[];
  editingId: string | null;
  editValue: string;
  editRelationship: string;
  loading: boolean;
  onEdit: (member: Member) => void;
  onUpdate: (id: string, newName: string, relationship: string) => void;
  onCancelEdit: () => void;
  onToggleStatus: (member: Member) => void;
  setEditValue: (value: string) => void;
  setEditRelationship: (value: string) => void;
}
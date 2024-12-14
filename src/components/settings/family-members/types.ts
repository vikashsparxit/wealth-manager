import { FamilyRelationship } from "@/types/investment";

export interface Member {
  id: string;
  name: string;
  status: string;
  relationship?: FamilyRelationship;
  investment_count: number;
}

export interface AddMemberFormProps {
  newMember: string;
  relationship: FamilyRelationship;
  loading: boolean;
  onAdd: () => void;
  onMemberChange: (value: string) => void;
  onRelationshipChange: (value: FamilyRelationship) => void;
}

export interface MemberListProps {
  members: Member[];
  editingId: string | null;
  editValue: string;
  editRelationship: FamilyRelationship;
  loading: boolean;
  onEdit: (member: Member) => void;
  onUpdate: (id: string, newName: string, relationship: FamilyRelationship) => void;
  onCancelEdit: () => void;
  onToggleStatus: (member: Member) => void;
  setEditValue: (value: string) => void;
  setEditRelationship: (value: FamilyRelationship) => void;
}
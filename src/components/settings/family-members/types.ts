import { FamilyMember } from "@/types/investment";

export interface Member {
  id: string;
  name: string;
  status: string;
  investment_count: number;
  relationship?: string;
}

export type RelationshipType = "Spouse" | "Child" | "Parent" | "Sibling" | "Other";

export interface AddMemberFormProps {
  newMember: string;
  loading: boolean;
  relationship: RelationshipType;
  onAdd: () => void;
  onChange: (value: string) => void;
  onRelationshipChange: (value: RelationshipType) => void;
}

export interface MemberListProps {
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
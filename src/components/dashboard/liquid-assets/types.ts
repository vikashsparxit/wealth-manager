import { FamilyMember, LiquidAsset, FamilyRelationship } from "@/types/investment";

export interface FamilyMemberData {
  name: FamilyMember;
  relationship?: FamilyRelationship;
}

export interface LiquidAssetsDialogProps {
  liquidAssets: LiquidAsset[];
  onUpdate: (amount: number, owner: FamilyMember) => void;
  selectedMember: "Wealth Combined" | FamilyMember;
}

export interface LiquidAssetFormProps {
  amount: string;
  owner: FamilyMember;
  familyMembers: FamilyMemberData[];
  selectedMember: "Wealth Combined" | FamilyMember;
  onAmountChange: (value: string) => void;
  onOwnerChange: (value: FamilyMember) => void;
  onSave: () => void;
}
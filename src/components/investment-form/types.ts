import { Investment, InvestmentType, FamilyMember, FamilyRelationship } from "@/types/investment";

export interface InvestmentFormProps {
  onSubmit: (investment: Omit<Investment, "id">) => void;
  onCancel: () => void;
  investment?: Investment;
}

export interface InvestmentFormState {
  type: string;
  owner: string;
  investedAmount: string;
  currentValue: string;
  dateOfInvestment: string;
  notes: string;
}

export interface AmountInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description: string;
}

export interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  maxDate: string;
}

export interface NotesInputProps {
  value: string;
  onChange: (value: string) => void;
}

export interface FormActionsProps {
  onCancel: () => void;
  isEdit: boolean;
}
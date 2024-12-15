import { InvestmentTypeSelect } from "../investment/InvestmentTypeSelect";
import { OwnerSelect } from "../investment/OwnerSelect";
import { AmountInput } from "./AmountInput";
import { DateInput } from "./DateInput";
import { NotesInput } from "./NotesInput";
import { FormActions } from "./FormActions";
import { Investment, InvestmentType, FamilyMember, FamilyRelationship } from "@/types/investment";

interface InvestmentFormContentProps {
  formData: {
    type: string;
    owner: string;
    investedAmount: string;
    currentValue: string;
    dateOfInvestment: string;
    notes: string;
  };
  setFormData: (data: any) => void;
  investmentTypes: Array<{ name: InvestmentType }>;
  showMemberSelect: boolean;
  familyMembers: Array<{ name: FamilyMember; relationship?: FamilyRelationship }>;
  onCancel: () => void;
  isEdit: boolean;
}

export const InvestmentFormContent = ({
  formData,
  setFormData,
  investmentTypes,
  showMemberSelect,
  familyMembers,
  onCancel,
  isEdit,
}: InvestmentFormContentProps) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4 overflow-y-auto pr-2">
      <InvestmentTypeSelect
        value={formData.type as InvestmentType | ""}
        types={investmentTypes}
        onChange={(value) => setFormData({ ...formData, type: value })}
      />

      {showMemberSelect && (
        <OwnerSelect
          value={formData.owner as FamilyMember}
          owners={familyMembers}
          onChange={(value) => setFormData({ ...formData, owner: value })}
        />
      )}

      <AmountInput
        label="Invested Amount"
        value={formData.investedAmount}
        onChange={(value) => setFormData({ ...formData, investedAmount: value })}
        description="Enter the initial amount invested"
      />

      <AmountInput
        label="Current Value"
        value={formData.currentValue}
        onChange={(value) => setFormData({ ...formData, currentValue: value })}
        description="Enter the current value of the investment"
      />

      <DateInput
        value={formData.dateOfInvestment}
        onChange={(value) => setFormData({ ...formData, dateOfInvestment: value })}
        maxDate={today}
      />

      <NotesInput
        value={formData.notes}
        onChange={(value) => setFormData({ ...formData, notes: value })}
      />

      <FormActions
        onCancel={onCancel}
        isEdit={isEdit}
      />
    </form>
  );
};
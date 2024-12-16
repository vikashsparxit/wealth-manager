import { InvestmentTypeSelect } from "../investment/InvestmentTypeSelect";
import { OwnerSelect } from "../investment/OwnerSelect";
import { AmountInput } from "./AmountInput";
import { DateInput } from "./DateInput";
import { NotesInput } from "./NotesInput";
import { FormActions } from "./FormActions";
import { OCRUpload } from "./OCRUpload";
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
  onSubmit: (e: React.FormEvent) => void;
}

export const InvestmentFormContent = ({
  formData,
  setFormData,
  investmentTypes,
  showMemberSelect,
  familyMembers,
  onCancel,
  isEdit,
  onSubmit,
}: InvestmentFormContentProps) => {
  const today = new Date().toISOString().split("T")[0];

  const handleOCRData = (extractedData: {
    investedAmount?: string;
    currentValue?: string;
    dateOfInvestment?: string;
  }) => {
    setFormData({
      ...formData,
      ...extractedData,
    });
  };

  console.log("InvestmentFormContent - Family members:", familyMembers);
  console.log("InvestmentFormContent - Show member select:", showMemberSelect);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <OCRUpload onExtractedData={handleOCRData} />
      
      <InvestmentTypeSelect
        value={formData.type as InvestmentType | ""}
        types={investmentTypes}
        onChange={(value) => setFormData({ ...formData, type: value })}
      />

      {familyMembers.length > 0 && (
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
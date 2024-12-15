import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvestmentFormContent } from "./investment-form/InvestmentFormContent";
import { useInvestmentForm } from "@/hooks/useInvestmentForm";
import { InvestmentFormProps } from "./investment-form/types";

export const InvestmentForm = ({ onSubmit, onCancel, investment }: InvestmentFormProps) => {
  const {
    formData,
    setFormData,
    investmentTypes,
    familyMembers,
    loading,
    showMemberSelect,
    handleSubmit,
  } = useInvestmentForm(investment, onSubmit);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 100);
      onCancel();
    }
  };

  if (loading) {
    return null;
  }

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {investment ? "Edit Investment" : "Add Investment"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-6 -mr-6">
          <InvestmentFormContent
            formData={formData}
            setFormData={setFormData}
            investmentTypes={investmentTypes}
            showMemberSelect={false}
            familyMembers={familyMembers}
            onCancel={onCancel}
            isEdit={!!investment}
            onSubmit={handleSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
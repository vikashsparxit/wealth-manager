import { useState, useEffect } from "react";
import { Investment, InvestmentType, FamilyMember, FamilyRelationship } from "@/types/investment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { InvestmentTypeSelect } from "./investment/InvestmentTypeSelect";
import { OwnerSelect } from "./investment/OwnerSelect";
import { useToast } from "@/components/ui/use-toast";
import { AmountInput } from "./investment-form/AmountInput";
import { DateInput } from "./investment-form/DateInput";
import { NotesInput } from "./investment-form/NotesInput";
import { FormActions } from "./investment-form/FormActions";
import { InvestmentFormProps } from "./investment-form/types";

interface FamilyMemberData {
  name: FamilyMember;
  relationship?: FamilyRelationship;
}

export const InvestmentForm = ({ onSubmit, onCancel, investment }: InvestmentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investmentTypes, setInvestmentTypes] = useState<Array<{ name: InvestmentType }>>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMemberSelect, setShowMemberSelect] = useState(false);

  const [formData, setFormData] = useState({
    type: investment?.type || "",
    owner: investment?.owner || "Myself",
    investedAmount: investment?.investedAmount?.toString() || "",
    currentValue: investment?.currentValue?.toString() || "",
    dateOfInvestment: investment?.dateOfInvestment || new Date().toISOString().split("T")[0],
    notes: investment?.notes || "",
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const [typesResponse, membersResponse] = await Promise.all([
          supabase
            .from('investment_types')
            .select('name')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('name'),
          supabase
            .from('family_members')
            .select('name, relationship')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('relationship', { ascending: true })
        ]);

        if (typesResponse.error) throw typesResponse.error;
        if (membersResponse.error) throw membersResponse.error;

        console.log("Loaded family members:", membersResponse.data);
        
        // Filter and validate family members
        const validMembers = membersResponse.data
          .filter((member): member is { name: FamilyMember; relationship: FamilyRelationship } => {
            return ['Myself', 'My Wife', 'My Daughter'].includes(member.name) && 
                   ['Primary User', 'Spouse', 'Son', 'Daughter', 'Other'].includes(member.relationship || '');
          });

        console.log("Valid family members after filtering:", validMembers);
        setInvestmentTypes(typesResponse.data as Array<{ name: InvestmentType }>);
        setFamilyMembers(validMembers);
        
        // Set showMemberSelect based on the number of active family members
        const shouldShowMemberSelect = validMembers.length > 1;
        setShowMemberSelect(shouldShowMemberSelect);
        
        if (!investment) {
          // Set default values
          const primaryUser = validMembers.find(m => m.relationship === 'Primary User');
          if (primaryUser) {
            setFormData(prev => ({
              ...prev,
              type: typesResponse.data[0]?.name || "",
              owner: primaryUser.name
            }));
          }
        }
      } catch (error) {
        console.error('Error loading form data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, investment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: formData.type as InvestmentType,
      owner: formData.owner as FamilyMember,
      investedAmount: Number(formData.investedAmount),
      currentValue: Number(formData.currentValue),
      dateOfInvestment: formData.dateOfInvestment,
      notes: formData.notes,
    });
  };

  const today = new Date().toISOString().split("T")[0];

  if (loading) {
    return null;
  }

  return (
    <Dialog open onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {investment ? "Edit Investment" : "Add Investment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            isEdit={!!investment}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};
import { useState, useEffect } from "react";
import { Investment, InvestmentType, FamilyMember } from "@/types/investment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { InvestmentTypeSelect } from "./investment/InvestmentTypeSelect";
import { OwnerSelect } from "./investment/OwnerSelect";

interface Props {
  onSubmit: (investment: Omit<Investment, "id">) => void;
  onCancel: () => void;
  investment?: Investment;
}

export const InvestmentForm = ({ onSubmit, onCancel, investment }: Props) => {
  const { user } = useAuth();
  const [investmentTypes, setInvestmentTypes] = useState<Array<{ name: InvestmentType }>>([]);
  const [familyMembers, setFamilyMembers] = useState<Array<{ name: FamilyMember }>>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<{
    type: string;
    owner: FamilyMember;
    investedAmount: string;
    currentValue: string;
    dateOfInvestment: string;
    notes: string;
  }>({
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
            .select('name')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at')
        ]);

        if (typesResponse.error) throw typesResponse.error;
        if (membersResponse.error) throw membersResponse.error;

        setInvestmentTypes(typesResponse.data as Array<{ name: InvestmentType }>);
        setFamilyMembers(membersResponse.data as Array<{ name: FamilyMember }>);
        
        if (!investment && typesResponse.data.length > 0 && membersResponse.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            type: typesResponse.data[0].name,
            owner: membersResponse.data[0].name as FamilyMember
          }));
        }
      } catch (error) {
        console.error('Error loading form data:', error);
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
      owner: formData.owner,
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

          {familyMembers.length > 1 && (
            <OwnerSelect
              value={formData.owner}
              owners={familyMembers}
              onChange={(value) => setFormData({ ...formData, owner: value as FamilyMember })}
            />
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Invested Amount</label>
            <Input
              type="number"
              value={formData.investedAmount}
              onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
              required
              aria-describedby="invested-amount-description"
            />
            <p id="invested-amount-description" className="sr-only">Enter the initial amount invested</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Value</label>
            <Input
              type="number"
              value={formData.currentValue}
              onChange={(e) => setFormData({ ...formData, currentValue: e.target.value })}
              required
              aria-describedby="current-value-description"
            />
            <p id="current-value-description" className="sr-only">Enter the current value of the investment</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Investment</label>
            <Input
              type="date"
              value={formData.dateOfInvestment}
              onChange={(e) => setFormData({ ...formData, dateOfInvestment: e.target.value })}
              max={today}
              required
              aria-describedby="date-description"
            />
            <p id="date-description" className="sr-only">Select the date when the investment was made</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Optional notes..."
              aria-describedby="notes-description"
            />
            <p id="notes-description" className="sr-only">Add any additional notes about the investment</p>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {investment ? "Update" : "Add"} Investment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
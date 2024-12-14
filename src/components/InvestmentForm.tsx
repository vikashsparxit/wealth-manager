import { useState, useEffect } from "react";
import { Investment, InvestmentType } from "@/types/investment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  onSubmit: (investment: Omit<Investment, "id">) => void;
  onCancel: () => void;
  investment?: Investment;
}

export const InvestmentForm = ({ onSubmit, onCancel, investment }: Props) => {
  const { user } = useAuth();
  const [investmentTypes, setInvestmentTypes] = useState<Array<{ name: string }>>([]);
  const [familyMembers, setFamilyMembers] = useState<Array<{ name: string }>>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    type: investment?.type || "",
    owner: investment?.owner || "",
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
            .order('name')
        ]);

        if (typesResponse.error) throw typesResponse.error;
        if (membersResponse.error) throw membersResponse.error;

        setInvestmentTypes(typesResponse.data);
        setFamilyMembers(membersResponse.data);
        
        // Set default values if not editing
        if (!investment) {
          setFormData(prev => ({
            ...prev,
            type: typesResponse.data[0]?.name || "",
            owner: membersResponse.data[0]?.name || ""
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
    return null; // or a loading spinner
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Investment Type</label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {investmentTypes.map(({ name }) => (
                  <SelectItem 
                    key={name} 
                    value={name}
                    className="cursor-pointer hover:bg-accent focus:bg-accent"
                  >
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Owner</label>
            <Select
              value={formData.owner}
              onValueChange={(value) =>
                setFormData({ ...formData, owner: value })
              }
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto">
                {familyMembers.map(({ name }) => (
                  <SelectItem 
                    key={name} 
                    value={name}
                    className="cursor-pointer hover:bg-accent focus:bg-accent"
                  >
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Invested Amount</label>
            <Input
              type="number"
              value={formData.investedAmount}
              onChange={(e) =>
                setFormData({ ...formData, investedAmount: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Current Value</label>
            <Input
              type="number"
              value={formData.currentValue}
              onChange={(e) =>
                setFormData({ ...formData, currentValue: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date of Investment</label>
            <Input
              type="date"
              value={formData.dateOfInvestment}
              onChange={(e) =>
                setFormData({ ...formData, dateOfInvestment: e.target.value })
              }
              max={today}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Notes</label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Optional notes..."
            />
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
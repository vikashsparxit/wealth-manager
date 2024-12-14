import { useState } from "react";
import { Investment, InvestmentType, FamilyMember } from "@/types/investment";
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

const investmentTypes: InvestmentType[] = [
  "Real Estate",
  "Gold",
  "Bonds",
  "LIC",
  "ULIP",
  "Sukanya Samridhi",
  "Mutual Funds",
  "Stocks",
  "NPS",
  "PPF",
  "Startups",
];

const familyMembers: FamilyMember[] = ["Myself", "My Wife", "My Daughter"];

interface Props {
  onSubmit: (investment: Omit<Investment, "id">) => void;
  onCancel: () => void;
  investment?: Investment;
}

export const InvestmentForm = ({ onSubmit, onCancel, investment }: Props) => {
  const [formData, setFormData] = useState({
    type: investment?.type || investmentTypes[0],
    owner: investment?.owner || familyMembers[0],
    investedAmount: investment?.investedAmount?.toString() || "",
    currentValue: investment?.currentValue?.toString() || "",
    dateOfInvestment: investment?.dateOfInvestment || new Date().toISOString().split("T")[0],
    notes: investment?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      type: formData.type,
      owner: formData.owner,
      investedAmount: Number(formData.investedAmount),
      currentValue: Number(formData.currentValue),
      dateOfInvestment: formData.dateOfInvestment,
      notes: formData.notes,
    });
  };

  const today = new Date().toISOString().split("T")[0];

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
                setFormData({ ...formData, type: value as InvestmentType })
              }
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg">
                {investmentTypes.map((type) => (
                  <SelectItem 
                    key={type} 
                    value={type}
                    className="cursor-pointer hover:bg-accent focus:bg-accent"
                  >
                    {type}
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
                setFormData({ ...formData, owner: value as FamilyMember })
              }
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent className="bg-background border shadow-lg">
                {familyMembers.map((member) => (
                  <SelectItem 
                    key={member} 
                    value={member}
                    className="cursor-pointer hover:bg-accent focus:bg-accent"
                  >
                    {member}
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

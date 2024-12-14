import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { CurrencyType } from "@/types/investment";

const currencies = [
  { value: "INR" as CurrencyType, label: "Indian Rupee (₹)" },
  { value: "USD" as CurrencyType, label: "US Dollar ($)" },
  { value: "EUR" as CurrencyType, label: "Euro (€)" },
  { value: "GBP" as CurrencyType, label: "British Pound (£)" },
  { value: "JPY" as CurrencyType, label: "Japanese Yen (¥)" },
  { value: "AUD" as CurrencyType, label: "Australian Dollar (A$)" },
  { value: "CAD" as CurrencyType, label: "Canadian Dollar (C$)" },
  { value: "CHF" as CurrencyType, label: "Swiss Franc (Fr)" },
  { value: "CNY" as CurrencyType, label: "Chinese Yuan (¥)" },
  { value: "HKD" as CurrencyType, label: "Hong Kong Dollar (HK$)" },
  { value: "NZD" as CurrencyType, label: "New Zealand Dollar (NZ$)" },
  { value: "SGD" as CurrencyType, label: "Singapore Dollar (S$)" },
] as const;

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const { settings, updateSettings } = useSettings();
  const [dashboardName, setDashboardName] = useState(settings?.dashboard_name || "");
  const [currency, setCurrency] = useState<CurrencyType>(settings?.base_currency || "INR");

  const handleCurrencyChange = (value: string) => {
    if (currencies.some(curr => curr.value === value)) {
      setCurrency(value as CurrencyType);
    }
  };

  const handleSave = () => {
    updateSettings({
      dashboard_name: dashboardName,
      base_currency: currency
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dashboard Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Dashboard Name
            </label>
            <Input
              id="name"
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="My Wealth Dashboard"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="currency" className="text-sm font-medium">
              Base Currency
            </label>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="currency" className="w-full bg-background">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px] overflow-y-auto bg-background border shadow-lg">
                {currencies.map((curr) => (
                  <SelectItem 
                    key={curr.value} 
                    value={curr.value}
                    className="cursor-pointer hover:bg-accent focus:bg-accent"
                  >
                    {curr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
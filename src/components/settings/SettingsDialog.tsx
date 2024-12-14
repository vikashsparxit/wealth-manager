import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useSettings } from "@/hooks/useSettings";

const currencies = [
  { value: "INR", label: "Indian Rupee (₹)" },
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
  { value: "GBP", label: "British Pound (£)" },
] as const;

type CurrencyType = typeof currencies[number]["value"];

export const SettingsDialog = () => {
  const { settings, updateSettings } = useSettings();
  const [open, setOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState(settings?.dashboard_name || "");
  const [currency, setCurrency] = useState<CurrencyType>(settings?.base_currency || "INR");

  const handleCurrencyChange = (value: string) => {
    // Type guard to ensure value is a valid currency
    if (currencies.some(curr => curr.value === value)) {
      setCurrency(value as CurrencyType);
    }
  };

  const handleSave = () => {
    updateSettings({
      dashboard_name: dashboardName,
      base_currency: currency
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
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
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((curr) => (
                  <SelectItem key={curr.value} value={curr.value}>
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
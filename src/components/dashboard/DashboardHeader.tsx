import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { useSettings } from "@/hooks/useSettings";

interface DashboardHeaderProps {
  onAddInvestment: () => void;
}

export const DashboardHeader = ({ onAddInvestment }: DashboardHeaderProps) => {
  const { settings } = useSettings();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{settings?.dashboard_name || "My Wealth Dashboard"}</h1>
      <div className="flex gap-4">
        <SettingsDialog />
        <AuthButton />
        <Button onClick={onAddInvestment}>
          <Plus className="mr-2 h-4 w-4" />
          Add Investment
        </Button>
      </div>
    </div>
  );
};
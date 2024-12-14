import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onAddInvestment: () => void;
}

export const DashboardHeader = ({ onAddInvestment }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Family Wealth Manager</h1>
      <Button onClick={onAddInvestment}>Add Investment</Button>
    </div>
  );
};
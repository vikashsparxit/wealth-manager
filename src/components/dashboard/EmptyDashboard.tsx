import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyDashboardProps {
  onAddInvestment: () => void;
}

export const EmptyDashboard = ({ onAddInvestment }: EmptyDashboardProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Welcome to Your Wealth Dashboard</h2>
        <p className="text-muted-foreground">
          Get started by adding your first investment to track your family's wealth
        </p>
      </div>
      <Button onClick={onAddInvestment} size="lg">
        <Plus className="mr-2 h-4 w-4" />
        Add Your First Investment
      </Button>
    </div>
  );
};
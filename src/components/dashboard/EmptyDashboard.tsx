import { Button } from "@/components/ui/button";
import { Plus, Users, List } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";

interface EmptyDashboardProps {
  onAddInvestment: () => void;
  onManageMembers: () => void;
  onManageTypes: () => void;
}

export const EmptyDashboard = ({ 
  onAddInvestment, 
  onManageMembers, 
  onManageTypes 
}: EmptyDashboardProps) => {
  const { settings } = useSettings();
  const dashboardName = settings?.dashboard_name || "My Wealth Dashboard";

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Welcome to {dashboardName}</h2>
        <p className="text-muted-foreground">
          Get started by setting up your dashboard
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button onClick={onManageMembers} variant="outline" className="space-x-2">
          <Users className="h-4 w-4" />
          <span>Manage Members</span>
        </Button>
        
        <Button onClick={onManageTypes} variant="outline" className="space-x-2">
          <List className="h-4 w-4" />
          <span>Manage Types</span>
        </Button>
        
        <Button onClick={onAddInvestment} className="space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Investment</span>
        </Button>
      </div>
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Plus, Users, List } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FamilyMembersManager } from "@/components/settings/family-members/FamilyMembersManager";
import { InvestmentTypesManager } from "@/components/settings/investment-types/InvestmentTypesManager";
import { useState } from "react";

interface EmptyDashboardProps {
  onAddInvestment: () => void;
}

export const EmptyDashboard = ({ onAddInvestment }: EmptyDashboardProps) => {
  const { settings } = useSettings();
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showTypesDialog, setShowTypesDialog] = useState(false);
  const dashboardName = settings?.dashboard_name || "My Wealth Dashboard";

  const handleDialogChange = (setter: (open: boolean) => void) => (open: boolean) => {
    setter(open);
    // Add a small delay before enabling interactions
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 100);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-8 text-center">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Welcome to {dashboardName}</h2>
        <p className="text-muted-foreground">
          Get started by setting up your dashboard
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="space-x-2" 
          onClick={() => setShowMembersDialog(true)}
        >
          <Users className="h-4 w-4" />
          <span>Manage Members</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="space-x-2" 
          onClick={() => setShowTypesDialog(true)}
        >
          <List className="h-4 w-4" />
          <span>Manage Types</span>
        </Button>
        
        <Button onClick={onAddInvestment} className="space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Investment</span>
        </Button>
      </div>

      <Dialog open={showMembersDialog} onOpenChange={handleDialogChange(setShowMembersDialog)}>
        <DialogContent>
          <FamilyMembersManager />
        </DialogContent>
      </Dialog>

      <Dialog open={showTypesDialog} onOpenChange={handleDialogChange(setShowTypesDialog)}>
        <DialogContent>
          <InvestmentTypesManager />
        </DialogContent>
      </Dialog>
    </div>
  );
};
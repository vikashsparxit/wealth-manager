import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { useState, useCallback } from "react";
import { ProfileDialog } from "@/components/profile/ProfileDialog";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FamilyMembersManager } from "@/components/settings/family-members/FamilyMembersManager";
import { InvestmentTypesManager } from "@/components/settings/InvestmentTypesManager";
import { CreateShareDialog } from "@/components/share/CreateShareDialog";
import { ManageSharesDialog } from "@/components/share/ManageSharesDialog";
import { ActivityLogModal } from "@/components/activity-log/ActivityLogModal";
import { ProfileMenu } from "./header/ProfileMenu";

interface DashboardHeaderProps {
  onAddInvestment: () => void;
}

export const DashboardHeader = ({ onAddInvestment }: DashboardHeaderProps) => {
  const { settings } = useSettings();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showTypesDialog, setShowTypesDialog] = useState(false);
  const [showCreateShareDialog, setShowCreateShareDialog] = useState(false);
  const [showManageSharesDialog, setShowManageSharesDialog] = useState(false);
  const [showActivityLogModal, setShowActivityLogModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dashboardName = settings?.dashboard_name ? `${settings.dashboard_name} Dashboard` : "My Wealth Dashboard";

  const handleDialogChange = useCallback((setter: (open: boolean) => void) => (open: boolean) => {
    setter(open);
    setDropdownOpen(false);
    
    if (!open) {
      document.body.style.pointerEvents = 'none';
      setTimeout(() => {
        document.body.style.pointerEvents = 'auto';
      }, 100);
    }
  }, []);

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{dashboardName}</h1>
      <div className="flex gap-4 items-center">
        <Button onClick={onAddInvestment}>
          <Plus className="mr-2 h-4 w-4" />
          Add Investment
        </Button>

        <Button 
          variant="outline"
          onClick={() => setShowCreateShareDialog(true)}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>

        <ProfileMenu
          onOpenProfile={() => setShowProfileDialog(true)}
          onOpenActivityLog={() => setShowActivityLogModal(true)}
          onOpenSettings={() => setShowSettingsDialog(true)}
          onOpenMembers={() => setShowMembersDialog(true)}
          onOpenTypes={() => setShowTypesDialog(true)}
          onOpenShares={() => setShowManageSharesDialog(true)}
          dropdownOpen={dropdownOpen}
          onDropdownOpenChange={setDropdownOpen}
        />
      </div>

      <ProfileDialog 
        open={showProfileDialog} 
        onOpenChange={handleDialogChange(setShowProfileDialog)}
      />
      
      <SettingsDialog 
        open={showSettingsDialog} 
        onOpenChange={handleDialogChange(setShowSettingsDialog)}
      />

      <Dialog 
        open={showMembersDialog} 
        onOpenChange={handleDialogChange(setShowMembersDialog)}
      >
        <DialogContent>
          <DialogTitle>Manage Family Members</DialogTitle>
          <FamilyMembersManager />
        </DialogContent>
      </Dialog>

      <Dialog 
        open={showTypesDialog} 
        onOpenChange={handleDialogChange(setShowTypesDialog)}
      >
        <DialogContent>
          <DialogTitle>Manage Investment Types</DialogTitle>
          <InvestmentTypesManager />
        </DialogContent>
      </Dialog>

      <CreateShareDialog
        open={showCreateShareDialog}
        onOpenChange={handleDialogChange(setShowCreateShareDialog)}
      />

      <ManageSharesDialog
        open={showManageSharesDialog}
        onOpenChange={handleDialogChange(setShowManageSharesDialog)}
      />

      <ActivityLogModal
        open={showActivityLogModal}
        onOpenChange={handleDialogChange(setShowActivityLogModal)}
      />
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Plus, Share2 } from "lucide-react";
import { AuthButton } from "@/components/auth/AuthButton";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { useSettings } from "@/hooks/useSettings";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useCallback } from "react";
import { ProfileDialog } from "@/components/profile/ProfileDialog";
import { FamilyMembersManager } from "@/components/settings/family-members/FamilyMembersManager";
import { InvestmentTypesManager } from "@/components/settings/InvestmentTypesManager";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CreateShareDialog } from "@/components/share/CreateShareDialog";
import { ManageSharesDialog } from "@/components/share/ManageSharesDialog";

interface DashboardHeaderProps {
  onAddInvestment: () => void;
}

export const DashboardHeader = ({ onAddInvestment }: DashboardHeaderProps) => {
  const { settings } = useSettings();
  const { user, signOut } = useAuth();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [showTypesDialog, setShowTypesDialog] = useState(false);
  const [showCreateShareDialog, setShowCreateShareDialog] = useState(false);
  const [showManageSharesDialog, setShowManageSharesDialog] = useState(false);
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

  const handleMenuItemClick = useCallback((action: () => void) => {
    setDropdownOpen(false);
    action();
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

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.user_metadata.avatar_url} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="w-56 p-2 bg-background border shadow-lg"
          >
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick(() => setShowProfileDialog(true))}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick(() => setShowSettingsDialog(true))}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick(() => setShowMembersDialog(true))}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
            >
              Manage Members
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick(() => setShowTypesDialog(true))}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
            >
              Manage Types
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick(() => setShowManageSharesDialog(true))}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
            >
              Manage Shares
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleMenuItemClick(signOut)}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md text-destructive"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
    </div>
  );
};
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
import { useState } from "react";
import { ProfileDialog } from "@/components/profile/ProfileDialog";
import { FamilyMembersManager } from "@/components/settings/FamilyMembersManager";
import { InvestmentTypesManager } from "@/components/settings/InvestmentTypesManager";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  
  const dashboardName = settings?.dashboard_name ? `${settings.dashboard_name} Dashboard` : "My Wealth Dashboard";

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">{dashboardName}</h1>
      <div className="flex gap-4 items-center">
        <DropdownMenu>
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
          <DropdownMenuContent align="end" className="w-56 p-2">
            <DropdownMenuItem 
              onClick={() => setShowProfileDialog(true)}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowSettingsDialog(true)}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowMembersDialog(true)}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
            >
              Manage Members
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowTypesDialog(true)}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
            >
              Manage Types
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={signOut}
              className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md text-destructive"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={onAddInvestment}>
          <Plus className="mr-2 h-4 w-4" />
          Add Investment
        </Button>
      </div>

      <ProfileDialog 
        open={showProfileDialog} 
        onOpenChange={setShowProfileDialog} 
      />
      
      <SettingsDialog 
        open={showSettingsDialog} 
        onOpenChange={setShowSettingsDialog} 
      />

      <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Family Members</DialogTitle>
          </DialogHeader>
          <FamilyMembersManager />
        </DialogContent>
      </Dialog>

      <Dialog open={showTypesDialog} onOpenChange={setShowTypesDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Investment Types</DialogTitle>
          </DialogHeader>
          <InvestmentTypesManager />
        </DialogContent>
      </Dialog>
    </div>
  );
};
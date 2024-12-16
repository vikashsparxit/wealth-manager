import { Activity } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileMenuProps {
  onOpenProfile: () => void;
  onOpenActivityLog: () => void;
  onOpenSettings: () => void;
  onOpenMembers: () => void;
  onOpenTypes: () => void;
  onOpenShares: () => void;
  dropdownOpen: boolean;
  onDropdownOpenChange: (open: boolean) => void;
}

export const ProfileMenu = ({
  onOpenProfile,
  onOpenActivityLog,
  onOpenSettings,
  onOpenMembers,
  onOpenTypes,
  onOpenShares,
  dropdownOpen,
  onDropdownOpenChange,
}: ProfileMenuProps) => {
  const { user, signOut } = useAuth();

  const handleMenuItemClick = (action: () => void) => {
    onDropdownOpenChange(false);
    action();
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={onDropdownOpenChange}>
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
          onClick={() => handleMenuItemClick(onOpenProfile)}
          className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
        >
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleMenuItemClick(onOpenActivityLog)}
          className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
        >
          <Activity className="mr-2 h-4 w-4" />
          Activity Log
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleMenuItemClick(onOpenSettings)}
          className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
        >
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleMenuItemClick(onOpenMembers)}
          className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
        >
          Manage Members
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleMenuItemClick(onOpenTypes)}
          className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
        >
          Manage Types
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleMenuItemClick(onOpenShares)}
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
  );
};
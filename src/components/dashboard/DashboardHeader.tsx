import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SettingsDialog } from "@/components/settings/SettingsDialog";
import { ProfileDialog } from "@/components/profile/ProfileDialog";
import { CreateShareDialog } from "@/components/share/CreateShareDialog";
import { Settings2, UserCircle2, Share2 } from "lucide-react";

export function DashboardHeader() {
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowShareDialog(true)}
          title="Share Dashboard"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowSettings(true)}
          title="Settings"
        >
          <Settings2 className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowProfile(true)}
          title="Profile"
        >
          <UserCircle2 className="h-4 w-4" />
        </Button>
      </div>

      <SettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
      />
      
      <ProfileDialog
        open={showProfile}
        onOpenChange={setShowProfile}
      />

      <CreateShareDialog
        open={showShareDialog}
        onOpenChange={setShowShareDialog}
      />
    </div>
  );
}
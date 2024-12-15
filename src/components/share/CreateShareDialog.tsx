import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { generateSecureToken, hashPassword } from "@/lib/security";
import { ManageSharesDialog } from "./ManageSharesDialog";

interface CreateShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateShareDialog({ open, onOpenChange }: CreateShareDialogProps) {
  const [password, setPassword] = useState("");
  const [expiration, setExpiration] = useState("1"); // days
  const [isLoading, setIsLoading] = useState(false);
  const [showManageShares, setShowManageShares] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleCreate = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      // Validate password
      if (password.length < 6) {
        toast({
          title: "Invalid password",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return;
      }

      // Generate secure token and hash password
      const shareToken = await generateSecureToken();
      const passwordHash = await hashPassword(password);

      // Calculate expiration date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiration));

      // Create shared dashboard record
      const { error } = await supabase
        .from('shared_dashboards')
        .insert({
          user_id: user.id,
          share_token: shareToken,
          password_hash: passwordHash,
          expires_at: expiresAt.toISOString(),
        });

      if (error) throw error;

      // Generate shareable link
      const shareableLink = `${window.location.origin}/share/${shareToken}`;

      // Copy to clipboard
      await navigator.clipboard.writeText(shareableLink);

      toast({
        title: "Share link created!",
        description: "The link has been copied to your clipboard",
      });

      onOpenChange(false);
    } catch (error) {
      console.error('Error creating share link:', error);
      toast({
        title: "Error",
        description: "Failed to create share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Dashboard</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a secure password"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiration">Expires in</Label>
              <Select
                value={expiration}
                onValueChange={setExpiration}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select expiration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Day</SelectItem>
                  <SelectItem value="5">5 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setShowManageShares(true)}
            >
              Manage Shares
            </Button>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreate}
                disabled={isLoading || !password}
              >
                {isLoading ? "Creating..." : "Create Share Link"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ManageSharesDialog
        open={showManageShares}
        onOpenChange={setShowManageShares}
      />
    </>
  );
}
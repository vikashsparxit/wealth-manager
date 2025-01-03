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

  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);

    navigator.clipboard.writeText(newPassword);
    toast({
      title: "Password generated!",
      description: "The password has been copied to your clipboard",
    });
  };

  const handleCreate = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      if (password.length < 6) {
        toast({
          title: "Invalid password",
          description: "Password must be at least 6 characters long",
          variant: "destructive",
        });
        return;
      }

      // Generate a longer token for better security
      const shareToken = await generateSecureToken(64); // Increased from default 32
      const passwordHash = await hashPassword(password);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + parseInt(expiration));

      console.log("Creating share with token:", shareToken);

      const { data, error } = await supabase
        .from('shared_dashboards')
        .insert({
          user_id: user.id,
          share_token: shareToken,
          password_hash: passwordHash,
          expires_at: expiresAt.toISOString(),
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Store the password in localStorage
      if (data) {
        localStorage.setItem(`share_password_${data.id}`, password);
      }

      const shareableLink = `${window.location.origin}/share/${shareToken}`;
      console.log("Generated shareable link:", shareableLink);
      
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
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Share Dashboard</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a secure password"
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  onClick={generatePassword}
                  type="button"
                >
                  Generate
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiration">Expires in</Label>
              <Select
                value={expiration}
                onValueChange={setExpiration}
              >
                <SelectTrigger className="w-full">
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
          <div className="flex justify-between gap-3 mt-6">
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
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Create Share Link
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
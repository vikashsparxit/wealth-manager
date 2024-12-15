import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { Loader2, Trash2, Copy, Key } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface ManageSharesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SharedDashboard {
  id: string;
  share_token: string;
  created_at: string;
  expires_at: string | null;
  status: 'active' | 'revoked';
  password_hash: string;
}

export function ManageSharesDialog({ open, onOpenChange }: ManageSharesDialogProps) {
  const [isRevoking, setIsRevoking] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: shares, isLoading, refetch } = useQuery({
    queryKey: ['shared-dashboards', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('shared_dashboards')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SharedDashboard[];
    },
    enabled: !!user,
  });

  const handleRevoke = async (shareId: string) => {
    try {
      setIsRevoking(shareId);
      const { error } = await supabase
        .from('shared_dashboards')
        .update({ status: 'revoked' })
        .eq('id', shareId);

      if (error) throw error;

      toast({
        title: "Share link revoked",
        description: "The shared dashboard link has been revoked successfully.",
      });

      refetch();
    } catch (error) {
      console.error('Error revoking share:', error);
      toast({
        title: "Error",
        description: "Failed to revoke share link. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRevoking(null);
    }
  };

  const getShareUrl = (token: string) => {
    return `${window.location.origin}/share/${token}`;
  };

  const copyToClipboard = async (token: string, type: 'link' | 'password') => {
    try {
      if (type === 'link') {
        await navigator.clipboard.writeText(getShareUrl(token));
        toast({
          title: "Link copied",
          description: "The share link has been copied to your clipboard.",
        });
      } else {
        // For demo purposes, we'll use a placeholder password since we can't decrypt the hash
        // In a real app, you might want to store the original password temporarily or implement a system
        // to retrieve it securely
        await navigator.clipboard.writeText("Please share the password you created for this link");
        toast({
          title: "Password reminder",
          description: "Please share the password you created for this link.",
        });
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast({
        title: "Error",
        description: "Failed to copy. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Shared Links</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : !shares?.length ? (
            <p className="text-center text-muted-foreground py-8">
              No shared dashboard links found.
            </p>
          ) : (
            <div className="space-y-4">
              {shares.map((share) => (
                <div
                  key={share.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">
                      Created: {format(new Date(share.created_at), 'PPp')}
                    </p>
                    {share.expires_at && (
                      <p className="text-sm text-muted-foreground">
                        Expires: {format(new Date(share.expires_at), 'PPp')}
                      </p>
                    )}
                    <p className={`text-sm ${share.status === 'revoked' ? 'text-destructive' : 'text-muted-foreground'}`}>
                      Status: {share.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {share.status === 'active' && (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(share.share_token, 'link')}
                          className="flex items-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy Link
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => copyToClipboard(share.share_token, 'password')}
                          className="flex items-center gap-2"
                        >
                          <Key className="h-4 w-4" />
                          Password
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleRevoke(share.id)}
                          disabled={isRevoking === share.id}
                        >
                          {isRevoking === share.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
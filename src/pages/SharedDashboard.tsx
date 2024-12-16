import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { verifyPassword } from "@/lib/security";
import { supabase } from "@/integrations/supabase/client";
import { Dashboard } from "@/components/Dashboard";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";

const SharedDashboard = () => {
  const { shareToken } = useParams();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!shareToken) {
    return <Navigate to="/login" replace />;
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      console.log("Verifying share token:", shareToken);
      
      // Fetch the shared dashboard details
      const { data: dashboard, error: fetchError } = await supabase
        .from("shared_dashboards")
        .select("*")
        .eq("share_token", shareToken)
        .eq("status", "active")
        .single();

      console.log("Fetched dashboard:", dashboard);

      if (fetchError || !dashboard) {
        throw new Error("Invalid or expired share link");
      }

      // Check if the link has expired
      if (dashboard.expires_at && new Date(dashboard.expires_at) < new Date()) {
        throw new Error("This share link has expired");
      }

      // Verify the password
      const isValid = await verifyPassword(password, dashboard.password_hash);
      console.log("Password verification result:", isValid);

      if (!isValid) {
        throw new Error("Incorrect password");
      }

      // Log the access attempt
      await supabase.from("share_access").insert({
        shared_dashboard_id: dashboard.id,
        success: true,
        ip_address: null // We'll implement IP tracking later if needed
      });

      setIsVerified(true);
      toast({
        title: "Access granted",
        description: "Welcome to the shared dashboard",
      });
    } catch (err) {
      console.error("Share verification error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to verify password";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Access denied",
        description: errorMessage,
      });

      // Log failed attempt
      if (shareToken) {
        await supabase.from("share_access").insert({
          shared_dashboard_id: shareToken,
          success: false,
          ip_address: null
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerified) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Protected Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Enter the password to access this shared dashboard
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
              minLength={6}
            />
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isVerifying || password.length < 6}
          >
            {isVerifying ? "Verifying..." : "Access Dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default SharedDashboard;
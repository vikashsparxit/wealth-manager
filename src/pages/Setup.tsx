import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Setup = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUserSetup = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profile?.full_name) {
        // User already has a name set, redirect to dashboard
        navigate("/");
      }
    };

    checkUserSetup();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !user) return;

    try {
      setLoading(true);
      console.log("Updating user profile with name:", name);

      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: name.trim() })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Update the family member entry for "Myself"
      const { error: familyMemberError } = await supabase
        .from("family_members")
        .update({ name: name.trim() })
        .eq("user_id", user.id)
        .eq("name", "Myself");

      if (familyMemberError) throw familyMemberError;

      toast({
        title: "Welcome!",
        description: "Your profile has been set up successfully.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error setting up profile:", error);
      toast({
        title: "Error",
        description: "Failed to set up your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome!</h1>
          <p className="text-muted-foreground">
            Please enter your name to complete the setup
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !name.trim()}
          >
            {loading ? "Setting up..." : "Continue"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Setup;
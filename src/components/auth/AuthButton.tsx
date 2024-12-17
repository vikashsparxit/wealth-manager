import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, LucideGoogle } from "lucide-react";

export const AuthButton = () => {
  const { user, signInWithGoogle, signOut } = useAuth();

  if (user) {
    return (
      <Button variant="outline" onClick={signOut}>
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    );
  }

  return (
    <Button onClick={signInWithGoogle} className="bg-[#4285F4] hover:bg-[#357ABD]">
      <LucideGoogle className="mr-2 h-4 w-4" />
      Sign in with Google
    </Button>
  );
};
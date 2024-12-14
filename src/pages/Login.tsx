import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

const Login = () => {
  const { user, isLoading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Login component - Auth state:", { user, isLoading });
    if (user) {
      console.log("User is authenticated, redirecting to dashboard");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div>Loading...</div>
      </div>
    );
  }

  const handleSignIn = async () => {
    try {
      console.log("Initiating Google sign-in");
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">Welcome to Family Wealth Dashboard</h1>
          <p className="text-muted-foreground">Sign in to manage your family's wealth</p>
        </div>
        
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleSignIn}
          disabled={isLoading}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
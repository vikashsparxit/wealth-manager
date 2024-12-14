import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

export const Login = () => {
  const { user, signInWithGoogle } = useAuth();

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

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
          onClick={signInWithGoogle}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
};

export default Login;
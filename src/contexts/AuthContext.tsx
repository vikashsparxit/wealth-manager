import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthContext - Setting up initial session check");
    
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("AuthContext - Initial session check:", currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
    });

    // Set up auth state listener
    console.log("AuthContext - Setting up auth state listener");
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("AuthContext - Auth state changed:", event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);

        if (event === "SIGNED_IN") {
          // Check if user needs to complete setup
          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", currentSession?.user?.id)
            .single();

          if (!profile?.full_name) {
            console.log("AuthContext - User needs to complete setup");
            navigate("/setup");
          } else {
            console.log("AuthContext - User setup complete, redirecting to dashboard");
            navigate("/");
          }
        } else if (event === "SIGNED_OUT") {
          console.log("AuthContext - User signed out, redirecting to login");
          navigate("/login");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signInWithGoogle = async () => {
    try {
      console.log("AuthContext - Initiating Google sign-in");
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error("AuthContext - Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("AuthContext - Signing out");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("AuthContext - Error signing out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
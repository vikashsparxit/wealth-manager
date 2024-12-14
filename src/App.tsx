import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Setup from "./pages/Setup";

const queryClient = new QueryClient();

// Protected Route component with settings check
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: authLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();
  
  console.log("ProtectedRoute - Auth state:", { user, authLoading });
  console.log("ProtectedRoute - Settings state:", { settings, settingsLoading });

  // Show loading state while checking auth and settings
  if (authLoading || settingsLoading) {
    console.log("Loading auth or settings...");
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated but hasn't completed setup, redirect to setup
  if (!settings) {
    console.log("User hasn't completed setup, redirecting to setup");
    return <Navigate to="/setup" replace />;
  }

  console.log("User is authenticated and has completed setup, rendering protected content");
  return <>{children}</>;
};

// Main App component
const AppRoutes = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();
  
  console.log("AppRoutes - Auth state:", { user, authLoading });
  console.log("AppRoutes - Settings state:", { settings, settingsLoading });

  if (authLoading || settingsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          user ? <Navigate to="/" replace /> : <Login />
        } 
      />
      <Route
        path="/setup"
        element={
          !user ? (
            <Navigate to="/login" replace />
          ) : settings ? (
            <Navigate to="/" replace />
          ) : (
            <Setup />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
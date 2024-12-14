import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  console.log("ProtectedRoute - Auth state:", { user, isLoading });

  // Show loading state while checking auth
  if (isLoading) {
    console.log("Auth state is loading...");
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  console.log("User is authenticated, rendering protected content");
  return <>{children}</>;
};

// Main App component
const AppRoutes = () => {
  const { user, isLoading } = useAuth();
  console.log("AppRoutes - Auth state:", { user, isLoading });

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          user ? <Navigate to="/" replace /> : <Login />
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
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Setup from "@/pages/Setup";
import Landing from "@/pages/Landing";
import SharedDashboard from "@/pages/SharedDashboard";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();

  console.log("ProtectedRoute - Auth state:", { user, isLoading });
  console.log("ProtectedRoute - Settings state:", { settings, settingsLoading });

  if (isLoading || settingsLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!settings) {
    console.log("No settings found, redirecting to setup");
    return <Navigate to="/setup" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { user } = useAuth();
  const { settings, isLoading: settingsLoading } = useSettings();

  console.log("AppRoutes - Auth state:", { user });
  console.log("AppRoutes - Settings state:", { settings, settingsLoading });

  // If user is authenticated and on the landing or login page, redirect appropriately
  if (user && (window.location.pathname === '/' || window.location.pathname === '/login')) {
    if (settingsLoading) {
      return <div>Loading settings...</div>;
    }
    
    if (!settings) {
      console.log("Authenticated user without settings, redirecting to setup");
      return <Navigate to="/setup" replace />;
    }
    console.log("Authenticated user with settings, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={
        user ? (
          settingsLoading ? (
            <div>Loading settings...</div>
          ) : (
            settings ? <Navigate to="/dashboard" replace /> : <Setup />
          )
        ) : (
          <Navigate to="/login" replace />
        )
      } />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route path="/share/:shareToken" element={<SharedDashboard />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Router>
            <AppRoutes />
          </Router>
          <Footer />
          <Toaster />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
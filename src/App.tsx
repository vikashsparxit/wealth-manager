import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Setup from "@/pages/Setup";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useSettings } from "@/hooks/useSettings";

const queryClient = new QueryClient();

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
    return <Navigate to="/login" replace />;
  }

  // If user exists but no settings, redirect to setup
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

  // If user is authenticated and on login, redirect appropriately
  if (user && window.location.pathname === '/login') {
    if (!settings && !settingsLoading) {
      console.log("Authenticated user without settings, redirecting to setup");
      return <Navigate to="/setup" replace />;
    }
    console.log("Authenticated user with settings, redirecting to dashboard");
    return <Navigate to="/" replace />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/setup" element={
        user ? (
          settings ? <Navigate to="/" replace /> : <Setup />
        ) : (
          <Navigate to="/login" replace />
        )
      } />
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
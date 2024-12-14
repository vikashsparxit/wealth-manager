import { InvestmentForm } from "@/components/InvestmentForm";
import { DashboardFilter } from "./dashboard/DashboardFilter";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardStats } from "./dashboard/DashboardStats";
import { ROIInsights } from "./dashboard/ROIInsights";
import { PortfolioDiversification } from "./dashboard/PortfolioDiversification";
import { DashboardLoading } from "./dashboard/DashboardLoading";
import { DashboardInvestments } from "./dashboard/DashboardInvestments";
import { EmptyDashboard } from "./dashboard/EmptyDashboard";
import { useDashboard } from "@/hooks/useDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    filteredInvestments,
    summary,
    showForm,
    loading,
    error,
    liquidAssets,
    selectedMember,
    hasData,
    setShowForm,
    setSelectedMember,
    handleAddInvestment,
    handleUpdateInvestment,
    handleLiquidAssetsUpdate,
  } = useDashboard();

  useEffect(() => {
    if (error) {
      console.error("Dashboard error:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  console.log("Dashboard - Auth state:", { user, loading });
  console.log("Dashboard - Data state:", { 
    hasData, 
    investments: filteredInvestments,
    liquidAssets,
    loading,
    error 
  });

  if (!user) {
    console.log("Dashboard - User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Only show loading state if we're actually loading data
  if (loading && !error) {
    console.log("Dashboard - Loading state active");
    return <DashboardLoading />;
  }

  if (error) {
    console.log("Dashboard - Error state:", error);
    return (
      <div className="container mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-destructive mb-4">Error Loading Dashboard</h2>
        <p className="text-muted-foreground">Please refresh the page to try again.</p>
      </div>
    );
  }

  // Show empty state if we have no data after loading is complete
  if (!hasData && !loading) {
    console.log("Dashboard - No data available");
    return (
      <div className="container mx-auto py-8">
        <DashboardHeader onAddInvestment={() => setShowForm(true)} />
        <EmptyDashboard 
          onAddInvestment={() => setShowForm(true)}
          onManageMembers={() => {
            toast({
              title: "Coming Soon",
              description: "The ability to manage wealth members will be available soon.",
            });
          }}
          onManageTypes={() => {
            toast({
              title: "Coming Soon",
              description: "The ability to manage investment types will be available soon.",
            });
          }}
        />
        {showForm && (
          <InvestmentForm
            onSubmit={handleAddInvestment}
            onCancel={() => setShowForm(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <DashboardHeader onAddInvestment={() => setShowForm(true)} />

      <DashboardFilter
        selectedMember={selectedMember}
        onMemberChange={(value) => setSelectedMember(value as typeof selectedMember)}
      />

      <DashboardStats
        summary={summary}
        liquidAssets={liquidAssets}
        onLiquidAssetsUpdate={handleLiquidAssetsUpdate}
        filteredInvestments={filteredInvestments}
        selectedMember={selectedMember}
      />

      <ROIInsights investments={filteredInvestments} />
      <PortfolioDiversification investments={filteredInvestments} />

      <DashboardInvestments 
        investments={filteredInvestments}
        onUpdate={handleUpdateInvestment}
      />

      {showForm && (
        <InvestmentForm
          onSubmit={handleAddInvestment}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
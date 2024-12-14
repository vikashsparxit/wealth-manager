import { InvestmentForm } from "@/components/InvestmentForm";
import { DashboardFilter } from "./dashboard/DashboardFilter";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardStats } from "./dashboard/DashboardStats";
import { ROIInsights } from "./dashboard/ROIInsights";
import { PortfolioDiversification } from "./dashboard/PortfolioDiversification";
import { DashboardLoading } from "./dashboard/DashboardLoading";
import { DashboardInvestments } from "./dashboard/DashboardInvestments";
import { useDashboard } from "@/hooks/useDashboard";

export const Dashboard = () => {
  const {
    filteredInvestments,
    summary,
    showForm,
    loading,
    liquidAssets,
    selectedMember,
    setShowForm,
    setSelectedMember,
    handleAddInvestment,
    handleUpdateInvestment,
    handleLiquidAssetsUpdate,
  } = useDashboard();

  if (loading) {
    return <DashboardLoading />;
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
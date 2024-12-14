import { useEffect, useState } from "react";
import { Investment, WealthSummary, FamilyMember } from "@/types/investment";
import { investmentService } from "@/services/investmentService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvestmentForm } from "@/components/InvestmentForm";
import { InvestmentList } from "@/components/InvestmentList";
import { useToast } from "@/components/ui/use-toast";
import { StatCard } from "./dashboard/StatCard";
import { DashboardFilter } from "./dashboard/DashboardFilter";
import { LiquidAssetsDialog } from "./dashboard/LiquidAssetsDialog";
import { DashboardCharts } from "./dashboard/DashboardCharts";

export const Dashboard = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<WealthSummary>({
    totalInvested: 0,
    currentValue: 0,
    growth: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liquidAssets, setLiquidAssets] = useState(0);
  const [selectedMember, setSelectedMember] = useState("Family Combined");
  const { toast } = useToast();

  useEffect(() => {
    loadInvestments();
  }, []);

  useEffect(() => {
    const filtered = selectedMember === "Family Combined"
      ? investments
      : investments.filter(inv => inv.owner === selectedMember);
    setFilteredInvestments(filtered);
    setSummary(investmentService.calculateSummary(filtered));
  }, [selectedMember, investments]);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const loadedInvestments = await investmentService.getAll();
      setInvestments(loadedInvestments);
      setFilteredInvestments(loadedInvestments);
      setSummary(investmentService.calculateSummary(loadedInvestments));
    } catch (error) {
      console.error("Error loading investments:", error);
      toast({
        title: "Error",
        description: "Failed to load investments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddInvestment = async (investment: Omit<Investment, "id">) => {
    try {
      const newInvestment = await investmentService.add(investment);
      const updatedInvestments = [...investments, newInvestment];
      setInvestments(updatedInvestments);
      setShowForm(false);
      toast({
        title: "Success",
        description: "Investment added successfully.",
      });
    } catch (error) {
      console.error("Error adding investment:", error);
      toast({
        title: "Error",
        description: "Failed to add investment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateInvestment = async (investment: Investment) => {
    try {
      await investmentService.update(investment);
      const updatedInvestments = investments.map((i) =>
        i.id === investment.id ? investment : i
      );
      setInvestments(updatedInvestments);
      toast({
        title: "Success",
        description: "Investment updated successfully.",
      });
    } catch (error) {
      console.error("Error updating investment:", error);
      toast({
        title: "Error",
        description: "Failed to update investment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLiquidAssetsUpdate = (amount: number, owner: FamilyMember) => {
    setLiquidAssets(amount);
    toast({
      title: "Success",
      description: "Liquid assets updated successfully.",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const totalWealth = summary.currentValue + liquidAssets;
  const lastMonthGrowth = 5083.95; // This would need to be calculated based on actual data
  const annualizedReturn = 4.01; // This would need to be calculated based on actual data
  const averageInvestment = filteredInvestments.length > 0 
    ? summary.totalInvested / filteredInvestments.length 
    : 0;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Family Wealth Manager</h1>
        <Button onClick={() => setShowForm(true)}>Add Investment</Button>
      </div>

      <DashboardFilter
        selectedMember={selectedMember}
        onMemberChange={setSelectedMember}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Wealth"
          value={`₹${totalWealth.toLocaleString()}`}
          subtitle={`Liquid Assets: ₹${liquidAssets.toLocaleString()}`}
          className="bg-accent/40"
        >
          <LiquidAssetsDialog
            liquidAssets={liquidAssets}
            onUpdate={handleLiquidAssetsUpdate}
          />
        </StatCard>

        <StatCard
          title="Total Invested"
          value={`₹${summary.totalInvested.toLocaleString()}`}
          subtitle={`Total Investments: ${filteredInvestments.length}`}
        />

        <StatCard
          title="Current Value"
          value={`₹${summary.currentValue.toLocaleString()}`}
          subtitle={`Last Month Growth: ${lastMonthGrowth.toFixed(2)}%`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Overall Growth"
          value={`${summary.growth.toFixed(2)}%`}
        />

        <StatCard
          title="Annualized Return"
          value={`${annualizedReturn.toFixed(2)}%`}
        />

        <StatCard
          title="Average Investment"
          value={`₹${averageInvestment.toLocaleString()}`}
        />
      </div>

      <DashboardCharts investments={filteredInvestments} />

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Investments</h3>
        <InvestmentList
          investments={filteredInvestments}
          onUpdate={handleUpdateInvestment}
        />
      </Card>

      {showForm && (
        <InvestmentForm
          onSubmit={handleAddInvestment}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};
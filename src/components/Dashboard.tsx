import { useEffect, useState } from "react";
import { Investment, WealthSummary } from "@/types/investment";
import { investmentService } from "@/services/investmentService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, LineChart } from "@/components/Charts";
import { InvestmentForm } from "@/components/InvestmentForm";
import { InvestmentList } from "@/components/InvestmentList";
import { DollarSign, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Dashboard = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<WealthSummary>({
    totalInvested: 0,
    currentValue: 0,
    growth: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadInvestments();
  }, []);

  const loadInvestments = async () => {
    try {
      setLoading(true);
      const loadedInvestments = await investmentService.getAll();
      setInvestments(loadedInvestments);
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
      setSummary(investmentService.calculateSummary(updatedInvestments));
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
      setSummary(investmentService.calculateSummary(updatedInvestments));
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Family Wealth Manager</h1>
        <Button onClick={() => setShowForm(true)}>Add Investment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <h2 className="text-2xl font-bold">
                ₹{summary.totalInvested.toLocaleString()}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <h2 className="text-2xl font-bold">
                ₹{summary.currentValue.toLocaleString()}
              </h2>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-full">
              <Users className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Growth</p>
              <h2 className="text-2xl font-bold">
                {summary.growth.toFixed(2)}%
              </h2>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Portfolio Growth</h3>
          <LineChart investments={investments} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
          <PieChart investments={investments} />
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Investments</h3>
        <InvestmentList
          investments={investments}
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

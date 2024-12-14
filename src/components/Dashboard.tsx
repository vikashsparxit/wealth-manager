import { useEffect, useState } from "react";
import { Investment, WealthSummary } from "@/types/investment";
import { investmentService } from "@/services/investmentService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, LineChart } from "@/components/Charts";
import { InvestmentForm } from "@/components/InvestmentForm";
import { InvestmentList } from "@/components/InvestmentList";
import { DollarSign, TrendingUp, Users, Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const Dashboard = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<WealthSummary>({
    totalInvested: 0,
    currentValue: 0,
    growth: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liquidAssets, setLiquidAssets] = useState(0);
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

  const handleLiquidAssetsUpdate = (newValue: number) => {
    setLiquidAssets(newValue);
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
  const averageInvestment = investments.length > 0 
    ? summary.totalInvested / investments.length 
    : 0;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Family Wealth Manager</h1>
        <Button onClick={() => setShowForm(true)}>Add Investment</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-accent/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Wealth</h3>
                <p className="text-2xl font-bold">₹{totalWealth.toLocaleString()}</p>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Liquid Assets</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Input
                      type="number"
                      value={liquidAssets}
                      onChange={(e) => handleLiquidAssetsUpdate(Number(e.target.value))}
                      placeholder="Enter liquid assets amount"
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-sm text-muted-foreground">
            Liquid Assets: ₹{liquidAssets.toLocaleString()}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-success/10 rounded-full">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Invested</h3>
              <p className="text-2xl font-bold">₹{summary.totalInvested.toLocaleString()}</p>
              <span className="text-sm text-muted-foreground">
                Total Investments: {investments.length}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-warning/10 rounded-full">
              <Users className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Current Value</h3>
              <p className="text-2xl font-bold">₹{summary.currentValue.toLocaleString()}</p>
              <span className="text-sm text-success">
                Last Month Growth: {lastMonthGrowth.toFixed(2)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Overall Growth</h3>
          <p className="text-2xl font-bold text-success">
            {summary.growth.toFixed(2)}%
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Annualized Return</h3>
          <p className="text-2xl font-bold text-success">
            {annualizedReturn.toFixed(2)}%
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Investment</h3>
          <p className="text-2xl font-bold">
            ₹{averageInvestment.toLocaleString()}
          </p>
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

import { useEffect, useState } from "react";
import { Investment, WealthSummary, FamilyMember } from "@/types/investment";
import { investmentService } from "@/services/investmentService";
import { Card } from "@/components/ui/card";
import { InvestmentForm } from "@/components/InvestmentForm";
import { InvestmentList } from "@/components/InvestmentList";
import { useToast } from "@/components/ui/use-toast";
import { DashboardFilter } from "./dashboard/DashboardFilter";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardStats } from "./dashboard/DashboardStats";
import { ROIInsights } from "./dashboard/ROIInsights";
import { PortfolioDiversification } from "./dashboard/PortfolioDiversification";
import { supabase } from "@/integrations/supabase/client";

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
    loadLiquidAssets();
  }, []);

  useEffect(() => {
    const filtered = selectedMember === "Family Combined"
      ? investments
      : investments.filter(inv => inv.owner === selectedMember);
    setFilteredInvestments(filtered);
    setSummary(investmentService.calculateSummary(filtered));
  }, [selectedMember, investments]);

  const loadLiquidAssets = async () => {
    try {
      console.log("Loading liquid assets...");
      const { data, error } = await supabase
        .from("liquid_assets")
        .select("amount")
        .eq("owner", selectedMember === "Family Combined" ? "Myself" : selectedMember);

      if (error) {
        console.error("Error loading liquid assets:", error);
        return;
      }

      const totalAmount = data?.reduce((sum, asset) => sum + Number(asset.amount), 0) || 0;
      console.log("Total liquid assets loaded:", totalAmount);
      setLiquidAssets(totalAmount);
    } catch (error) {
      console.error("Error in loadLiquidAssets:", error);
    }
  };

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

  const handleLiquidAssetsUpdate = async (amount: number, owner: FamilyMember) => {
    try {
      const { data: existingData } = await supabase
        .from("liquid_assets")
        .select("id")
        .eq("owner", owner);

      if (existingData && existingData.length > 0) {
        await supabase
          .from("liquid_assets")
          .update({ amount })
          .eq("owner", owner);
      } else {
        await supabase
          .from("liquid_assets")
          .insert([{ owner, amount }]);
      }

      await loadLiquidAssets();
      toast({
        title: "Success",
        description: "Liquid assets updated successfully.",
      });
    } catch (error) {
      console.error("Error updating liquid assets:", error);
      toast({
        title: "Error",
        description: "Failed to update liquid assets. Please try again.",
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
      <DashboardHeader onAddInvestment={() => setShowForm(true)} />

      <DashboardFilter
        selectedMember={selectedMember}
        onMemberChange={setSelectedMember}
      />

      <DashboardStats
        summary={summary}
        liquidAssets={liquidAssets}
        onLiquidAssetsUpdate={handleLiquidAssetsUpdate}
        filteredInvestments={filteredInvestments}
      />

      <ROIInsights investments={filteredInvestments} />
      <PortfolioDiversification investments={filteredInvestments} />

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
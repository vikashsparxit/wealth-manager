import { useState, useEffect } from "react";
import { Investment, WealthSummary, FamilyMember, LiquidAsset } from "@/types/investment";
import { investmentService } from "@/services/investmentService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useDashboard = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [filteredInvestments, setFilteredInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<WealthSummary>({
    totalInvested: 0,
    currentValue: 0,
    growth: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liquidAssets, setLiquidAssets] = useState<LiquidAsset[]>([]);
  const [selectedMember, setSelectedMember] = useState<"Family Combined" | FamilyMember>("Family Combined");
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
        .select("*");

      if (error) {
        console.error("Error loading liquid assets:", error);
        return;
      }

      console.log("Loaded liquid assets:", data);
      setLiquidAssets(data as LiquidAsset[]);
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
      const { data: existingData, error: checkError } = await supabase
        .from("liquid_assets")
        .select("*")
        .eq("owner", owner)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData) {
        result = await supabase
          .from("liquid_assets")
          .update({ amount })
          .eq("owner", owner);
      } else {
        result = await supabase
          .from("liquid_assets")
          .insert([{ owner, amount }]);
      }

      if (result.error) {
        throw result.error;
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

  return {
    investments,
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
  };
};
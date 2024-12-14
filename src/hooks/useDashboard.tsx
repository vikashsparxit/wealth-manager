import { useState, useMemo } from "react";
import { FamilyMember, WealthSummary } from "@/types/investment";
import { investmentService } from "@/services/investmentService";
import { useInvestments } from "./useInvestments";
import { useLiquidAssets } from "./useLiquidAssets";

export const useDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<"Wealth Combined" | FamilyMember>("Wealth Combined");
  
  const { 
    investments, 
    loading: investmentsLoading, 
    error: investmentsError,
    addInvestment, 
    updateInvestment 
  } = useInvestments();
  
  const { 
    liquidAssets, 
    loading: liquidAssetsLoading,
    error: liquidAssetsError,
    updateLiquidAsset 
  } = useLiquidAssets();

  // Consider loading complete only when both data sources are loaded
  const loading = investmentsLoading || liquidAssetsLoading;
  const error = investmentsError || liquidAssetsError;

  const filteredInvestments = useMemo(() => {
    console.log("Filtering investments for member:", selectedMember);
    return selectedMember === "Wealth Combined"
      ? investments
      : investments.filter(inv => inv.owner === selectedMember);
  }, [selectedMember, investments]);

  const summary = useMemo(() => {
    console.log("Calculating summary for filtered investments");
    return investmentService.calculateSummary(filteredInvestments);
  }, [filteredInvestments]);

  const hasData = investments.length > 0 || liquidAssets.length > 0;

  console.log("useDashboard state:", {
    loading,
    error,
    hasData,
    investmentsCount: investments.length,
    liquidAssetsCount: liquidAssets.length
  });

  return {
    investments,
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
    handleAddInvestment: addInvestment,
    handleUpdateInvestment: updateInvestment,
    handleLiquidAssetsUpdate: updateLiquidAsset,
  };
};
import { useState, useMemo } from "react";
import { FamilyMember, WealthSummary } from "@/types/investment";
import { investmentService } from "@/services/investmentService";
import { useInvestments } from "./useInvestments";
import { useLiquidAssets } from "./useLiquidAssets";

export const useDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState<"Family Combined" | FamilyMember>("Family Combined");
  
  const { 
    investments, 
    loading, 
    addInvestment, 
    updateInvestment 
  } = useInvestments();
  
  const { 
    liquidAssets, 
    updateLiquidAsset 
  } = useLiquidAssets();

  const filteredInvestments = useMemo(() => {
    return selectedMember === "Family Combined"
      ? investments
      : investments.filter(inv => inv.owner === selectedMember);
  }, [selectedMember, investments]);

  const summary = useMemo(() => {
    return investmentService.calculateSummary(filteredInvestments);
  }, [filteredInvestments]);

  const hasData = investments.length > 0 || liquidAssets.length > 0;

  return {
    investments,
    filteredInvestments,
    summary,
    showForm,
    loading,
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
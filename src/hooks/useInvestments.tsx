import { useState, useEffect } from "react";
import { Investment } from "@/types/investment";
import { investmentService } from "@/services/investmentService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadInvestments = async () => {
    try {
      setLoading(true);
      console.log("Loading investments for user:", user?.id);
      const loadedInvestments = await investmentService.getAll();
      console.log("Loaded investments:", loadedInvestments);
      setInvestments(loadedInvestments);
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

  const addInvestment = async (investment: Omit<Investment, "id">) => {
    try {
      console.log("Adding investment:", investment);
      const newInvestment = await investmentService.add(investment);
      setInvestments(prev => [...prev, newInvestment]);
      toast({
        title: "Success",
        description: "Investment added successfully.",
      });
      return newInvestment;
    } catch (error) {
      console.error("Error adding investment:", error);
      toast({
        title: "Error",
        description: "Failed to add investment. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateInvestment = async (investment: Investment) => {
    try {
      console.log("Updating investment:", investment);
      await investmentService.update(investment);
      setInvestments(prev => 
        prev.map(i => i.id === investment.id ? investment : i)
      );
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
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      loadInvestments();
    }
  }, [user]);

  return {
    investments,
    loading,
    addInvestment,
    updateInvestment,
  };
};
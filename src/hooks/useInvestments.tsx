import { useState, useEffect } from "react";
import { Investment } from "@/types/investment";
import { investmentService } from "@/services/investmentService";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useInvestments = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadInvestments = async () => {
    try {
      console.log("useInvestments - Starting to load investments");
      setLoading(true);
      setError(null);

      if (!user) {
        console.log("useInvestments - No user found, skipping investment load");
        setLoading(false);
        return;
      }

      console.log("useInvestments - Loading investments for user:", user.id);
      const loadedInvestments = await investmentService.getAll(user.id);
      console.log("useInvestments - Loaded investments:", loadedInvestments);
      setInvestments(loadedInvestments);
    } catch (err) {
      console.error("useInvestments - Error loading investments:", err);
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to load investments. Please try again.",
        variant: "destructive",
      });
    } finally {
      console.log("useInvestments - Finished loading investments");
      setLoading(false);
    }
  };

  const addInvestment = async (investment: Omit<Investment, "id">) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to add investments");
      }
      console.log("Adding investment:", investment);
      const newInvestment = await investmentService.add(investment, user.id);
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
      if (!user) {
        throw new Error("User must be logged in to update investments");
      }
      console.log("Updating investment:", investment);
      await investmentService.update(investment, user.id);
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
    console.log("useInvestments - Auth state changed, user:", user?.id);
    loadInvestments();
  }, [user]);

  return {
    investments,
    loading,
    error,
    addInvestment,
    updateInvestment,
  };
};
import { supabase } from "@/integrations/supabase/client";
import { Investment, InvestmentType } from "@/types/investment";

export const investmentService = {
  getInvestments: async (userId: string): Promise<Investment[]> => {
    try {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", userId)
        .order("date_of_investment", { ascending: false });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error("Error fetching investments:", error);
      throw error;
    }
  },

  addInvestment: async (userId: string, investment: Omit<Investment, "id">): Promise<Investment> => {
    try {
      const { data, error } = await supabase
        .from("investments")
        .insert([
          {
            ...investment,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error adding investment:", error);
      throw error;
    }
  },

  updateInvestment: async (
    userId: string,
    investmentId: string,
    updates: Partial<Investment>
  ): Promise<Investment> => {
    try {
      const { data, error } = await supabase
        .from("investments")
        .update(updates)
        .eq("id", investmentId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error updating investment:", error);
      throw error;
    }
  },

  deleteInvestment: async (userId: string, investmentId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from("investments")
        .delete()
        .eq("id", investmentId)
        .eq("user_id", userId);

      if (error) throw error;
    } catch (error) {
      console.error("Error deleting investment:", error);
      throw error;
    }
  },
};
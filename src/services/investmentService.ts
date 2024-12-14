import { supabase } from "@/integrations/supabase/client";
import { Investment, WealthSummary } from "@/types/investment";

const mapDatabaseToInvestment = (data: any): Investment => ({
  id: data.id,
  type: data.type,
  owner: data.owner,
  investedAmount: data.invested_amount,
  currentValue: data.current_value,
  dateOfInvestment: data.date_of_investment,
  notes: data.notes,
});

const mapInvestmentToDatabase = (investment: Omit<Investment, "id">) => ({
  type: investment.type,
  owner: investment.owner,
  invested_amount: investment.investedAmount,
  current_value: investment.currentValue,
  date_of_investment: investment.dateOfInvestment,
  notes: investment.notes,
});

export const investmentService = {
  getAll: async (userId: string): Promise<Investment[]> => {
    try {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", userId)
        .order("date_of_investment", { ascending: false });

      if (error) throw error;
      return (data || []).map(mapDatabaseToInvestment);
    } catch (error) {
      console.error("Error fetching investments:", error);
      throw error;
    }
  },

  add: async (investment: Omit<Investment, "id">, userId: string): Promise<Investment> => {
    try {
      const dbInvestment = {
        ...mapInvestmentToDatabase(investment),
        user_id: userId,
      };

      console.log("Adding investment to database:", dbInvestment);

      const { data, error } = await supabase
        .from("investments")
        .insert([dbInvestment])
        .select()
        .single();

      if (error) throw error;
      return mapDatabaseToInvestment(data);
    } catch (error) {
      console.error("Error adding investment:", error);
      throw error;
    }
  },

  update: async (investment: Investment, userId: string): Promise<Investment> => {
    try {
      const dbInvestment = mapInvestmentToDatabase(investment);
      
      console.log("Updating investment in database:", dbInvestment);

      const { data, error } = await supabase
        .from("investments")
        .update(dbInvestment)
        .eq("id", investment.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      return mapDatabaseToInvestment(data);
    } catch (error) {
      console.error("Error updating investment:", error);
      throw error;
    }
  },

  delete: async (userId: string, investmentId: string): Promise<void> => {
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

  calculateSummary: (investments: Investment[]): WealthSummary => {
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const growth = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

    return {
      totalInvested,
      currentValue,
      growth,
    };
  },
};
import { supabase } from "@/integrations/supabase/client";
import { Investment, InvestmentType } from "@/types/investment";

interface DatabaseInvestment {
  id: string;
  type: InvestmentType;
  owner: string;
  invested_amount: number;
  current_value: number;
  date_of_investment: string;
  notes?: string;
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

const mapDatabaseToInvestment = (data: DatabaseInvestment): Investment => ({
  id: data.id,
  type: data.type,
  owner: data.owner,
  investedAmount: data.invested_amount,
  currentValue: data.current_value,
  dateOfInvestment: data.date_of_investment,
  notes: data.notes,
});

const mapInvestmentToDatabase = (investment: Omit<Investment, "id">, userId: string): Omit<DatabaseInvestment, "id" | "created_at" | "updated_at"> => ({
  type: investment.type,
  owner: investment.owner,
  invested_amount: investment.investedAmount,
  current_value: investment.currentValue,
  date_of_investment: investment.dateOfInvestment,
  notes: investment.notes,
  user_id: userId,
});

export const investmentService = {
  getAll: async (userId: string): Promise<Investment[]> => {
    try {
      console.log("Fetching investments for user:", userId);
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("user_id", userId)
        .order("date_of_investment", { ascending: false });

      if (error) throw error;
      console.log("Fetched investments:", data);
      return (data as DatabaseInvestment[]).map(mapDatabaseToInvestment);
    } catch (error) {
      console.error("Error fetching investments:", error);
      throw error;
    }
  },

  add: async (investment: Omit<Investment, "id">, userId: string): Promise<Investment> => {
    try {
      const dbInvestment = mapInvestmentToDatabase(investment, userId);
      console.log("Adding investment to database:", dbInvestment);

      const { data, error } = await supabase
        .from("investments")
        .insert([dbInvestment])
        .select()
        .single();

      if (error) throw error;
      console.log("Successfully added investment:", data);
      return mapDatabaseToInvestment(data as DatabaseInvestment);
    } catch (error) {
      console.error("Error adding investment:", error);
      throw error;
    }
  },

  update: async (investment: Investment, userId: string): Promise<Investment> => {
    try {
      const dbInvestment = mapInvestmentToDatabase(investment, userId);
      console.log("Updating investment in database:", dbInvestment);

      const { data, error } = await supabase
        .from("investments")
        .update(dbInvestment)
        .eq("id", investment.id)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;
      console.log("Successfully updated investment:", data);
      return mapDatabaseToInvestment(data as DatabaseInvestment);
    } catch (error) {
      console.error("Error updating investment:", error);
      throw error;
    }
  },

  delete: async (userId: string, investmentId: string): Promise<void> => {
    try {
      console.log("Deleting investment:", investmentId);
      const { error } = await supabase
        .from("investments")
        .delete()
        .eq("id", investmentId)
        .eq("user_id", userId);

      if (error) throw error;
      console.log("Successfully deleted investment");
    } catch (error) {
      console.error("Error deleting investment:", error);
      throw error;
    }
  },

  calculateSummary: (investments: Investment[]) => {
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
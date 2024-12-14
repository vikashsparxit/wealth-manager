import { supabase } from "@/integrations/supabase/client";
import { Investment, WealthSummary, FamilyMember } from "@/types/investment";

export const investmentService = {
  getAll: async (): Promise<Investment[]> => {
    console.log("Fetching all investments from Supabase");
    const { data, error } = await supabase
      .from("investments")
      .select("*")
      .neq('owner', 'Family') // Exclude any entries with owner 'Family'
      .order("date_of_investment", { ascending: true });

    if (error) {
      console.error("Error fetching investments:", error);
      throw error;
    }

    console.log("Fetched investments:", data);
    return data.map((inv) => ({
      id: inv.id,
      type: inv.type,
      owner: inv.owner as FamilyMember, // Cast to FamilyMember type
      investedAmount: Number(inv.invested_amount),
      currentValue: Number(inv.current_value),
      dateOfInvestment: inv.date_of_investment,
      notes: inv.notes || "",
    }));
  },

  add: async (investment: Omit<Investment, "id">): Promise<Investment> => {
    console.log("Adding new investment:", investment);
    const { data, error } = await supabase
      .from("investments")
      .insert({
        type: investment.type,
        owner: investment.owner,
        invested_amount: investment.investedAmount,
        current_value: investment.currentValue,
        date_of_investment: investment.dateOfInvestment,
        notes: investment.notes,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding investment:", error);
      throw error;
    }

    console.log("Added investment:", data);
    return {
      id: data.id,
      type: data.type,
      owner: data.owner as FamilyMember,
      investedAmount: Number(data.invested_amount),
      currentValue: Number(data.current_value),
      dateOfInvestment: data.date_of_investment,
      notes: data.notes || "",
    };
  },

  update: async (investment: Investment): Promise<Investment> => {
    console.log("Updating investment:", investment);
    const { data, error } = await supabase
      .from("investments")
      .update({
        type: investment.type,
        owner: investment.owner,
        invested_amount: investment.investedAmount,
        current_value: investment.currentValue,
        date_of_investment: investment.dateOfInvestment,
        notes: investment.notes,
      })
      .eq("id", investment.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating investment:", error);
      throw error;
    }

    console.log("Updated investment:", data);
    return {
      id: data.id,
      type: data.type,
      owner: data.owner as FamilyMember,
      investedAmount: Number(data.invested_amount),
      currentValue: Number(data.current_value),
      dateOfInvestment: data.date_of_investment,
      notes: data.notes || "",
    };
  },

  calculateSummary: (investments: Investment[]): WealthSummary => {
    const totalInvested = investments.reduce(
      (sum, inv) => sum + inv.investedAmount,
      0
    );
    const currentValue = investments.reduce(
      (sum, inv) => sum + inv.currentValue,
      0
    );
    const growth =
      totalInvested > 0
        ? ((currentValue - totalInvested) / totalInvested) * 100
        : 0;

    return {
      totalInvested,
      currentValue,
      growth,
    };
  },
};
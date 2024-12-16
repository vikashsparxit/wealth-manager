import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Member } from "../types";

export const useFamilyMembersQueries = () => {
  const { user } = useAuth();

  const loadMembers = async (): Promise<Member[]> => {
    try {
      if (!user) return [];

      console.log("Loading family members for user:", user.id);
      
      // First, get all investments to count them manually
      const { data: investments, error: investmentsError } = await supabase
        .from('investments')
        .select('owner')
        .eq('user_id', user.id);

      if (investmentsError) {
        console.error("Error getting investments:", investmentsError);
        throw investmentsError;
      }

      // Count investments per owner
      const investmentCounts: Record<string, number> = {};
      investments?.forEach(inv => {
        investmentCounts[inv.owner] = (investmentCounts[inv.owner] || 0) + 1;
      });

      console.log("Investment counts:", investmentCounts);

      // Then get family members
      const { data: membersData, error: membersError } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at');

      if (membersError) {
        console.error("Error loading family members:", membersError);
        throw membersError;
      }

      // Combine the data
      const formattedMembers = membersData.map(member => ({
        ...member,
        investment_count: investmentCounts[member.name] || 0
      }));

      console.log("Loaded members with counts:", formattedMembers);
      return formattedMembers;
    } catch (error) {
      console.error("Error in loadMembers:", error);
      throw error;
    }
  };

  return { loadMembers };
};
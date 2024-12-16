import { useState, useEffect } from "react";
import { Investment, LiquidAsset } from "@/types/investment";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface MemberSummary {
  member: string;
  displayName: string;
  totalInvested: number;
  currentValue: number;
  liquidAssets: number;
  totalWealth: number;
  growth: number;
}

export const useMemberSummaries = (
  filteredInvestments: Investment[],
  liquidAssets: LiquidAsset[]
) => {
  const [memberSummaries, setMemberSummaries] = useState<MemberSummary[]>([]);
  const [primaryUserName, setPrimaryUserName] = useState<string>("");
  const { user } = useAuth();

  // Load primary user's name
  useEffect(() => {
    const loadPrimaryUserName = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading primary user name:', error);
        return;
      }

      if (data?.full_name) {
        setPrimaryUserName(data.full_name);
      }
    };

    loadPrimaryUserName();
  }, [user]);

  // Calculate member summaries
  useEffect(() => {
    const calculateMemberSummaries = () => {
      // Get unique members from both investments and liquid assets
      const uniqueMembers = new Set([
        ...filteredInvestments.map(inv => inv.owner),
        ...liquidAssets.map(asset => asset.owner)
      ]);

      // Calculate summaries for each unique member
      const summaries = Array.from(uniqueMembers).map(member => {
        const memberInvestments = filteredInvestments.filter(inv => inv.owner === member);
        const memberAsset = liquidAssets.find(asset => asset.owner === member);
        
        const totalInvested = memberInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
        const currentValue = memberInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
        const liquidAmount = memberAsset ? Number(memberAsset.amount) : 0;
        const totalWealth = currentValue + liquidAmount;
        
        // Calculate growth only if there are investments
        const growth = totalInvested > 0 
          ? ((currentValue - totalInvested) / totalInvested) * 100 
          : 0;

        // Handle display name for primary user
        const displayName = member === "Myself" 
          ? `${primaryUserName || "Myself"} (Primary User)` 
          : member;

        return {
          member,
          displayName,
          totalInvested,
          currentValue,
          liquidAssets: liquidAmount,
          totalWealth,
          growth
        };
      });

      console.log("Updated member summaries:", summaries);
      setMemberSummaries(summaries);
    };

    calculateMemberSummaries();
  }, [liquidAssets, filteredInvestments, primaryUserName]);

  return memberSummaries;
};
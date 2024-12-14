import { WealthSummary } from "@/types/investment";
import { StatCard } from "./StatCard";
import { LiquidAssetsDialog } from "./LiquidAssetsDialog";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface DashboardStatsProps {
  summary: WealthSummary;
  liquidAssets: number;
  onLiquidAssetsUpdate: (amount: number, owner: string) => void;
  filteredInvestments: any[];
  selectedMember: string;
}

export const DashboardStats = ({ 
  summary, 
  liquidAssets,
  onLiquidAssetsUpdate,
  filteredInvestments,
  selectedMember
}: DashboardStatsProps) => {
  const [totalLiquidAssets, setTotalLiquidAssets] = useState(0);

  useEffect(() => {
    const fetchTotalLiquidAssets = async () => {
      try {
        console.log("Fetching total liquid assets for:", selectedMember);
        let { data, error } = await supabase
          .from("liquid_assets")
          .select("amount");

        // Only filter by owner if not viewing combined family data
        if (selectedMember !== "Family Combined") {
          data = data?.filter(asset => asset.owner === selectedMember) || [];
        }

        if (error) {
          console.error("Error fetching liquid assets:", error);
          return;
        }

        const total = data?.reduce((sum, asset) => sum + Number(asset.amount), 0) || 0;
        console.log("Total liquid assets calculated:", total);
        setTotalLiquidAssets(total);
      } catch (error) {
        console.error("Error in fetchTotalLiquidAssets:", error);
      }
    };

    fetchTotalLiquidAssets();
  }, [selectedMember, liquidAssets]);

  const totalWealth = summary.currentValue + totalLiquidAssets;
  const lastMonthGrowth = 5083.95; // This would need to be calculated based on actual data
  const annualizedReturn = 4.01; // This would need to be calculated based on actual data
  const averageInvestment = filteredInvestments.length > 0 
    ? summary.totalInvested / filteredInvestments.length 
    : 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Wealth"
          value={`₹${totalWealth.toLocaleString()}`}
          subtitle={`Liquid Assets: ₹${totalLiquidAssets.toLocaleString()}`}
          className="bg-accent/40"
        >
          <LiquidAssetsDialog
            liquidAssets={totalLiquidAssets}
            onUpdate={onLiquidAssetsUpdate}
            selectedMember={selectedMember}
          />
        </StatCard>

        <StatCard
          title="Total Invested"
          value={`₹${summary.totalInvested.toLocaleString()}`}
          subtitle={`Total Investments: ${filteredInvestments.length}`}
        />

        <StatCard
          title="Current Value"
          value={`₹${summary.currentValue.toLocaleString()}`}
          subtitle={`Last Month Growth: ${lastMonthGrowth.toFixed(2)}%`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Overall Growth"
          value={`${summary.growth.toFixed(2)}%`}
        />

        <StatCard
          title="Annualized Return"
          value={`${annualizedReturn.toFixed(2)}%`}
        />

        <StatCard
          title="Average Investment"
          value={`₹${averageInvestment.toLocaleString()}`}
        />
      </div>
    </>
  );
};
import { WealthSummary, LiquidAsset, FamilyMember } from "@/types/investment";
import { StatCard } from "./StatCard";
import { LiquidAssetsDialog } from "./LiquidAssetsDialog";
import { useEffect, useState } from "react";

interface DashboardStatsProps {
  summary: WealthSummary;
  liquidAssets: LiquidAsset[];
  onLiquidAssetsUpdate: (amount: number, owner: FamilyMember) => void;
  filteredInvestments: any[];
  selectedMember: "Family Combined" | FamilyMember;
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
    const calculateTotalLiquidAssets = () => {
      if (selectedMember === "Family Combined") {
        const total = liquidAssets.reduce((sum, asset) => sum + Number(asset.amount), 0);
        console.log("Total liquid assets for all members:", total);
        setTotalLiquidAssets(total);
      } else {
        const memberAsset = liquidAssets.find(asset => asset.owner === selectedMember);
        const total = memberAsset ? Number(memberAsset.amount) : 0;
        console.log(`Total liquid assets for ${selectedMember}:`, total);
        setTotalLiquidAssets(total);
      }
    };

    calculateTotalLiquidAssets();
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
            liquidAssets={liquidAssets}
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
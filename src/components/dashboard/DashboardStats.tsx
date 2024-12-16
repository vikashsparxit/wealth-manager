import { WealthSummary, LiquidAsset, Investment } from "@/types/investment";
import { StatCard } from "./StatCard";
import { LiquidAssetsDialog } from "./LiquidAssetsDialog";
import { useEffect, useState } from "react";
import { WealthSummaryTable } from "./wealth-summary/WealthSummaryTable";
import { useMemberSummaries } from "./wealth-summary/useMemberSummaries";

interface DashboardStatsProps {
  summary: WealthSummary;
  liquidAssets: LiquidAsset[];
  onLiquidAssetsUpdate: (amount: number, owner: string) => void;
  filteredInvestments: Investment[];
  selectedMember: "Wealth Combined" | string;
}

export const DashboardStats = ({ 
  summary, 
  liquidAssets,
  onLiquidAssetsUpdate,
  filteredInvestments,
  selectedMember
}: DashboardStatsProps) => {
  const [totalLiquidAssets, setTotalLiquidAssets] = useState(0);
  const memberSummaries = useMemberSummaries(filteredInvestments, liquidAssets);

  // Calculate annualized return
  const calculateAnnualizedReturn = (investments: Investment[]) => {
    if (investments.length === 0) return 0;

    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    
    // Get the earliest investment date
    const earliestDate = investments.reduce((earliest, inv) => {
      const invDate = new Date(inv.dateOfInvestment);
      return earliest ? (invDate < earliest ? invDate : earliest) : invDate;
    }, null as Date | null);

    if (!earliestDate) return 0;

    // Calculate years passed
    const yearsPassed = (new Date().getTime() - earliestDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
    if (yearsPassed < 0.01) return 0; // Avoid division by very small numbers

    // Calculate annualized return using CAGR formula
    const CAGR = (Math.pow(currentValue / totalInvested, 1 / yearsPassed) - 1) * 100;
    return isNaN(CAGR) ? 0 : CAGR;
  };

  useEffect(() => {
    const calculateTotalLiquidAssets = () => {
      if (selectedMember === "Wealth Combined") {
        const total = liquidAssets.reduce((sum, asset) => sum + Number(asset.amount), 0);
        setTotalLiquidAssets(total);
      } else {
        const memberAsset = liquidAssets.find(asset => asset.owner === selectedMember);
        const total = memberAsset ? Number(memberAsset.amount) : 0;
        setTotalLiquidAssets(total);
      }
    };

    calculateTotalLiquidAssets();
  }, [selectedMember, liquidAssets]);

  const totalWealth = summary.currentValue + totalLiquidAssets;
  const lastMonthGrowth = 5083.95; // This would need to be calculated based on actual data
  const annualizedReturn = calculateAnnualizedReturn(filteredInvestments);
  const averageInvestment = filteredInvestments.length > 0 
    ? summary.totalInvested / filteredInvestments.length 
    : 0;

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-emerald-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

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
          className={getGrowthColor(summary.growth)}
        />

        <StatCard
          title="Annualized Return"
          value={`${annualizedReturn.toFixed(2)}%`}
          className={getGrowthColor(annualizedReturn)}
        />

        <StatCard
          title="Average Investment"
          value={`₹${averageInvestment.toLocaleString()}`}
        />
      </div>

      <WealthSummaryTable memberSummaries={memberSummaries} />
    </>
  );
};
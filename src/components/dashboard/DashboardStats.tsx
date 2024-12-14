import { WealthSummary } from "@/types/investment";
import { StatCard } from "./StatCard";
import { LiquidAssetsDialog } from "./LiquidAssetsDialog";

interface DashboardStatsProps {
  summary: WealthSummary;
  liquidAssets: number;
  onLiquidAssetsUpdate: (amount: number, owner: string) => void;
  filteredInvestments: any[];
}

export const DashboardStats = ({ 
  summary, 
  liquidAssets, 
  onLiquidAssetsUpdate,
  filteredInvestments 
}: DashboardStatsProps) => {
  const totalWealth = summary.currentValue + liquidAssets;
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
          subtitle={`Liquid Assets: ₹${liquidAssets.toLocaleString()}`}
          className="bg-accent/40"
        >
          <LiquidAssetsDialog
            liquidAssets={liquidAssets}
            onUpdate={onLiquidAssetsUpdate}
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
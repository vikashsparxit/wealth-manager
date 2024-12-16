import { WealthSummary, LiquidAsset, Investment } from "@/types/investment";
import { StatCard } from "./StatCard";
import { LiquidAssetsDialog } from "./LiquidAssetsDialog";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [memberSummaries, setMemberSummaries] = useState<Array<{
    member: string;
    totalInvested: number;
    currentValue: number;
    liquidAssets: number;
    totalWealth: number;
    growth: number;
  }>>([]);

  // Calculate annualized return
  const calculateAnnualizedReturn = (investments: any[]) => {
    if (investments.length === 0) return 0;

    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const currentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    
    // Get the earliest investment date
    const earliestDate = investments.reduce((earliest, inv) => {
      const invDate = new Date(inv.dateOfInvestment);
      return earliest ? (invDate < earliest ? invDate : earliest) : invDate;
    }, null);

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

  useEffect(() => {
    // Calculate individual member summaries
    const summaries = liquidAssets.map(asset => {
      const memberInvestments = filteredInvestments.filter(inv => inv.owner === asset.owner);
      const totalInvested = memberInvestments.reduce((sum, inv) => sum + inv.investedAmount, 0);
      const currentValue = memberInvestments.reduce((sum, inv) => sum + inv.currentValue, 0);
      const liquidAmount = Number(asset.amount);
      const totalWealth = currentValue + liquidAmount;
      const growth = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;

      return {
        member: asset.owner,
        totalInvested,
        currentValue,
        liquidAssets: liquidAmount,
        totalWealth,
        growth
      };
    });

    setMemberSummaries(summaries);
  }, [liquidAssets, filteredInvestments]);

  const totalWealth = summary.currentValue + totalLiquidAssets;
  const lastMonthGrowth = 5083.95; // This would need to be calculated based on actual data
  const annualizedReturn = calculateAnnualizedReturn(filteredInvestments);
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

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Individual Wealth Summary</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead className="text-right">Total Invested</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Liquid Assets</TableHead>
                <TableHead className="text-right">Total Wealth</TableHead>
                <TableHead className="text-right">Growth %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberSummaries.map((summary) => (
                <TableRow key={summary.member}>
                  <TableCell className="font-medium">{summary.member}</TableCell>
                  <TableCell className="text-right">₹{summary.totalInvested.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{summary.currentValue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{summary.liquidAssets.toLocaleString()}</TableCell>
                  <TableCell className="text-right">₹{summary.totalWealth.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{summary.growth.toFixed(2)}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};
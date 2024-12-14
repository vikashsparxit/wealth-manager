import { WealthSummary, LiquidAsset, FamilyMember } from "@/types/investment";
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
  onLiquidAssetsUpdate: (amount: number, owner: FamilyMember) => void;
  filteredInvestments: any[];
  selectedMember: "Wealth Combined" | FamilyMember;
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
    member: FamilyMember;
    totalInvested: number;
    currentValue: number;
    liquidAssets: number;
    totalWealth: number;
    growth: number;
  }>>([]);

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

    console.log("Member summaries calculated:", summaries);
    setMemberSummaries(summaries);
  }, [liquidAssets, filteredInvestments]);

  // Calculate total wealth (current value + liquid assets)
  const totalWealth = summary.currentValue + totalLiquidAssets;

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
          subtitle={`Growth: ${summary.growth.toFixed(2)}%`}
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
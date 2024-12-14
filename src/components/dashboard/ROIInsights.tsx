import { Card } from "@/components/ui/card";
import { Investment } from "@/types/investment";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ROIInsightsProps {
  investments: Investment[];
}

export const ROIInsights = ({ investments }: ROIInsightsProps) => {
  // Calculate ROI for each investment type
  const roiByType = investments.reduce((acc, inv) => {
    const roi = ((inv.currentValue - inv.investedAmount) / inv.investedAmount) * 100;
    if (!acc[inv.type]) {
      acc[inv.type] = { roi, count: 1, totalInvested: inv.investedAmount };
    } else {
      acc[inv.type].roi = (acc[inv.type].roi * acc[inv.type].count + roi) / (acc[inv.type].count + 1);
      acc[inv.type].count += 1;
      acc[inv.type].totalInvested += inv.investedAmount;
    }
    return acc;
  }, {} as { [key: string]: { roi: number; count: number; totalInvested: number } });

  const roiData = Object.entries(roiByType)
    .map(([type, data]) => ({
      type,
      roi: parseFloat(data.roi.toFixed(2)),
      totalInvested: data.totalInvested,
    }))
    .sort((a, b) => b.roi - a.roi);

  const bestPerforming = roiData[0];
  const worstPerforming = roiData[roiData.length - 1];

  // Calculate investment history data
  const historyData = investments
    .sort((a, b) => new Date(a.dateOfInvestment).getTime() - new Date(b.dateOfInvestment).getTime())
    .map(inv => ({
      date: new Date(inv.dateOfInvestment).toLocaleDateString(),
      invested: inv.investedAmount,
      currentValue: inv.currentValue,
      type: inv.type,
    }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Return on Investment</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={roiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="roi" fill="#2563eb" name="ROI %" />
          </BarChart>
        </ResponsiveContainer>
        {roiData.length > 1 && (
          <div className="mt-4 space-y-2">
            {bestPerforming && (
              <p className="text-sm flex items-center gap-2">
                Best performing: <span className="font-semibold">{bestPerforming.type}</span>
                <span className="text-success flex items-center">
                  <ArrowUpIcon className="h-4 w-4" />
                  {bestPerforming.roi}%
                </span>
              </p>
            )}
            {worstPerforming && worstPerforming.type !== bestPerforming?.type && (
              <p className="text-sm flex items-center gap-2">
                Worst performing: <span className="font-semibold">{worstPerforming.type}</span>
                <span className="text-destructive flex items-center">
                  <ArrowDownIcon className="h-4 w-4" />
                  {worstPerforming.roi}%
                </span>
              </p>
            )}
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Investment History</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={historyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="invested" stroke="#2563eb" name="Invested Amount" />
            <Line type="monotone" dataKey="currentValue" stroke="#22c55e" name="Current Value" />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
};
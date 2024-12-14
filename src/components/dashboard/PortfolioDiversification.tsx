import { Card } from "@/components/ui/card";
import { Investment } from "@/types/investment";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PortfolioDiversificationProps {
  investments: Investment[];
}

const COLORS = ['#2563eb', '#22c55e', '#f97316', '#8b5cf6', '#ec4899', '#14b8a6', '#f59e0b', '#6366f1'];

export const PortfolioDiversification = ({ investments }: PortfolioDiversificationProps) => {
  const portfolioData = investments.reduce((acc, inv) => {
    if (!acc[inv.type]) {
      acc[inv.type] = inv.currentValue;
    } else {
      acc[inv.type] += inv.currentValue;
    }
    return acc;
  }, {} as { [key: string]: number });

  const data = Object.entries(portfolioData)
    .map(([type, value]) => ({
      type,
      value,
      percentage: ((value / investments.reduce((sum, inv) => sum + inv.currentValue, 0)) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Portfolio Diversification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ type, percentage }) => `${type} (${percentage}%)`}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="space-y-4">
          <h4 className="font-medium">Distribution Analysis</h4>
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={item.type} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{item.type}</span>
                </div>
                <span className="font-medium">₹{item.value.toLocaleString()} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
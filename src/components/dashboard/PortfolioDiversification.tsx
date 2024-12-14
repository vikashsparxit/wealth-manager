import { Card } from "@/components/ui/card";
import { Investment } from "@/types/investment";
import { PieChart } from "@/components/Charts";
import { calculatePercentage } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

interface PortfolioDiversificationProps {
  investments: Investment[];
}

export const PortfolioDiversification = ({ investments }: PortfolioDiversificationProps) => {
  const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);

  const allocationByType = investments.reduce((acc, inv) => {
    if (!acc[inv.type]) {
      acc[inv.type] = 0;
    }
    acc[inv.type] += inv.currentValue;
    return acc;
  }, {} as Record<string, number>);

  const percentages = Object.entries(allocationByType).map(([type, value]) => ({
    type,
    percentage: calculatePercentage(value, totalValue),
  }));

  percentages.sort((a, b) => b.percentage - a.percentage);

  const hasHighConcentration = percentages.some(p => p.percentage > 50);

  return (
    <Card className="p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Portfolio Diversification</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <PieChart investments={investments} />
        </div>
        <div className="space-y-4">
          <h4 className="font-medium">Asset Allocation Breakdown</h4>
          <div className="space-y-2">
            {percentages.map(({ type, percentage }) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm">{type}</span>
                <span className={`text-sm font-medium ${percentage > 50 ? 'text-destructive' : ''}`}>
                  {percentage.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
          {percentages.length > 0 && (
            <div className="pt-4 border-t">
              {hasHighConcentration ? (
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <p className="text-sm">
                    High concentration in {percentages[0].type} ({percentages[0].percentage.toFixed(2)}%)
                  </p>
                </div>
              ) : (
                percentages.length > 1 && (
                  <p className="text-sm text-muted-foreground">
                    Portfolio is well diversified
                  </p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
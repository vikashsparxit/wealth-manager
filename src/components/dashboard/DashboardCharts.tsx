import { Card } from "@/components/ui/card";
import { Investment } from "@/types/investment";
import { LineChart, PieChart } from "@/components/Charts";

interface DashboardChartsProps {
  investments: Investment[];
}

export const DashboardCharts = ({ investments }: DashboardChartsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Portfolio Growth</h3>
        <LineChart investments={investments} />
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
        <PieChart investments={investments} />
      </Card>
    </div>
  );
};
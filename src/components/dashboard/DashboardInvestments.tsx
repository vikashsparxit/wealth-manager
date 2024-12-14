import { Card } from "@/components/ui/card";
import { InvestmentList } from "@/components/InvestmentList";
import { Investment } from "@/types/investment";

interface DashboardInvestmentsProps {
  investments: Investment[];
  onUpdate: (investment: Investment) => void;
}

export const DashboardInvestments = ({ investments, onUpdate }: DashboardInvestmentsProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Investments</h3>
      <InvestmentList
        investments={investments}
        onUpdate={onUpdate}
      />
    </Card>
  );
};
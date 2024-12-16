import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface WealthSummaryTableProps {
  memberSummaries: Array<{
    displayName: string;
    totalInvested: number;
    currentValue: number;
    liquidAssets: number;
    totalWealth: number;
    growth: number;
  }>;
}

export const WealthSummaryTable = ({ memberSummaries }: WealthSummaryTableProps) => {
  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-emerald-600";
    if (growth < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
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
              <TableRow key={summary.displayName}>
                <TableCell className="font-medium">{summary.displayName}</TableCell>
                <TableCell className="text-right">₹{summary.totalInvested.toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{summary.currentValue.toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{summary.liquidAssets.toLocaleString()}</TableCell>
                <TableCell className="text-right">₹{summary.totalWealth.toLocaleString()}</TableCell>
                <TableCell className={`text-right ${getGrowthColor(summary.growth)}`}>
                  {summary.growth.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
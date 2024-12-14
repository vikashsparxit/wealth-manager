import { Investment } from "@/types/investment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { InvestmentForm } from "./InvestmentForm";

interface Props {
  investments: Investment[];
  onUpdate: (investment: Investment) => void;
}

export const InvestmentList = ({ investments, onUpdate }: Props) => {
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(
    null
  );

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return "text-success font-medium";
    if (growth < 0) return "text-destructive font-medium";
    return "text-muted-foreground";
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Owner</TableHead>
            <TableHead>Invested Amount</TableHead>
            <TableHead>Current Value</TableHead>
            <TableHead>Growth</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments.map((investment) => {
            const growth =
              ((investment.currentValue - investment.investedAmount) /
                investment.investedAmount) *
              100;

            return (
              <TableRow key={investment.id}>
                <TableCell>{investment.type}</TableCell>
                <TableCell>{investment.owner}</TableCell>
                <TableCell>₹{investment.investedAmount.toLocaleString()}</TableCell>
                <TableCell>₹{investment.currentValue.toLocaleString()}</TableCell>
                <TableCell className={getGrowthColor(growth)}>
                  {growth.toFixed(2)}%
                </TableCell>
                <TableCell>
                  {new Date(investment.dateOfInvestment).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingInvestment(investment)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {editingInvestment && (
        <InvestmentForm
          investment={editingInvestment}
          onSubmit={(data) => {
            onUpdate({ ...data, id: editingInvestment.id });
            setEditingInvestment(null);
          }}
          onCancel={() => setEditingInvestment(null)}
        />
      )}
    </>
  );
};
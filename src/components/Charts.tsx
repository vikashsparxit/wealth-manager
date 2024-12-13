import { Investment } from "@/types/investment";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#22c55e",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f59e0b",
  "#6366f1",
];

export const PieChart = ({ investments }: { investments: Investment[] }) => {
  const data = investments.reduce((acc, inv) => {
    const existing = acc.find((item) => item.type === inv.type);
    if (existing) {
      existing.value += inv.currentValue;
    } else {
      acc.push({ type: inv.type, value: inv.currentValue });
    }
    return acc;
  }, [] as { type: string; value: number }[]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsPie>
        <Pie
          data={data}
          dataKey="value"
          nameKey="type"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </RechartsPie>
    </ResponsiveContainer>
  );
};

export const LineChart = ({ investments }: { investments: Investment[] }) => {
  const data = investments
    .sort((a, b) => new Date(a.dateOfInvestment).getTime() - new Date(b.dateOfInvestment).getTime())
    .map((inv) => ({
      date: new Date(inv.dateOfInvestment).toLocaleDateString(),
      invested: inv.investedAmount,
      current: inv.currentValue,
    }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsLine data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="invested"
          stroke="#2563eb"
          name="Invested Amount"
        />
        <Line
          type="monotone"
          dataKey="current"
          stroke="#22c55e"
          name="Current Value"
        />
      </RechartsLine>
    </ResponsiveContainer>
  );
};
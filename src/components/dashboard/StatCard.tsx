import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
}

export const StatCard = ({ title, value, subtitle, className, children }: StatCardProps) => {
  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && (
        <span className="text-sm text-muted-foreground">{subtitle}</span>
      )}
      {children}
    </Card>
  );
};
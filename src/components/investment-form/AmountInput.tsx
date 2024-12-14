import { Input } from "@/components/ui/input";
import { AmountInputProps } from "./types";

export const AmountInput = ({ label, value, onChange, description }: AmountInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        aria-describedby={`${label.toLowerCase()}-description`}
      />
      <p id={`${label.toLowerCase()}-description`} className="sr-only">{description}</p>
    </div>
  );
};
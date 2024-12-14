import { Input } from "@/components/ui/input";
import { DateInputProps } from "./types";

export const DateInput = ({ value, onChange, maxDate }: DateInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Date of Investment</label>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        max={maxDate}
        required
        aria-describedby="date-description"
      />
      <p id="date-description" className="sr-only">Select the date when the investment was made</p>
    </div>
  );
};
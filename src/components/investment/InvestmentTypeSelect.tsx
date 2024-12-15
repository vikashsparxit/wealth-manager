import { InvestmentType } from "@/types/investment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  value: InvestmentType | "";
  types: Array<{ name: InvestmentType }>;
  onChange: (value: InvestmentType) => void;
}

export const InvestmentTypeSelect = ({ value, types, onChange }: Props) => {
  const { toast } = useToast();

  useEffect(() => {
    if (types.length === 0) {
      console.log("No investment types found, this might indicate an issue with data initialization");
    }
  }, [types]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Investment Type</label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full bg-background" aria-label="Select investment type">
          <SelectValue placeholder="Select type" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {types.map(({ name }) => (
            <SelectItem 
              key={name} 
              value={name}
              className="cursor-pointer hover:bg-accent focus:bg-accent"
            >
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">Select the type of investment from the available options</p>
    </div>
  );
};
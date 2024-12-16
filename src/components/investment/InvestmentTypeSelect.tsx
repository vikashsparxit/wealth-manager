import { InvestmentType } from "@/types/investment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: InvestmentType | "";
  types: Array<{ name: InvestmentType }>;
  onChange: (value: InvestmentType) => void;
}

export const InvestmentTypeSelect = ({ value, types, onChange }: Props) => {
  console.log("InvestmentTypeSelect - Available types:", types);
  console.log("InvestmentTypeSelect - Current value:", value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Investment Type</label>
      <Select
        value={value || ""}
        onValueChange={(value) => onChange(value as InvestmentType)}
      >
        <SelectTrigger 
          className="w-full bg-background border" 
          aria-describedby="type-description"
        >
          <SelectValue placeholder="Select investment type" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg">
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
      <p id="type-description" className="text-sm text-muted-foreground">
        Select the type of investment from the available options
      </p>
    </div>
  );
};
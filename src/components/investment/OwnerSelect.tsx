import { FamilyMember } from "@/types/investment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: FamilyMember | "";
  owners: Array<{ name: FamilyMember }>;
  onChange: (value: FamilyMember) => void;
}

export const OwnerSelect = ({ value, owners, onChange }: Props) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Member</label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="w-full bg-background" aria-describedby="owner-description">
          <SelectValue placeholder="Select member" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto bg-background">
          {owners.map(({ name }) => (
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
      <p id="owner-description" className="sr-only">Select the member for this investment from the list of family members</p>
    </div>
  );
};
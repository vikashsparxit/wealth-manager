import { FamilyMember, FamilyRelationship } from "@/types/investment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  value: FamilyMember | "";
  owners: Array<{ 
    name: FamilyMember; 
    relationship?: string;
  }>;
  onChange: (value: FamilyMember) => void;
}

export const OwnerSelect = ({ value, owners, onChange }: Props) => {
  const getDisplayName = (member: { name: FamilyMember; relationship?: string }) => {
    if (member.relationship === 'Primary User') {
      return `${member.name} (Primary)`;
    }
    return member.name;
  };

  // Sort owners to ensure primary user comes first
  const sortedOwners = [...owners].sort((a, b) => {
    if (a.relationship === 'Primary User') return -1;
    if (b.relationship === 'Primary User') return 1;
    return 0;
  });

  console.log("OwnerSelect - Available owners:", sortedOwners);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Member</label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger 
          className="w-full bg-background border" 
          aria-describedby="owner-description"
        >
          <SelectValue placeholder="Select member" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg">
          {sortedOwners.map(({ name, relationship }) => (
            <SelectItem 
              key={name} 
              value={name}
              className="cursor-pointer hover:bg-accent focus:bg-accent"
            >
              {getDisplayName({ name, relationship })}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p id="owner-description" className="sr-only">Select the member for this investment from the list of family members</p>
    </div>
  );
};
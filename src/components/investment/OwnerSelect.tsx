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
    relationship?: FamilyRelationship;
  }>;
  onChange: (value: FamilyMember) => void;
}

export const OwnerSelect = ({ value, owners, onChange }: Props) => {
  const getDisplayName = (member: { name: FamilyMember; relationship?: FamilyRelationship }) => {
    if (member.relationship === 'Primary User') {
      return `${member.name} (Primary)`;
    }
    if (member.relationship) {
      return `${member.name} (${member.relationship})`;
    }
    return member.name;
  };

  // Sort owners to ensure primary user comes first, then by relationship and name
  const sortedOwners = [...owners].sort((a, b) => {
    // First, prioritize Primary User
    if (a.relationship === 'Primary User') return -1;
    if (b.relationship === 'Primary User') return 1;
    // Then sort by relationship type
    if (a.relationship === 'Spouse') return -1;
    if (b.relationship === 'Spouse') return 1;
    // Finally sort alphabetically
    return a.name.localeCompare(b.name);
  });

  console.log("OwnerSelect - Available owners:", sortedOwners);
  console.log("OwnerSelect - Current value:", value);

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
      <p className="text-sm text-muted-foreground">Select the member for this investment</p>
    </div>
  );
};
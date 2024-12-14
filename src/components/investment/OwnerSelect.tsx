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
      return `Myself (Primary)`;
    }
    return member.name;
  };

  // Sort owners to ensure primary user comes first
  const sortedOwners = [...owners].sort((a, b) => {
    if (a.relationship === 'Primary User') return -1;
    if (b.relationship === 'Primary User') return 1;
    return 0;
  });

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
import { FamilyMember, FamilyRelationship } from "@/types/investment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  value: FamilyMember | "";
  owners: Array<{ 
    name: FamilyMember; 
    relationship?: FamilyRelationship;
  }>;
  onChange: (value: FamilyMember) => void;
}

export const OwnerSelect = ({ value, owners, onChange }: Props) => {
  const { user } = useAuth();

  const getDisplayName = (member: { name: FamilyMember; relationship?: FamilyRelationship }) => {
    // If it's the primary user (Myself), use their actual name
    if (member.relationship === 'Primary User') {
      const fullName = user?.user_metadata?.full_name;
      return fullName ? `${fullName} (Primary)` : member.name;
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
  console.log("OwnerSelect - Current value:", value);
  console.log("OwnerSelect - User metadata:", user?.user_metadata);

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
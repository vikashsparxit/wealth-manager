import { FamilyMember, FamilyRelationship } from "@/types/investment";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

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
  const [primaryUserName, setPrimaryUserName] = useState<string>("");

  useEffect(() => {
    const loadPrimaryUserName = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading primary user name:', error);
        return;
      }

      if (data?.full_name) {
        setPrimaryUserName(data.full_name);
      }
    };

    loadPrimaryUserName();
  }, [user]);

  const getDisplayName = (member: { name: FamilyMember; relationship?: FamilyRelationship }) => {
    if (member.name === "Myself" && member.relationship === "Primary User") {
      return `${primaryUserName || "Myself"} (Primary)`;
    }
    if (member.relationship) {
      return `${member.name} (${member.relationship})`;
    }
    return member.name;
  };

  // Sort owners to ensure primary user comes first
  const sortedOwners = [...owners].sort((a, b) => {
    if (a.relationship === "Primary User") return -1;
    if (b.relationship === "Primary User") return 1;
    return a.name.localeCompare(b.name);
  });

  console.log("OwnerSelect - Sorted owners:", sortedOwners);
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
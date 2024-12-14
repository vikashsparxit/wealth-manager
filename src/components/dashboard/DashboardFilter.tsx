import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FamilyMember, FamilyRelationship } from "@/types/investment";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardFilterProps {
  selectedMember: string;
  onMemberChange: (value: string) => void;
}

export const DashboardFilter = ({ selectedMember, onMemberChange }: DashboardFilterProps) => {
  const [familyMembers, setFamilyMembers] = useState<Array<{ 
    name: FamilyMember;
    relationship?: FamilyRelationship;
  }>>([]);
  const { user } = useAuth();

  useEffect(() => {
    const loadFamilyMembers = async () => {
      if (!user) return;
      
      console.log("Loading family members for dashboard filter...");
      const { data, error } = await supabase
        .from('family_members')
        .select('name, relationship')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('relationship', { ascending: true });

      if (error) {
        console.error('Error loading family members:', error);
        return;
      }

      console.log("Loaded family members:", data);
      
      // Ensure proper typing and sort primary user first
      const typedData = (data || [])
        .filter((item): item is { name: FamilyMember; relationship: FamilyRelationship } => {
          return ['Myself', 'My Wife', 'My Daughter'].includes(item.name);
        });

      console.log("Processed family members:", typedData);
      setFamilyMembers(typedData);
    };

    loadFamilyMembers();
  }, [user]);

  const getDisplayName = (member: { name: FamilyMember; relationship?: FamilyRelationship }) => {
    if (member.relationship === 'Primary User') {
      return `${member.name} (Primary)`;
    }
    return member.name;
  };

  // Always show if there are any family members
  if (familyMembers.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-medium">Dashboard For:</span>
      <Select value={selectedMember} onValueChange={onMemberChange}>
        <SelectTrigger className="w-[180px] bg-background border">
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg">
          <SelectItem 
            value="Wealth Combined"
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            Wealth Combined
          </SelectItem>
          {familyMembers.map((member) => (
            <SelectItem 
              key={member.name} 
              value={member.name}
              className="cursor-pointer hover:bg-accent focus:bg-accent"
            >
              {getDisplayName(member)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
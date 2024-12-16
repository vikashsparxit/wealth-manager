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
      
      console.log("DashboardFilter - Loading family members...");
      const { data, error } = await supabase
        .from('family_members')
        .select('name, relationship')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at');

      if (error) {
        console.error('Error loading family members:', error);
        return;
      }

      console.log("DashboardFilter - Raw family members:", data);
      
      // Filter and sort family members
      const processedMembers = data
        .filter((item): item is { name: FamilyMember; relationship: FamilyRelationship } => {
          return Boolean(item.name && item.relationship);
        })
        .sort((a, b) => {
          // First, prioritize Primary User
          if (a.relationship === 'Primary User') return -1;
          if (b.relationship === 'Primary User') return 1;
          // Then sort alphabetically
          return a.name.localeCompare(b.name);
        });

      console.log("DashboardFilter - Processed and sorted family members:", processedMembers);
      setFamilyMembers(processedMembers);
    };

    loadFamilyMembers();
  }, [user]);

  const getDisplayName = (member: { name: string; relationship?: string }) => {
    if (member.relationship === 'Primary User') {
      return `${member.name} (Primary)`;
    }
    if (member.relationship) {
      return `${member.name} (${member.relationship})`;
    }
    return member.name;
  };

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FamilyMember } from "@/types/investment";
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
    relationship?: string;
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
        .order('relationship', { ascending: true }); // Primary User will come first

      if (error) {
        console.error('Error loading family members:', error);
        return;
      }

      console.log("Loaded family members:", data);
      
      // Ensure proper typing and sort primary user first
      const typedData = (data || []).sort((a, b) => {
        if (a.relationship === 'Primary User') return -1;
        if (b.relationship === 'Primary User') return 1;
        return 0;
      });

      setFamilyMembers(typedData);
    };

    loadFamilyMembers();
  }, [user]);

  const getDisplayName = (member: { name: FamilyMember; relationship?: string }) => {
    if (member.relationship === 'Primary User') {
      return `${member.name} (Primary)`;
    }
    return member.name;
  };

  if (familyMembers.length <= 1) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-medium">Dashboard For:</span>
      <Select value={selectedMember} onValueChange={onMemberChange}>
        <SelectTrigger className="w-[180px] bg-background">
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
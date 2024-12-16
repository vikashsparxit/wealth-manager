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
  const [primaryUserName, setPrimaryUserName] = useState<string>("");

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      const [membersResponse, profileResponse] = await Promise.all([
        supabase
          .from('family_members')
          .select('name, relationship')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at'),
        supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single()
      ]);

      if (membersResponse.error) {
        console.error('Error loading family members:', membersResponse.error);
        return;
      }

      if (profileResponse.error) {
        console.error('Error loading profile:', profileResponse.error);
      } else if (profileResponse.data?.full_name) {
        setPrimaryUserName(profileResponse.data.full_name);
      }

      console.log("DashboardFilter - Raw family members:", membersResponse.data);
      
      const processedMembers = membersResponse.data
        .filter((member): member is { name: FamilyMember; relationship: FamilyRelationship } => {
          return Boolean(member.name && member.relationship);
        })
        .sort((a, b) => {
          if (a.relationship === 'Primary User') return -1;
          if (b.relationship === 'Primary User') return 1;
          return a.name.localeCompare(b.name);
        });

      console.log("DashboardFilter - Processed and sorted family members:", processedMembers);
      setFamilyMembers(processedMembers);
    };

    loadData();
  }, [user]);

  const getDisplayName = (member: { name: string; relationship?: string }) => {
    if (member.name === "Myself" && member.relationship === "Primary User") {
      return `${primaryUserName || "Myself"} (Primary)`;
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
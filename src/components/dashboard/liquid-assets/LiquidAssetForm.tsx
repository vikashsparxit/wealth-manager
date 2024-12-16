import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { FamilyRelationship } from "@/types/investment";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface LiquidAssetFormProps {
  amount: string;
  owner: string;
  familyMembers: Array<{ 
    name: string; 
    relationship?: FamilyRelationship;
  }>;
  selectedMember: string;
  onAmountChange: (value: string) => void;
  onOwnerChange: (value: string) => void;
  onSave: () => void;
}

export const LiquidAssetForm = ({
  amount,
  owner,
  familyMembers,
  selectedMember,
  onAmountChange,
  onOwnerChange,
  onSave,
}: LiquidAssetFormProps) => {
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

  const getDisplayName = (member: { name: string; relationship?: string }) => {
    if (member.name === "Myself" && member.relationship === "Primary User") {
      return `${primaryUserName || "Myself"} (Primary)`;
    }
    if (member.relationship) {
      return `${member.name} (${member.relationship})`;
    }
    return member.name;
  };

  // Sort family members to ensure primary user comes first
  const sortedMembers = [...familyMembers].sort((a, b) => {
    if (a.relationship === "Primary User") return -1;
    if (b.relationship === "Primary User") return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="grid gap-4 py-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter liquid assets amount"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="flex-1"
          type="number"
        />
        {selectedMember === "Wealth Combined" && (
          <Select 
            value={owner} 
            onValueChange={onOwnerChange}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select owner" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg">
              {sortedMembers.map((member) => (
                <SelectItem 
                  key={member.name} 
                  value={member.name}
                  className="cursor-pointer py-2 px-4 hover:bg-accent rounded-md"
                >
                  {getDisplayName(member)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      <Button onClick={onSave} className="w-full">Save</Button>
    </div>
  );
};
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FamilyMember } from "@/types/investment";

interface DashboardFilterProps {
  selectedMember: string;
  onMemberChange: (value: string) => void;
}

export const DashboardFilter = ({ selectedMember, onMemberChange }: DashboardFilterProps) => {
  const familyMembers: FamilyMember[] = ["Myself", "My Wife", "My Daughter"];

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-sm font-medium">Dashboard For:</span>
      <Select value={selectedMember} onValueChange={onMemberChange}>
        <SelectTrigger className="w-[180px] bg-background">
          <SelectValue placeholder="Select view" />
        </SelectTrigger>
        <SelectContent className="bg-background border shadow-lg">
          <SelectItem 
            value="Family Combined"
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            Family Combined
          </SelectItem>
          {familyMembers.map((member) => (
            <SelectItem 
              key={member} 
              value={member}
              className="cursor-pointer hover:bg-accent focus:bg-accent"
            >
              {member}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
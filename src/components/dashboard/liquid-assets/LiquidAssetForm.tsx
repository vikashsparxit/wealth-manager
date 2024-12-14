import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LiquidAssetFormProps } from "./types";
import { FamilyMember } from "@/types/investment";

export const LiquidAssetForm = ({
  amount,
  owner,
  familyMembers,
  selectedMember,
  onAmountChange,
  onOwnerChange,
  onSave,
}: LiquidAssetFormProps) => {
  const getDisplayName = (member: { name: string; relationship?: string }) => {
    if (member.relationship === "Primary User") {
      return "Myself (Primary)";
    }
    return `${member.name}${member.relationship ? ` (${member.relationship})` : ''}`;
  };

  // Sort family members to put Primary User first
  const sortedMembers = [...familyMembers].sort((a, b) => {
    if (a.relationship === "Primary User") return -1;
    if (b.relationship === "Primary User") return 1;
    return 0;
  });

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        {selectedMember === "Wealth Combined" && familyMembers.length > 0 && (
          <Select 
            value={owner} 
            onValueChange={(value: FamilyMember) => onOwnerChange(value)}
          >
            <SelectTrigger className="w-full bg-background border">
              <SelectValue placeholder="Select owner" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg min-w-[200px]">
              {sortedMembers.map((member) => (
                <SelectItem 
                  key={member.name} 
                  value={member.name}
                  className="cursor-pointer relative flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent focus:bg-accent data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  {getDisplayName(member)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            Current liquid assets for {selectedMember !== "Wealth Combined" ? selectedMember : owner}
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="Enter liquid assets amount"
            className="bg-background"
          />
        </div>
        <Button onClick={onSave} className="w-full">Save</Button>
      </div>
    </div>
  );
};
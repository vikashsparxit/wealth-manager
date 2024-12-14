import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { LiquidAssetFormProps, FamilyMemberData } from "./types";

export const LiquidAssetForm = ({
  amount,
  owner,
  familyMembers,
  selectedMember,
  onAmountChange,
  onOwnerChange,
  onSave,
}: LiquidAssetFormProps) => {
  const getDisplayName = (member: FamilyMemberData) => {
    if (member.name === "Myself") {
      return "Myself (Primary)";
    }
    return `${member.name}${member.relationship ? ` (${member.relationship})` : ''}`;
  };

  return (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        {selectedMember === "Wealth Combined" && familyMembers.length > 0 && (
          <Select 
            value={owner} 
            onValueChange={onOwnerChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select owner" />
            </SelectTrigger>
            <SelectContent>
              {familyMembers.map((member) => (
                <SelectItem 
                  key={member.name} 
                  value={member.name}
                  className="cursor-pointer"
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
          />
        </div>
        <Button onClick={onSave}>Save</Button>
      </div>
    </div>
  );
};
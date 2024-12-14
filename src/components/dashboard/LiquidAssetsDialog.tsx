import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FamilyMember } from "@/types/investment";
import { useState } from "react";

interface LiquidAssetsDialogProps {
  liquidAssets: number;
  onUpdate: (amount: number, owner: FamilyMember) => void;
}

export const LiquidAssetsDialog = ({ liquidAssets, onUpdate }: LiquidAssetsDialogProps) => {
  const [amount, setAmount] = useState(liquidAssets);
  const [owner, setOwner] = useState<FamilyMember>("Myself");
  const familyMembers: FamilyMember[] = ["Myself", "My Wife", "My Daughter", "Family"];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Liquid Assets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="Enter liquid assets amount"
            />
            <Select value={owner} onValueChange={(value) => setOwner(value as FamilyMember)}>
              <SelectTrigger>
                <SelectValue placeholder="Select owner" />
              </SelectTrigger>
              <SelectContent>
                {familyMembers.map((member) => (
                  <SelectItem key={member} value={member}>
                    {member}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => onUpdate(amount, owner)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
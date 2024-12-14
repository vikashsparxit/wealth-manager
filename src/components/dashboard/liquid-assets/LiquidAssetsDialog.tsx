import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { LiquidAssetsDialogProps } from "./types";
import { useLiquidAssetsDialog } from "./useLiquidAssetsDialog";
import { LiquidAssetForm } from "./LiquidAssetForm";

export const LiquidAssetsDialog = ({ liquidAssets, onUpdate, selectedMember }: LiquidAssetsDialogProps) => {
  const {
    open,
    amount,
    owner,
    familyMembers,
    handleSave,
    handleOpenChange,
    setAmount,
    setOwner,
  } = useLiquidAssetsDialog(liquidAssets, selectedMember, onUpdate);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit liquid assets">
          <Edit2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Liquid Assets</DialogTitle>
        </DialogHeader>
        <LiquidAssetForm
          amount={amount}
          owner={owner}
          familyMembers={familyMembers}
          selectedMember={selectedMember}
          onAmountChange={setAmount}
          onOwnerChange={setOwner}
          onSave={handleSave}
        />
      </DialogContent>
    </Dialog>
  );
};
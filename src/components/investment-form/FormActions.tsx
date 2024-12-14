import { Button } from "@/components/ui/button";
import { FormActionsProps } from "./types";

export const FormActions = ({ onCancel, isEdit }: FormActionsProps) => {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">
        {isEdit ? "Update" : "Add"} Investment
      </Button>
    </div>
  );
};
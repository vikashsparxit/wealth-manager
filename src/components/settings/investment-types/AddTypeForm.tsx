import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface AddTypeFormProps {
  newType: string;
  loading: boolean;
  onTypeChange: (value: string) => void;
  onAdd: () => void;
}

export const AddTypeForm = ({ newType, loading, onTypeChange, onAdd }: AddTypeFormProps) => {
  return (
    <div className="flex gap-2 w-full">
      <Input
        placeholder="Enter investment type"
        value={newType}
        onChange={(e) => onTypeChange(e.target.value)}
        className="flex-1"
      />
      <Button onClick={onAdd} disabled={loading || !newType.trim()}>
        <Plus className="h-4 w-4 mr-2" />
        Add Type
      </Button>
    </div>
  );
};
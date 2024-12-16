import { ScrollArea } from "@/components/ui/scroll-area";
import { TypeItem } from "./TypeItem";

interface TypesListProps {
  types: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  editingId: string | null;
  editValue: string;
  loading: boolean;
  onEdit: (id: string, name: string) => void;
  onUpdate: (id: string, newName: string) => void;
  onCancelEdit: () => void;
  onToggleStatus: (id: string, status: string) => void;
  setEditValue: (value: string) => void;
}

export const TypesList = ({
  types,
  editingId,
  editValue,
  loading,
  onEdit,
  onUpdate,
  onCancelEdit,
  onToggleStatus,
  setEditValue,
}: TypesListProps) => {
  return (
    <ScrollArea className="flex-1 h-[400px] pr-4">
      <div className="space-y-2">
        {types.map((type) => (
          <TypeItem
            key={type.id}
            type={type}
            editingId={editingId}
            editValue={editValue}
            loading={loading}
            onEdit={() => onEdit(type.id, type.name)}
            onUpdate={onUpdate}
            onCancelEdit={onCancelEdit}
            onToggleStatus={onToggleStatus}
            setEditValue={setEditValue}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
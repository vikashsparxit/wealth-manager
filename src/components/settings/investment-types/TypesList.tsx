import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Edit2, Minus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Type {
  id: string;
  name: string;
  status: string;
}

interface TypesListProps {
  types: Type[];
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
    <ScrollArea className="h-[400px] px-2">
      <div className="space-y-2">
        {types.map((type) => (
          <div
            key={type.id}
            className="flex items-center justify-between p-2 bg-background rounded-lg border"
          >
            {editingId === type.id ? (
              <div className="flex items-center gap-2 flex-1 mr-2">
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1"
                  autoFocus
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onUpdate(type.id, editValue)}
                  disabled={!editValue.trim() || editValue === type.name}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onCancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="flex-1 cursor-pointer" onClick={() => onEdit(type.id, type.name)}>
                  {type.name}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(type.id, type.name)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={type.status === "active" ? "destructive" : "default"}
                    size="sm"
                    onClick={() => onToggleStatus(type.id, type.status)}
                    disabled={loading}
                  >
                    {type.status === "active" ? (
                      <>
                        <Minus className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
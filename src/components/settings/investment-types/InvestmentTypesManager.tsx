import { Card } from "@/components/ui/card";
import { AddTypeForm } from "./AddTypeForm";
import { TypeItem } from "./TypeItem";
import { useInvestmentTypes } from "./useInvestmentTypes";

export const InvestmentTypesManager = () => {
  const {
    types,
    loading,
    editingId,
    editValue,
    newType,
    setEditValue,
    setNewType,
    setEditingId,
    addType,
    updateType,
    toggleTypeStatus,
  } = useInvestmentTypes();

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(85vh-120px)]">
      <Card className="p-6 flex-1 overflow-hidden flex flex-col">
        <AddTypeForm
          newType={newType}
          loading={loading}
          onTypeChange={setNewType}
          onAdd={addType}
        />

        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
          {types.map((type) => (
            <TypeItem
              key={type.id}
              type={type}
              editingId={editingId}
              editValue={editValue}
              loading={loading}
              onEdit={() => startEditing(type.id, type.name)}
              onUpdate={updateType}
              onCancelEdit={() => setEditingId(null)}
              onToggleStatus={toggleTypeStatus}
              setEditValue={setEditValue}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};
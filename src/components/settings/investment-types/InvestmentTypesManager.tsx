import { Card } from "@/components/ui/card";
import { AddTypeForm } from "./AddTypeForm";
import { TypesList } from "./TypesList";
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

  const handleStartEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  return (
    <div className="flex flex-col h-[600px]">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-4">Manage Investment Types</h2>
        <AddTypeForm
          newType={newType}
          loading={loading}
          onTypeChange={setNewType}
          onAdd={addType}
        />
      </div>
      
      <Card className="flex-1 p-6 overflow-hidden">
        <TypesList
          types={types}
          editingId={editingId}
          editValue={editValue}
          loading={loading}
          onEdit={handleStartEditing}
          onUpdate={updateType}
          onCancelEdit={() => setEditingId(null)}
          onToggleStatus={toggleTypeStatus}
          setEditValue={setEditValue}
        />
      </Card>
    </div>
  );
};
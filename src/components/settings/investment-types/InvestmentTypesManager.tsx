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
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[600px] overflow-hidden">
      {/* Sticky header with background */}
      <div className="sticky top-0 bg-background z-10 pb-4 border-b">
        <h2 className="text-lg font-semibold mb-4">Manage Investment Types</h2>
        <AddTypeForm
          newType={newType}
          loading={loading}
          onTypeChange={setNewType}
          onAdd={addType}
        />
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-hidden mt-4">
        <Card className="h-full">
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
    </div>
  );
};
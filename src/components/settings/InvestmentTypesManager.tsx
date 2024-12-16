import { Card } from "@/components/ui/card";
import { AddTypeForm } from "@/components/settings/investment-types/AddTypeForm";
import { TypesList } from "@/components/settings/investment-types/TypesList";
import { useInvestmentTypes } from "@/components/settings/investment-types/useInvestmentTypes";

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
    <div className="flex flex-col">
      {/* Fixed header section */}
      <div className="bg-background pb-4 border-b">
        <AddTypeForm
          newType={newType}
          loading={loading}
          onTypeChange={setNewType}
          onAdd={addType}
        />
      </div>
      
      {/* Scrollable content area */}
      <div className="mt-4">
        <Card className="p-2">
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
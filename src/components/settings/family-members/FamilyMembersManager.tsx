import { Card } from "@/components/ui/card";
import { AddMemberForm } from "./AddMemberForm";
import { FamilyMembersList } from "./FamilyMembersList";
import { useFamilyMembers } from "./useFamilyMembers";

export const FamilyMembersManager = () => {
  const {
    members,
    loading,
    editingId,
    editValue,
    newMember,
    setEditValue,
    setNewMember,
    addMember,
    updateMember,
    toggleMemberStatus,
    startEditing,
    setEditingId,
  } = useFamilyMembers();

  return (
    <Card className="p-6">
      <AddMemberForm
        newMember={newMember}
        loading={loading}
        onAdd={addMember}
        onChange={setNewMember}
      />

      <FamilyMembersList
        members={members}
        editingId={editingId}
        editValue={editValue}
        loading={loading}
        onEdit={startEditing}
        onUpdate={updateMember}
        onCancelEdit={() => setEditingId(null)}
        onToggleStatus={toggleMemberStatus}
        setEditValue={setEditValue}
      />
    </Card>
  );
};
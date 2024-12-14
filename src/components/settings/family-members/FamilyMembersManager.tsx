import { Card } from "@/components/ui/card";
import { AddMemberForm } from "./AddMemberForm";
import { MembersList } from "./MembersList";
import { useFamilyMembers } from "./useFamilyMembers";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const FamilyMembersManager = () => {
  const {
    members,
    loading,
    editingId,
    editValue,
    newMember,
    relationship,
    setEditValue,
    setNewMember,
    setRelationship,
    addMember,
    updateMember,
    toggleMemberStatus,
    startEditing,
    setEditingId,
  } = useFamilyMembers();

  return (
    <DialogContent 
      className="sm:max-w-[600px]" 
      onInteractOutside={() => {
        setTimeout(() => {
          document.body.style.pointerEvents = 'auto';
        }, 100);
      }}
    >
      <DialogHeader>
        <DialogTitle>Family Members</DialogTitle>
      </DialogHeader>
      
      <Card className="p-6">
        <AddMemberForm
          newMember={newMember}
          loading={loading}
          relationship={relationship}
          onAdd={addMember}
          onChange={setNewMember}
          onRelationshipChange={setRelationship}
        />

        <MembersList
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
    </DialogContent>
  );
};
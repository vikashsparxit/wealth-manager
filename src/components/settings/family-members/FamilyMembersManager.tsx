import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { AddMemberForm } from "./AddMemberForm";
import { MembersList } from "./MembersList";
import { useFamilyMembersManager } from "./hooks/useFamilyMembersManager";
import { Member } from "./types";

export const FamilyMembersManager = () => {
  const {
    state,
    setState,
    addMember,
    updateMember,
    toggleMemberStatus,
  } = useFamilyMembersManager();

  const startEditing = (member: Member) => {
    setState(prev => ({
      ...prev,
      editingId: member.id,
      editValue: member.name,
      editRelationship: member.relationship || "Other"
    }));
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Family Members</DialogTitle>
      </DialogHeader>
      
      <Card className="p-6">
        <AddMemberForm
          newMember={state.newMember}
          relationship={state.relationship}
          loading={state.loading}
          onAdd={addMember}
          onMemberChange={(value) => setState(prev => ({ ...prev, newMember: value }))}
          onRelationshipChange={(value) => setState(prev => ({ ...prev, relationship: value }))}
        />

        <MembersList
          members={state.members}
          editingId={state.editingId}
          editValue={state.editValue}
          editRelationship={state.editRelationship}
          loading={state.loading}
          onEdit={startEditing}
          onUpdate={updateMember}
          onCancelEdit={() => setState(prev => ({ ...prev, editingId: null }))}
          onToggleStatus={toggleMemberStatus}
          setEditValue={(value) => setState(prev => ({ ...prev, editValue: value }))}
          setEditRelationship={(value) => setState(prev => ({ ...prev, editRelationship: value }))}
        />
      </Card>
    </DialogContent>
  );
};
import { DialogContent } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { AddMemberForm } from "./AddMemberForm";
import { MembersList } from "./MembersList";
import { FamilyMembersDialogTitle } from "./FamilyMembersDialogTitle";
import { useFamilyMembersManager } from "./hooks/useFamilyMembersManager";
import { Member } from "./types";
import { FamilyRelationship } from "@/types/investment";

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
      editRelationship: member.relationship || "Spouse"
    }));
  };

  return (
    <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-hidden flex flex-col">
      <FamilyMembersDialogTitle />
      
      <Card className="p-6 overflow-hidden flex flex-col">
        <AddMemberForm
          newMember={state.newMember}
          relationship={state.relationship}
          loading={state.loading}
          onAdd={addMember}
          onMemberChange={(value) => setState(prev => ({ ...prev, newMember: value }))}
          onRelationshipChange={(value: FamilyRelationship) => setState(prev => ({ ...prev, relationship: value }))}
        />

        <div className="overflow-y-auto pr-2">
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
            setEditRelationship={(value: FamilyRelationship) => setState(prev => ({ ...prev, editRelationship: value }))}
          />
        </div>
      </Card>
    </DialogContent>
  );
};
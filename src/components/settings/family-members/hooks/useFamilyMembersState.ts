import { useState } from "react";
import { FamilyMemberState } from "../types";

const initialState: FamilyMemberState = {
  newMember: "",
  relationship: "Spouse",
  members: [],
  loading: false,
  editingId: null,
  editValue: "",
  editRelationship: "Spouse",
};

export const useFamilyMembersState = () => {
  const [state, setState] = useState<FamilyMemberState>(initialState);
  return { state, setState };
};
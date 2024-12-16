import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Member, FamilyMemberState } from "../types";
import { FamilyRelationship } from "@/types/investment";
import { useFamilyMembersQueries } from "./useFamilyMembersQueries";
import { useFamilyMembersState } from "./useFamilyMembersState";
import { useFamilyMembersActions } from "./useFamilyMembersActions";

export const useFamilyMembersManager = () => {
  const { loadMembers } = useFamilyMembersQueries();
  const { state, setState } = useFamilyMembersState();
  const { addMember, updateMember, toggleMemberStatus } = useFamilyMembersActions(state, setState, loadMembers);

  useEffect(() => {
    loadMembers().then(members => {
      setState(prev => ({ ...prev, members }));
    });
  }, []);

  return {
    state,
    setState,
    addMember,
    updateMember,
    toggleMemberStatus,
  };
};
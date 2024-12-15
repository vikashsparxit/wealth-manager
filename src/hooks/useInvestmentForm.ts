import { useState, useEffect } from "react";
import { Investment, InvestmentType, FamilyMember, FamilyRelationship } from "@/types/investment";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface FamilyMemberData {
  name: FamilyMember;
  relationship?: FamilyRelationship;
}

interface FormData {
  type: string;
  owner: string;
  investedAmount: string;
  currentValue: string;
  dateOfInvestment: string;
  notes: string;
}

export const useInvestmentForm = (investment?: Investment, onSubmit?: (data: Omit<Investment, "id">) => void) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investmentTypes, setInvestmentTypes] = useState<Array<{ name: InvestmentType }>>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMemberSelect, setShowMemberSelect] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    type: investment?.type || "",
    owner: investment?.owner || "",
    investedAmount: investment?.investedAmount?.toString() || "",
    currentValue: investment?.currentValue?.toString() || "",
    dateOfInvestment: investment?.dateOfInvestment || new Date().toISOString().split("T")[0],
    notes: investment?.notes || "",
  });

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        console.log("InvestmentForm - No user found, skipping data load");
        return;
      }
      
      try {
        console.log("InvestmentForm - Loading data for user:", user.id);
        const [typesResponse, membersResponse] = await Promise.all([
          supabase
            .from('investment_types')
            .select('name')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('name'),
          supabase
            .from('family_members')
            .select('name, relationship')
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('created_at')
        ]);

        if (typesResponse.error) throw typesResponse.error;
        if (membersResponse.error) throw membersResponse.error;

        console.log("InvestmentForm - Raw family members:", membersResponse.data);
        
        // Filter and sort family members
        const processedMembers = membersResponse.data
          .filter((member): member is { name: FamilyMember; relationship: FamilyRelationship } => {
            return Boolean(member.name && member.relationship);
          })
          .sort((a, b) => {
            if (a.relationship === 'Primary User') return -1;
            if (b.relationship === 'Primary User') return 1;
            return 0;
          });

        console.log("InvestmentForm - Processed family members:", processedMembers);
        setFamilyMembers(processedMembers);
        setShowMemberSelect(processedMembers.length > 0);

        // Set investment types
        setInvestmentTypes(typesResponse.data as Array<{ name: InvestmentType }>);

        // Set default owner for new investments to the primary user
        if (!investment && processedMembers.length > 0) {
          const primaryUser = processedMembers.find(m => m.relationship === 'Primary User');
          if (primaryUser) {
            console.log("InvestmentForm - Setting default owner to primary user:", primaryUser.name);
            setFormData(prev => ({
              ...prev,
              owner: primaryUser.name
            }));
          }
        }
      } catch (error) {
        console.error('InvestmentForm - Error loading form data:', error);
        toast({
          title: "Error",
          description: "Failed to load form data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, investment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        type: formData.type as InvestmentType,
        owner: formData.owner as FamilyMember,
        investedAmount: Number(formData.investedAmount),
        currentValue: Number(formData.currentValue),
        dateOfInvestment: formData.dateOfInvestment,
        notes: formData.notes,
      });
    }
  };

  return {
    formData,
    setFormData,
    investmentTypes,
    familyMembers,
    loading,
    showMemberSelect,
    handleSubmit,
  };
};
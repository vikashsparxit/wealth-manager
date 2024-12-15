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
    owner: investment?.owner || "Myself", // Default to "Myself" for new investments
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
            .order('relationship', { ascending: true }) // Order by relationship to ensure Primary User comes first
        ]);

        if (typesResponse.error) throw typesResponse.error;
        if (membersResponse.error) throw membersResponse.error;

        console.log("InvestmentForm - Loaded investment types:", typesResponse.data);
        console.log("InvestmentForm - Loaded family members:", membersResponse.data);

        setInvestmentTypes(typesResponse.data as Array<{ name: InvestmentType }>);
        setFamilyMembers(membersResponse.data as FamilyMemberData[]);
        setShowMemberSelect(membersResponse.data.length > 0);

        // Only set default owner for new investments
        if (!investment && membersResponse.data.length > 0) {
          const primaryUser = membersResponse.data.find(m => m.relationship === 'Primary User');
          if (primaryUser) {
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
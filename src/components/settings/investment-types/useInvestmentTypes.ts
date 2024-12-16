import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useInvestmentTypes = () => {
  const [newType, setNewType] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: types = [] } = useQuery({
    queryKey: ["investment-types", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investment_types")
        .select("*")
        .eq("user_id", user?.id)
        .order('name');

      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const addType = async () => {
    if (!newType.trim() || !user?.id) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from("investment_types")
        .insert([{ name: newType.trim(), user_id: user.id }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment type added successfully",
      });
      
      setNewType("");
      queryClient.invalidateQueries({ queryKey: ["investment-types"] });
    } catch (error) {
      console.error("Error adding investment type:", error);
      toast({
        title: "Error",
        description: "Failed to add investment type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateType = async (id: string, newName: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from("investment_types")
        .update({ name: newName.trim() })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment type updated successfully",
      });
      
      setEditingId(null);
      queryClient.invalidateQueries({ queryKey: ["investment-types"] });
    } catch (error) {
      console.error("Error updating investment type:", error);
      toast({
        title: "Error",
        description: "Failed to update investment type",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleTypeStatus = async (id: string, currentStatus: string) => {
    try {
      setLoading(true);
      const newStatus = currentStatus === "active" ? "inactive" : "active";
      
      const { error } = await supabase
        .from("investment_types")
        .update({ status: newStatus })
        .eq("id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Investment type status updated successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ["investment-types"] });
    } catch (error) {
      console.error("Error updating investment type status:", error);
      toast({
        title: "Error",
        description: "Failed to update investment type status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
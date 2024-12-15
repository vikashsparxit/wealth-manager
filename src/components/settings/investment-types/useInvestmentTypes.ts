import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { InvestmentType } from "./types";

export const useInvestmentTypes = () => {
  const [types, setTypes] = useState<InvestmentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [newType, setNewType] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const loadTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("investment_types")
        .select("*")
        .eq("user_id", user?.id)
        .order('name');

      if (error) throw error;
      setTypes(data || []);
    } catch (error) {
      console.error("Error loading investment types:", error);
      toast({
        title: "Error",
        description: "Failed to load investment types",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      await loadTypes();
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
      await loadTypes();
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
      
      await loadTypes();
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

  useEffect(() => {
    if (user) {
      loadTypes();
    }
  }, [user]);

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
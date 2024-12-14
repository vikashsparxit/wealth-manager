import { useState, useEffect } from "react";
import { LiquidAsset, FamilyMember } from "@/types/investment";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useLiquidAssets = () => {
  const [liquidAssets, setLiquidAssets] = useState<LiquidAsset[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadLiquidAssets = async () => {
    try {
      if (!user) {
        console.log("No user found, skipping liquid assets load");
        return;
      }
      console.log("Loading liquid assets for user:", user.id);
      const { data, error } = await supabase
        .from("liquid_assets")
        .select("*")
        .eq('user_id', user.id);

      if (error) {
        console.error("Error loading liquid assets:", error);
        throw error;
      }

      console.log("Loaded liquid assets:", data);
      setLiquidAssets(data as LiquidAsset[]);
    } catch (error) {
      console.error("Error in loadLiquidAssets:", error);
      toast({
        title: "Error",
        description: "Failed to load liquid assets. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateLiquidAsset = async (amount: number, owner: FamilyMember) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to update liquid assets");
      }
      console.log("Updating liquid asset:", { amount, owner });
      const { data: existingData, error: checkError } = await supabase
        .from("liquid_assets")
        .select("*")
        .eq("owner", owner)
        .eq("user_id", user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let result;
      if (existingData) {
        result = await supabase
          .from("liquid_assets")
          .update({ amount })
          .eq("owner", owner)
          .eq("user_id", user.id);
      } else {
        result = await supabase
          .from("liquid_assets")
          .insert([{ owner, amount, user_id: user.id }]);
      }

      if (result.error) {
        throw result.error;
      }

      await loadLiquidAssets();
      toast({
        title: "Success",
        description: "Liquid assets updated successfully.",
      });
    } catch (error) {
      console.error("Error updating liquid assets:", error);
      toast({
        title: "Error",
        description: "Failed to update liquid assets. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      loadLiquidAssets();
    } else {
      setLiquidAssets([]);
    }
  }, [user]);

  return {
    liquidAssets,
    updateLiquidAsset,
  };
};
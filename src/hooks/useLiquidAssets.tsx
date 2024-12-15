import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { LiquidAsset } from "@/types/investment";

export const useLiquidAssets = () => {
  const [liquidAssets, setLiquidAssets] = useState<LiquidAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const loadLiquidAssets = async () => {
    try {
      setLoading(true);
      if (!user) return;

      const { data, error } = await supabase
        .from("liquid_assets")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      setLiquidAssets(data || []);
    } catch (error) {
      console.error("Error loading liquid assets:", error);
      toast({
        title: "Error",
        description: "Failed to load liquid assets. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateLiquidAsset = async (owner: string, amount: number) => {
    try {
      if (!user) return;

      const existingAsset = liquidAssets.find(asset => asset.owner === owner);
      const timestamp = new Date().toISOString();

      if (existingAsset) {
        const { error } = await supabase
          .from("liquid_assets")
          .update({ 
            amount,
            updated_at: timestamp
          })
          .eq("id", existingAsset.id)
          .eq("user_id", user.id);

        if (error) throw error;

        setLiquidAssets(prev =>
          prev.map(asset =>
            asset.id === existingAsset.id
              ? { ...asset, amount, updated_at: timestamp }
              : asset
          )
        );
      } else {
        const { data, error } = await supabase
          .from("liquid_assets")
          .insert([
            {
              owner,
              amount,
              user_id: user.id,
              created_at: timestamp,
              updated_at: timestamp
            }
          ])
          .select()
          .single();

        if (error) throw error;

        setLiquidAssets(prev => [...prev, data]);
      }

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
    }
  };

  useEffect(() => {
    if (user) {
      loadLiquidAssets();
    }
  }, [user]);

  return {
    liquidAssets,
    loading,
    updateLiquidAsset,
  };
};
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useActivityLogger } from "@/hooks/useActivityLogger";
import { CurrencyType } from "@/types/investment";

export const useSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logUserActivity } = useActivityLogger();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings", user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: { dashboard_name?: string; base_currency?: CurrencyType }) => {
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("user_settings")
        .update(newSettings)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;

      await logUserActivity(
        "settings_updated",
        "Updated dashboard settings",
        newSettings
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", user?.id] });
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const initializeSettings = useMutation({
    mutationFn: async (initialSettings: { dashboard_name?: string; base_currency: CurrencyType }) => {
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("user_settings")
        .insert([{
          user_id: user.id,
          dashboard_name: initialSettings.dashboard_name || 'My Wealth Dashboard',
          base_currency: initialSettings.base_currency
        }])
        .select()
        .single();

      if (error) throw error;

      await logUserActivity(
        "settings_updated",
        "Initialized dashboard settings",
        initialSettings
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings", user?.id] });
      toast({
        title: "Success",
        description: "Settings initialized successfully",
      });
    },
    onError: (error) => {
      console.error("Error initializing settings:", error);
      toast({
        title: "Error",
        description: "Failed to initialize settings",
        variant: "destructive",
      });
    },
  });

  return {
    settings,
    isLoading,
    updateSettings: updateSettings.mutate,
    initializeSettings: initializeSettings.mutate,
  };
};
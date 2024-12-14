import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { settingsService, UserSettings } from "@/services/settingsService";
import { useToast } from "@/components/ui/use-toast";

export const useSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: settings,
    isLoading,
    error
  } = useQuery({
    queryKey: ["settings", user?.id],
    queryFn: () => user?.id ? settingsService.getSettings(user.id) : null,
    enabled: !!user?.id,
    retry: false
  });

  const { mutate: updateSettings } = useMutation({
    mutationFn: (newSettings: Partial<UserSettings>) => {
      if (!user?.id) throw new Error("No user ID");
      return settingsService.updateSettings(user.id, newSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Settings updated",
        description: "Your dashboard settings have been updated successfully."
      });
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  const { mutate: initializeSettings } = useMutation({
    mutationFn: (initialSettings: Partial<UserSettings>) => {
      if (!user?.id) throw new Error("No user ID");
      return settingsService.createSettings(user.id, initialSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({
        title: "Settings initialized",
        description: "Your dashboard has been set up successfully."
      });
    },
    onError: (error) => {
      console.error("Error initializing settings:", error);
      toast({
        title: "Error",
        description: "Failed to initialize settings. Please try again.",
        variant: "destructive"
      });
    }
  });

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    initializeSettings
  };
};
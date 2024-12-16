import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { logActivity } from "@/services/activityLogService";
import { ActivityType } from "@/types/activity";
import { Json } from "@/integrations/supabase/types";
import { useToast } from "@/components/ui/use-toast";

export const useActivityLogger = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const logUserActivity = useCallback(
    async (activityType: ActivityType, description: string, metadata: Json = {}) => {
      if (!user?.id) {
        console.error("No user found when trying to log activity");
        return;
      }

      try {
        await logActivity(user.id, activityType, description, metadata);
      } catch (error) {
        console.error("Failed to log activity:", error);
        toast({
          title: "Error",
          description: "Failed to log activity",
          variant: "destructive",
        });
      }
    },
    [user, toast]
  );

  return { logUserActivity };
};
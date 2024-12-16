import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ActivityLogEntry } from "@/components/activity-log/types";
import { useAuth } from "@/contexts/AuthContext";

export const useActivityLog = () => {
  const { user } = useAuth();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log("Fetching activities for user:", user.id);
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching activities:", error);
        throw error;
      }

      console.log("Fetched activities:", data);
      return data.map((activity): ActivityLogEntry => ({
        id: activity.id,
        activityType: activity.activity_type,
        description: activity.description,
        metadata: activity.metadata,
        createdAt: activity.created_at,
      }));
    },
    enabled: !!user,
  });

  return {
    activities,
    isLoading,
  };
};
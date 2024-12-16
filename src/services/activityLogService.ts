import { supabase } from "@/integrations/supabase/client";
import { ActivityType } from "@/types/activity";
import { Json } from "@/integrations/supabase/types";

export const logActivity = async (
  userId: string,
  activityType: ActivityType,
  description: string,
  metadata: Json = {}
) => {
  console.log("Logging activity:", { userId, activityType, description, metadata });
  
  const { data, error } = await supabase
    .from("activity_logs")
    .insert({
      user_id: userId,
      activity_type: activityType,
      description,
      metadata
    })
    .select()
    .single();

  if (error) {
    console.error("Error logging activity:", error);
    throw error;
  }

  console.log("Activity logged successfully:", data);
  return data;
};
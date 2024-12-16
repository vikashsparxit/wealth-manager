import { Json } from "@/integrations/supabase/types";
import { ActivityType } from "@/types/activity";

export interface ActivityLogEntry {
  id: string;
  activityType: ActivityType;
  description: string;
  metadata: Json;
  createdAt: string;
}

export interface ActivityLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
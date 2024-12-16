import { ActivityType } from "@/types/activity";

export interface ActivityLogEntry {
  id: string;
  activityType: ActivityType;
  description: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface ActivityLogModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
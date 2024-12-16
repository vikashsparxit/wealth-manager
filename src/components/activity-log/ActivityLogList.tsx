import { Activity, Clock } from "lucide-react";
import { format } from "date-fns";
import { ActivityLogEntry } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

interface ActivityLogListProps {
  activities: ActivityLogEntry[];
  isLoading: boolean;
}

export const ActivityLogList = ({ activities, isLoading }: ActivityLogListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-start gap-4">
            <Skeleton className="h-6 w-6 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Activity className="mx-auto h-12 w-12 mb-4" />
        <p>No activities recorded yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-accent/40">
          <Activity className="h-5 w-5 mt-1 text-primary" />
          <div className="flex-1">
            <p className="text-sm">{activity.description}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{format(new Date(activity.createdAt), "PPp")}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
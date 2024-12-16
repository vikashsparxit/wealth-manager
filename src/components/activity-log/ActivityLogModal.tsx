import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityLogModalProps } from "./types";
import { ActivityLogList } from "./ActivityLogList";
import { useActivityLog } from "@/hooks/useActivityLog";

export const ActivityLogModal = ({ open, onOpenChange }: ActivityLogModalProps) => {
  const { activities, isLoading } = useActivityLog();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Activity Log</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-4">
          <ActivityLogList activities={activities} isLoading={isLoading} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
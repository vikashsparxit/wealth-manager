import { Textarea } from "@/components/ui/textarea";
import { NotesInputProps } from "./types";

export const NotesInput = ({ value, onChange }: NotesInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Notes</label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Optional notes..."
        aria-describedby="notes-description"
      />
      <p id="notes-description" className="sr-only">Add any additional notes about the investment</p>
    </div>
  );
};
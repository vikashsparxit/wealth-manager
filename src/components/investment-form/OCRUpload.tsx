import { useState } from "react";
import { Upload, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OCRUploadProps {
  onExtractedData: (data: {
    investedAmount?: string;
    currentValue?: string;
    dateOfInvestment?: string;
  }) => void;
}

export const OCRUpload = ({ onExtractedData }: OCRUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      
      // Convert the file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        // Call the OCR Edge Function
        const { data, error } = await supabase.functions.invoke('process-investment-document', {
          body: { image: base64Image }
        });

        if (error) throw error;

        console.log("OCR Response:", data);

        if (data.extractedData) {
          onExtractedData(data.extractedData);
          toast({
            title: "Success",
            description: "Successfully extracted data from the document",
          });
        }
      };

    } catch (error) {
      console.error("OCR processing error:", error);
      toast({
        title: "Error",
        description: "Failed to process the document. Please try again or enter details manually.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full relative group"
        disabled={isProcessing}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="flex items-center justify-center gap-2 w-full">
          <Upload className="h-4 w-4" />
          <span className="flex-1">
            {isProcessing ? "Processing..." : "Upload Investment Document"}
          </span>
          <Sparkles className="h-4 w-4 text-blue-500 transition-transform group-hover:scale-110" />
        </div>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
          disabled={isProcessing}
          onClick={(e) => e.stopPropagation()}
        />
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        Upload an investment document and let AI extract the details automatically
      </p>
    </div>
  );
};
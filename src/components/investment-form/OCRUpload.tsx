import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
    <div className="flex items-center gap-2 mb-4">
      <Button
        variant="outline"
        className="w-full"
        disabled={isProcessing}
      >
        <label className="flex items-center justify-center gap-2 cursor-pointer w-full">
          <Upload className="h-4 w-4" />
          <span>{isProcessing ? "Processing..." : "Upload Investment Document"}</span>
          <input
            type="text"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isProcessing}
          />
        </label>
      </Button>
    </div>
  );
};
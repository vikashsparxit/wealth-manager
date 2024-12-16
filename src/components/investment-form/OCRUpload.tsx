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
    event.stopPropagation();
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      console.log("Starting file upload process");
      
      // Convert the file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          console.log("File converted to base64, calling OCR function");
          
          const { data, error } = await supabase.functions.invoke('process-investment-document', {
            body: { image: base64Image }
          });

          if (error) {
            console.error("OCR function error:", error);
            throw error;
          }

          if (!data?.success) {
            throw new Error(data?.error || "Failed to process document");
          }

          console.log("OCR Response:", data);

          if (data?.extractedData) {
            onExtractedData(data.extractedData);
            toast({
              title: "Success",
              description: "Successfully extracted data from the document",
            });
          } else {
            throw new Error("No data extracted from the document");
          }
        } catch (error) {
          console.error("Error processing document:", error);
          toast({
            title: "Error",
            description: "Failed to process the document. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        setIsProcessing(false);
        toast({
          title: "Error",
          description: "Failed to read the file. Please try again.",
          variant: "destructive",
        });
      };

    } catch (error) {
      console.error("Error in file upload:", error);
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to upload the document. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full relative group"
        disabled={isProcessing}
        onClick={handleButtonClick}
        type="button"
      >
        <div className="flex items-center justify-center gap-2 w-full">
          <Upload className="h-4 w-4" />
          <span className="flex-1">
            {isProcessing ? "Processing..." : "Upload Investment Document"}
          </span>
          <Sparkles className="h-4 w-4 text-blue-500 transition-transform group-hover:scale-110" />
        </div>
      </Button>
      
      <p className="text-xs text-muted-foreground text-center">
        Upload an investment document and let AI extract the details automatically
      </p>
      
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
        disabled={isProcessing}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};
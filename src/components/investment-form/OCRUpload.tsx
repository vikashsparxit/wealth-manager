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
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      console.error("Invalid file type:", file.type);
      toast({
        title: "Error",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      console.error("File too large:", file.size);
      toast({
        title: "Error",
        description: "File size must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Starting file upload process");
      
      // Convert the file to base64
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          console.log("File converted to base64, length:", base64Image.length);
          
          // Clean base64 string if needed
          const cleanBase64 = base64Image.includes('base64,') 
            ? base64Image
            : `data:${file.type};base64,${base64Image}`;
          
          const { data, error } = await supabase.functions.invoke('process-investment-document', {
            body: { image: cleanBase64 }
          });

          console.log("OCR Response:", { data, error });

          if (error) {
            throw new Error(error.message || "Failed to process document");
          }

          if (!data?.success) {
            throw new Error(data?.error || "Failed to process document");
          }

          if (data?.extractedData) {
            console.log("Successfully extracted data:", data.extractedData);
            onExtractedData(data.extractedData);
            toast({
              title: "Success",
              description: "Successfully extracted data from the document",
            });
          } else {
            throw new Error("No data extracted from the document");
          }
        } catch (error: any) {
          console.error("Error processing document:", error);
          toast({
            title: "Error",
            description: error.message || "Failed to process the document. Please ensure the image is clear and contains investment details.",
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

      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error in file upload:', error);
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
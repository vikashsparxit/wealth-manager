import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()
    console.log("Received request with image data")
    
    if (!image) {
      console.error("No image data received")
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'No image data provided' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Extract the base64 data after the comma
    const base64Data = image.split(',')[1]
    if (!base64Data) {
      console.error("Invalid image format")
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid image format' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    const hfToken = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN')
    if (!hfToken) {
      console.error("Missing Hugging Face access token")
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Server configuration error' 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      )
    }

    console.log("Initializing Hugging Face client")
    const hf = new HfInference(hfToken)

    try {
      console.log("Processing image with document understanding model")
      const result = await hf.documentQuestionAnswering({
        model: 'microsoft/layoutlmv3-base',
        inputs: {
          image: base64Data,
          question: "What are the investment amount, current value, and date in this document?",
        },
      })

      console.log("OCR Result:", result)

      if (!result || !result.answer) {
        throw new Error("No result from OCR processing")
      }

      // Extract relevant information using regex patterns
      const amountPattern = /(?:Rs\.|INR|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/gi
      const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/
      const amounts = result.answer.match(amountPattern) || []
      
      const extractedData: {
        investedAmount?: string;
        currentValue?: string;
        dateOfInvestment?: string;
      } = {}

      if (amounts.length >= 2) {
        extractedData.investedAmount = amounts[0].replace(/[^\d.]/g, '')
        extractedData.currentValue = amounts[1].replace(/[^\d.]/g, '')
      } else if (amounts.length === 1) {
        extractedData.investedAmount = amounts[0].replace(/[^\d.]/g, '')
      }

      const dateMatch = result.answer.match(datePattern)
      if (dateMatch) {
        extractedData.dateOfInvestment = dateMatch[1]
      }

      console.log("Extracted Data:", extractedData)

      if (Object.keys(extractedData).length === 0) {
        throw new Error("No data could be extracted from the document")
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          extractedData 
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } catch (ocrError) {
      console.error("OCR Processing Error:", ocrError)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to process document. Please ensure the image is clear and contains investment details.',
          details: ocrError.message
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 422 
        }
      )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process request',
        details: error.message
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
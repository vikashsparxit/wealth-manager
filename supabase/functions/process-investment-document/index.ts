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
    console.log("Received request with image data length:", image?.length || 0)
    
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

    // Clean base64 string
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '')
    console.log("Cleaned base64 data length:", base64Data.length)

    // Convert base64 to binary data
    const binaryStr = atob(base64Data)
    const len = binaryStr.length
    const bytes = new Uint8Array(len)
    
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }

    console.log("Converted to Uint8Array, length:", bytes.length)

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
      // Create a Blob from the Uint8Array
      const blob = new Blob([bytes])
      
      console.log("Calling Hugging Face API with document question answering task")
      const result = await hf.documentQuestionAnswering({
        inputs: {
          image: blob,
          question: "What are the investment amount, current value, and date in this document?"
        },
        model: "microsoft/layoutlmv3-base",
        wait_for_model: true
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
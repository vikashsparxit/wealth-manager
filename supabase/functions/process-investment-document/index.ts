import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()

    // Initialize Hugging Face client
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Process the image with Microsoft's document understanding model
    const result = await hf.documentQuestionAnswering({
      model: 'microsoft/layoutlmv3-base',
      inputs: {
        image,
        question: "What is the investment amount, current value and date?"
      },
    })

    console.log("OCR Result:", result)

    // Extract relevant information using regex patterns
    const amountPattern = /(?:Rs\.|INR|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/gi
    const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/
    const amounts = result.answer.match(amountPattern) || []
    
    // Try to identify invested amount and current value
    const extractedData: {
      investedAmount?: string;
      currentValue?: string;
      dateOfInvestment?: string;
    } = {}

    if (amounts.length >= 2) {
      // Assume first amount is invested amount and second is current value
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
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process document' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
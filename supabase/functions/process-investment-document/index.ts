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
        question: "What is the investment amount and date?"
      },
    })

    console.log("OCR Result:", result)

    // Extract relevant information using regex patterns
    const amountPattern = /(?:Rs\.|INR|₹)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i
    const datePattern = /(\d{1,2}[-/]\d{1,2}[-/]\d{2,4})/

    const extractedData = {
      investedAmount: result.answer.match(amountPattern)?.[1] || '',
      dateOfInvestment: result.answer.match(datePattern)?.[1] || '',
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
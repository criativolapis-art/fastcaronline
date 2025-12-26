import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, customerName, vehicleId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      // Fallback response if AI not configured
      return new Response(
        JSON.stringify({ 
          message: `Obrigado pela mensagem, ${customerName}! Um de nossos vendedores entrará em contato em breve.`,
          transferToSeller: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `Você é um assistente virtual de uma loja de veículos chamada AutoElite. Seja sempre educado, profissional e prestativo.

Suas funções:
1. Responder dúvidas sobre veículos e condições de pagamento
2. Identificar se o cliente quer pagar à vista ou financiar
3. Se financiamento: perguntar sobre renda e explicar que precisamos verificar o score de crédito
4. Se à vista: agendar visita à loja
5. Transferir para um vendedor quando necessário

Regras:
- Seja conciso e direto
- Use emojis com moderação
- Sempre pergunte como pode ajudar
- Se o cliente quer financiar, peça o CPF para "simulação"
- Nunca invente informações sobre preços ou condições específicas`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI Gateway error:", await response.text());
      return new Response(
        JSON.stringify({ 
          message: "Um de nossos vendedores entrará em contato em breve!",
          transferToSeller: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || "Como posso ajudá-lo?";

    return new Response(
      JSON.stringify({ message: aiMessage, transferToSeller: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

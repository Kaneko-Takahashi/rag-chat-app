import "https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts";

const model = 'intfloat/multilingual-e5-large';

Deno.serve(async (req) => {
  try {
    const { text } = await req.json();

    const response = await fetch(
      `https://api-inference.huggingface.co/pipeline/feature-extraction/${model}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: text,
          options: { wait_for_model: true },
        }),
      }
    );

    const embedding = await response.json();

    return new Response(
      JSON.stringify({ embedding }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
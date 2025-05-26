import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, data } = await req.json();
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ result: 'Hugging Face API key not set.' }, { status: 500 });
  }

  // Prepare the input for the model
  const input = `User question:\n${prompt}\n\nData:\n${JSON.stringify(data)}`;

  try {
    const hfRes = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: input,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
        },
      }),
    });
    if (!hfRes.ok) {
      return NextResponse.json({ result: 'AI model error.' }, { status: 500 });
    }
    const data = await hfRes.json();
    // Hugging Face returns an array with 'generated_text' or similar
    const result = Array.isArray(data) && data[0]?.generated_text ? data[0].generated_text : (data.generated_text || data.error || 'No response.');
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ result: 'Error contacting Hugging Face.' }, { status: 500 });
  }
} 
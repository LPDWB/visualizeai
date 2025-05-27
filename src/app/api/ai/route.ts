import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, previewData } = await req.json();

  if (!prompt || !previewData) {
    return NextResponse.json({ error: 'Missing prompt or data' }, { status: 400 });
  }

  try {
    // Format data as markdown table
    const headers = Object.keys(previewData[0]).join(' | ');
    const formattedTable = previewData
      .map((row: Record<string, any>) => Object.values(row).join(' | '))
      .join('\n');
    const tableText = `${headers}\n${formattedTable}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-haiku',
        messages: [
          {
            role: 'system',
            content: 'You are an expert data analyst. Help the user analyze tabular data and suggest meaningful visualizations or insights.'
          },
          {
            role: 'user',
            content: `User prompt: ${prompt}\n\nHere is a preview of the table data:\n${tableText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter Error:', error);
      return NextResponse.json({ error: 'AI model error' }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content ?? 'No response from AI';

    return NextResponse.json({ output: aiResponse });
  } catch (err) {
    console.error('Request failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 
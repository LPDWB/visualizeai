import { NextRequest, NextResponse } from 'next/server';
import { ChartConfig, ChartType } from '@/lib/charts/types';

interface AIResponse {
  chartConfig?: ChartConfig;
  insight: string;
  suggestions?: string[];
}

export async function POST(req: NextRequest) {
  const { prompt, previewData, model = 'anthropic/claude-3-haiku' } = await req.json();

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
        model,
        messages: [
          {
            role: 'system',
            content: `You are an expert data analyst and visualization specialist. Your task is to:
1. Analyze the data and suggest appropriate visualizations
2. Return a structured JSON response with:
   - chartConfig: Configuration for the recommended chart
   - insight: A clear explanation of the data insight
   - suggestions: List of alternative visualization suggestions

The chartConfig should follow this format:
{
  "type": "bar|line|scatter|pie|area",
  "encoding": {
    "x": { "field": "column_name", "type": "string|number|date" },
    "y": { "field": "column_name", "type": "number" },
    "color": { "field": "column_name", "type": "string" }
  }
}

Always return valid JSON, even if you're not sure about the best visualization.`
          },
          {
            role: 'user',
            content: `User prompt: ${prompt}\n\nHere is a preview of the table data:\n${tableText}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenRouter Error:', error);
      return NextResponse.json({ error: 'AI model error' }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content ?? '{}';

    try {
      const parsedResponse: AIResponse = JSON.parse(aiResponse);
      return NextResponse.json({ output: parsedResponse });
    } catch (e) {
      console.error('Failed to parse AI response:', e);
      return NextResponse.json({ 
        output: {
          insight: aiResponse,
          suggestions: []
        }
      });
    }
  } catch (err) {
    console.error('Request failed:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 
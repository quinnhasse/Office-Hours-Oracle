import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt, system, model = "claude-3-5-haiku-20241022", maxTokens = 1000 } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: system || "You are a helpful assistant.",
      messages: [{ role: "user", content: prompt }]
    });

    return Response.json({ 
      response: message.content[0].text,
      usage: message.usage 
    });
  } catch (error) {
    console.error('Claude API error:', error);
    return Response.json({ 
      error: 'Failed to get response from Claude',
      details: error.message 
    }, { status: 500 });
  }
}
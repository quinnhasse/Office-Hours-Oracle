// Utility functions for Claude API interactions

export const CLAUDE_MODELS = {
  HAIKU: 'claude-3-5-haiku-20241022',     // Fast & cheap
  SONNET_OLD: 'claude-3-sonnet-20240229', // Previous Sonnet
  OPUS: 'claude-3-opus-20240229'          // Most capable
};

export const SYSTEM_PROMPTS = {
  CREATIVE: "You are a creative writing assistant. Be imaginative and engaging.",
  ANALYTICAL: "You are an analytical assistant. Provide detailed, logical analysis.",
  CODER: "You are an expert programming assistant. Provide clean, efficient code.",
  EDUCATOR: "You are an educational assistant. Explain concepts clearly and thoroughly."
};

export async function callClaude(prompt, options = {}) {
  const {
    system = SYSTEM_PROMPTS.CREATIVE,
    model = CLAUDE_MODELS.HAIKU,
    maxTokens = 1000
  } = options;

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system, model, maxTokens })
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

export function parseClaudeResponse(response) {
  // Add any response parsing logic here
  return response;
}

export function estimateTokens(text) {
  // Rough estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}
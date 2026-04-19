import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

let anthropic = null;

try {
  if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your_key_here') {
    anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    console.log('✅ Claude API initialized');
  } else {
    console.log('⚠️  No ANTHROPIC_API_KEY — Claude agents will use mock responses');
  }
} catch (err) {
  console.log('⚠️  Claude API init failed:', err.message);
}

export async function callClaude(prompt, parseJson = false) {
  if (!anthropic) {
    throw new Error('No API key — using fallback');
  }

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].text;

  if (parseJson) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch {
      // Fall through to return text
    }
  }

  return { text };
}

export function isClaudeAvailable() {
  return anthropic !== null;
}

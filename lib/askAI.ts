// lib/askAI.ts
export type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  throw new Error('OpenRouter API key missing from environment');
}

export const askAI = async (messages: Message[]): Promise<string> => {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'mistralai/mixtral-8x7b-instruct',
      messages,
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.choices?.[0]?.message?.content) {
    throw new Error(data?.error?.message || 'No response from AI');
  }

  return data.choices[0].message.content.trim();
};

import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export async function generateTutorial(
  env: any,
  toolId: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced'
): Promise<{
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  steps: Array<{
    step: number;
    title: string;
    content: string;
    tips: string[];
  }>;
  resources: string[];
}> {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: tool } = await supabase
    .from('tools')
    .select('name, description, url, category:categories(name)')
    .eq('id', toolId)
    .single();

  if (!tool) {
    throw new Error('Tool not found');
  }

  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  const prompt = `Create a comprehensive step-by-step tutorial for ${tool.name}, an AI tool for ${tool.category?.name}.

Tool Info:
- Name: ${tool.name}
- Description: ${tool.description}
- Website: ${tool.url}

Difficulty Level: ${difficulty}

Generate a JSON response with:
{
  "title": "Tutorial title",
  "description": "What users will learn (2-3 sentences)",
  "duration": "Estimated time (e.g., '30 minutes')",
  "difficulty": "${difficulty}",
  "steps": [
    {
      "step": 1,
      "title": "Step title",
      "content": "Detailed instructions (use HTML for formatting)",
      "tips": ["Helpful tip 1", "Helpful tip 2"]
    }
  ],
  "resources": ["Additional resource links or tools"]
}

Make it practical, actionable, and easy to follow. Include 5-8 steps.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical instructor creating clear, actionable tutorials for AI tools.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
      max_tokens: 2000,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Tutorial generation error:', error);
    throw new Error('Failed to generate tutorial');
  }
}

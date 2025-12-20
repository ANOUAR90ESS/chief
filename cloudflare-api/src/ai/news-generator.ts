import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export async function generateNews(
  env: any,
  topic: string,
  toolId?: string
): Promise<{
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
}> {
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  let toolContext = '';

  if (toolId) {
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    const { data: tool } = await supabase
      .from('tools')
      .select('name, description, category_id, categories(name)')
      .eq('id', toolId)
      .single();

    if (tool) {
      const categoryName = (tool as any).categories?.name || 'AI tools';
      toolContext = `This news is about ${tool.name}, an AI tool in the ${categoryName} category. ${tool.description}`;
    }
  }

  const prompt = `Write a professional news article about: ${topic}

${toolContext}

Generate a JSON response with:
{
  "title": "Catchy headline (60-80 characters)",
  "excerpt": "Brief 1-2 sentence summary",
  "content": "Full article (300-500 words, use HTML paragraphs <p>)",
  "tags": ["relevant", "keywords", "array"]
}

Make it newsworthy, accurate, and engaging. Use a professional journalistic tone.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a professional tech journalist specializing in AI tools and technology news.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1500,
    });

    const response = JSON.parse(completion.choices[0].message.content || '{}');
    return response;
  } catch (error) {
    console.error('News generation error:', error);
    throw new Error('Failed to generate news article');
  }
}

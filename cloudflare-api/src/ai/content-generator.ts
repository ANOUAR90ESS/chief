import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export async function generateContent(
  env: any,
  toolId: string,
  type: 'description' | 'features' | 'benefits'
): Promise<string> {
  // Get tool info from Supabase
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: tool } = await supabase
    .from('tools')
    .select('name, description, url, category_id, categories(name)')
    .eq('id', toolId)
    .single();

  if (!tool) {
    throw new Error('Tool not found');
  }

  // Extract category name
  const categoryName = (tool as any).categories?.name || 'AI tools';

  // Initialize OpenAI
  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  const prompts = {
    description: `Write a compelling 2-3 paragraph description for ${tool.name}, an AI tool in the ${categoryName} category.

Current description: ${tool.description}
Website: ${tool.url}

Make it engaging, informative, and SEO-friendly. Focus on what makes this tool unique and valuable to users.`,

    features: `List the top 10 key features of ${tool.name}, an AI tool for ${categoryName}.

Format as a JSON array of feature objects with "title" and "description" fields.
Example: [{"title": "Feature Name", "description": "Brief description"}]

Make features specific, actionable, and valuable to potential users.`,

    benefits: `List the top 8 benefits of using ${tool.name} for ${categoryName} tasks.

Format as a JSON array of benefit objects with "title" and "description" fields.
Example: [{"title": "Benefit Title", "description": "How it helps users"}]

Focus on real-world value and outcomes users can achieve.`
  };

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert AI tool reviewer and technical writer. Your content is accurate, engaging, and SEO-optimized.'
        },
        {
          role: 'user',
          content: prompts[type]
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error('Failed to generate content');
  }
}

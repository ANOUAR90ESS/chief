import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

export async function generateCourse(
  env: any,
  toolId: string,
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
): Promise<{
  title: string;
  description: string;
  duration: string;
  level: string;
  objectives: string[];
  modules: Array<{
    module: number;
    title: string;
    description: string;
    lessons: Array<{
      title: string;
      duration: string;
      topics: string[];
    }>;
  }>;
  prerequisites: string[];
  certification: boolean;
}> {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

  const { data: tool } = await supabase
    .from('tools')
    .select('name, description, url, category_id, categories(name)')
    .eq('id', toolId)
    .single();

  if (!tool) {
    throw new Error('Tool not found');
  }

  const categoryName = (tool as any).categories?.name || 'AI tools';

  const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY,
  });

  const prompt = `Design a comprehensive online course for mastering ${tool.name}, an AI tool in the ${categoryName} category.

Tool Info:
- Name: ${tool.name}
- Description: ${tool.description}
- Website: ${tool.url}

Course Level: ${level}

Generate a JSON response with:
{
  "title": "Course title",
  "description": "Course overview (3-4 sentences)",
  "duration": "Total duration (e.g., '8 hours')",
  "level": "${level}",
  "objectives": ["Learning objective 1", "Learning objective 2", ...],
  "modules": [
    {
      "module": 1,
      "title": "Module title",
      "description": "What this module covers",
      "lessons": [
        {
          "title": "Lesson title",
          "duration": "Duration",
          "topics": ["Topic 1", "Topic 2"]
        }
      ]
    }
  ],
  "prerequisites": ["Required knowledge or skills"],
  "certification": true
}

Create 4-6 modules with 3-5 lessons each. Make it comprehensive and structured for effective learning.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are an expert curriculum designer specializing in AI tool education and professional training programs.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.6,
      max_tokens: 3000,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Course generation error:', error);
    throw new Error('Failed to generate course');
  }
}

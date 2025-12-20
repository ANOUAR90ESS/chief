import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { generateContent } from './ai/content-generator';
import { generateNews } from './ai/news-generator';
import { generateTutorial } from './ai/tutorial-generator';
import { generateCourse } from './ai/course-generator';

type Bindings = {
  OPENAI_API_KEY: string;
  GEMINI_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  ALLOWED_ORIGINS: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS middleware
app.use('/*', async (c, next) => {
  const allowedOrigins = c.env.ALLOWED_ORIGINS.split(',');
  const origin = c.req.header('origin') || '';

  if (allowedOrigins.includes(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  if (c.req.method === 'OPTIONS') {
    return new Response(null, { status: 204 });
  }

  await next();
});

// Health check
app.get('/', (c) => {
  return c.json({
    status: 'ok',
    service: 'AIChief API',
    version: '1.0.0'
  });
});

// AI Content Generation Endpoints
app.post('/api/ai/generate-content', async (c) => {
  try {
    const { toolId, type } = await c.req.json();

    if (!toolId || !type) {
      return c.json({ error: 'toolId and type are required' }, 400);
    }

    const content = await generateContent(c.env, toolId, type);
    return c.json({ success: true, content });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Generate News Article
app.post('/api/ai/generate-news', async (c) => {
  try {
    const { topic, toolId } = await c.req.json();

    if (!topic) {
      return c.json({ error: 'topic is required' }, 400);
    }

    const news = await generateNews(c.env, topic, toolId);
    return c.json({ success: true, news });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Generate Tutorial
app.post('/api/ai/generate-tutorial', async (c) => {
  try {
    const { toolId, difficulty } = await c.req.json();

    if (!toolId) {
      return c.json({ error: 'toolId is required' }, 400);
    }

    const tutorial = await generateTutorial(c.env, toolId, difficulty || 'beginner');
    return c.json({ success: true, tutorial });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Generate Course
app.post('/api/ai/generate-course', async (c) => {
  try {
    const { toolId, level } = await c.req.json();

    if (!toolId) {
      return c.json({ error: 'toolId is required' }, 400);
    }

    const course = await generateCourse(c.env, toolId, level || 'intermediate');
    return c.json({ success: true, course });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

// Batch generate content for a tool
app.post('/api/ai/generate-all', async (c) => {
  try {
    const { toolId } = await c.req.json();

    if (!toolId) {
      return c.json({ error: 'toolId is required' }, 400);
    }

    // Generate all content types in parallel
    const [description, news, tutorial, course] = await Promise.all([
      generateContent(c.env, toolId, 'description'),
      generateNews(c.env, `Latest updates about ${toolId}`, toolId),
      generateTutorial(c.env, toolId, 'beginner'),
      generateCourse(c.env, toolId, 'intermediate')
    ]);

    return c.json({
      success: true,
      data: {
        description,
        news,
        tutorial,
        course
      }
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
});

export default app;

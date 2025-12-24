import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, model, contents, config, prompt, image, operationName } = body;

    // Handle different tasks
    switch (task) {
      case 'generateContent': {
        const geminiModel = genAI.getGenerativeModel({ model: model || 'gemini-2.0-flash-exp' });

        // Prepare generation config
        const generationConfig: any = {};
        if (config?.responseMimeType) generationConfig.responseMimeType = config.responseMimeType;
        if (config?.responseSchema) generationConfig.responseSchema = config.responseSchema;
        if (config?.tools) generationConfig.tools = config.tools;

        // Generate content
        const result = await geminiModel.generateContent({
          contents: typeof contents === 'string' ? contents : contents,
          generationConfig
        });

        const response = await result.response;
        return NextResponse.json({
          text: response.text(),
          candidates: response.candidates
        });
      }

      case 'generateVideos': {
        // Video generation placeholder
        return NextResponse.json({
          name: `operation-${Date.now()}`,
          message: 'Video generation not yet implemented'
        });
      }

      case 'getVideosOperation': {
        // Poll video operation placeholder
        return NextResponse.json({
          done: true,
          message: 'Operation polling not yet implemented'
        });
      }

      default:
        return NextResponse.json({ error: 'Unknown task' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

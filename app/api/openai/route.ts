import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, model, messages, prompt, image, config } = body;

    switch (task) {
      case 'chat': {
        // Chat completion
        const completion = await openai.chat.completions.create({
          model: model || 'gpt-4o-mini',
          messages: messages || [{ role: 'user', content: prompt }],
          ...config
        });

        return NextResponse.json({
          text: completion.choices[0].message.content,
          usage: completion.usage,
          model: completion.model
        });
      }

      case 'generateImage': {
        // DALL-E image generation
        const response = await openai.images.generate({
          model: model || 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: config?.size || '1024x1024',
          quality: config?.quality || 'standard'
        });

        return NextResponse.json({
          url: response.data?.[0]?.url || '',
          revisedPrompt: response.data?.[0]?.revised_prompt || ''
        });
      }

      case 'editImage': {
        // DALL-E image edit
        // Convert base64 to file
        const imageBuffer = Buffer.from(image, 'base64');
        const imageFile = new File([imageBuffer], 'image.png', { type: 'image/png' });

        const response = await openai.images.edit({
          model: 'dall-e-2',
          image: imageFile,
          prompt: prompt,
          n: 1,
          size: config?.size || '1024x1024'
        });

        return NextResponse.json({
          url: response.data?.[0]?.url || ''
        });
      }

      case 'transcribe': {
        // Whisper transcription
        const audioBuffer = Buffer.from(image, 'base64');
        const audioFile = new File([audioBuffer], 'audio.mp3', { type: 'audio/mp3' });

        const transcription = await openai.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-1'
        });

        return NextResponse.json({
          text: transcription.text
        });
      }

      case 'tts': {
        // Text-to-speech
        const mp3 = await openai.audio.speech.create({
          model: 'tts-1',
          voice: config?.voice || 'alloy',
          input: prompt
        });

        const buffer = Buffer.from(await mp3.arrayBuffer());
        return NextResponse.json({
          audio: buffer.toString('base64')
        });
      }

      default:
        return NextResponse.json({ error: 'Unknown task' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process request' },
      { status: 500 }
    );
  }
}

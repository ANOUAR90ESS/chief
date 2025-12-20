'use client';

import { useState } from 'react';
import { Loader2, Sparkles, FileText, Newspaper, GraduationCap, BookOpen } from 'lucide-react';

interface AIContentGeneratorProps {
  toolId: string;
  toolName: string;
  apiUrl: string; // URL del backend en Cloudflare
}

export default function AIContentGenerator({ toolId, toolName, apiUrl }: AIContentGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const contentTypes = [
    {
      id: 'description',
      name: 'Enhanced Description',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      id: 'news',
      name: 'News Article',
      icon: Newspaper,
      color: 'bg-green-500',
    },
    {
      id: 'tutorial',
      name: 'Tutorial',
      icon: GraduationCap,
      color: 'bg-purple-500',
    },
    {
      id: 'course',
      name: 'Complete Course',
      icon: BookOpen,
      color: 'bg-orange-500',
    },
  ];

  const generateContent = async (type: string) => {
    setLoading(true);
    setError('');
    setSelectedType(type);
    setGeneratedContent(null);

    try {
      const endpoints: Record<string, string> = {
        description: '/api/ai/generate-content',
        news: '/api/ai/generate-news',
        tutorial: '/api/ai/generate-tutorial',
        course: '/api/ai/generate-course',
      };

      const bodies: Record<string, any> = {
        description: { toolId, type: 'description' },
        news: { toolId, topic: `Latest updates about ${toolName}` },
        tutorial: { toolId, difficulty: 'beginner' },
        course: { toolId, level: 'intermediate' },
      };

      const response = await fetch(`${apiUrl}${endpoints[type]}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodies[type]),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (err: any) {
      setError(err.message || 'Error generating content');
    } finally {
      setLoading(false);
    }
  };

  const generateAll = async () => {
    setLoading(true);
    setError('');
    setSelectedType('all');
    setGeneratedContent(null);

    try {
      const response = await fetch(`${apiUrl}/api/ai/generate-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data);
    } catch (err: any) {
      setError(err.message || 'Error generating content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary/5 border border-border rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="w-6 h-6 text-accent" />
        <div>
          <h3 className="text-xl font-bold">AI Content Generator</h3>
          <p className="text-sm text-secondary">
            Generate content for {toolName} using AI
          </p>
        </div>
      </div>

      {/* Content Type Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => generateContent(type.id)}
              disabled={loading}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedType === type.id && !loading
                  ? 'border-accent bg-accent/10'
                  : 'border-border hover:border-accent/50'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Icon className={`w-6 h-6 mx-auto mb-2 text-accent`} />
              <p className="text-sm font-medium">{type.name}</p>
            </button>
          );
        })}
      </div>

      {/* Generate All Button */}
      <button
        onClick={generateAll}
        disabled={loading}
        className={`w-full p-4 rounded-lg font-semibold transition-colors mb-6 ${
          loading
            ? 'bg-secondary/20 cursor-not-allowed'
            : 'bg-gradient-to-r from-accent to-primary text-white hover:opacity-90'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate All Content Types
          </span>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500 rounded-lg mb-6">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Generated Content Display */}
      {generatedContent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Generated Content</h4>
            <button
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(generatedContent, null, 2));
                alert('Content copied to clipboard!');
              }}
              className="text-sm text-accent hover:underline"
            >
              Copy JSON
            </button>
          </div>

          <div className="bg-background p-4 rounded-lg border border-border max-h-96 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(generatedContent, null, 2)}
            </pre>
          </div>

          {/* Save to Database Button */}
          <button
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold"
            onClick={() => {
              // TODO: Implementar guardado en Supabase
              alert('Content saved! (Implement Supabase save)');
            }}
          >
            Save to Database
          </button>
        </div>
      )}
    </div>
  );
}

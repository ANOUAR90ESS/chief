'use client';

import { useState, useEffect } from 'react';
import { Sparkles, FileText, Newspaper, BookOpen, GraduationCap, Loader2, Copy, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Tool {
  id: string;
  name: string;
  description: string;
}

export default function AIGeneratorPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [selectedTool, setSelectedTool] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'news' | 'tutorial' | 'course' | 'all'>('content');
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [contentType, setContentType] = useState('description');
  const [newsTopic, setNewsTopic] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [courseLevel, setCourseLevel] = useState('intermediate');

  const supabase = createClient();
  const API_URL = 'https://aichief-api.vetorre.workers.dev';

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const { data, error } = await supabase
        .from('tools')
        .select('id, name, description')
        .eq('status', 'approved')
        .order('name');

      if (error) throw error;
      setTools(data || []);
    } catch (error: any) {
      console.error('Error fetching tools:', error);
    }
  };

  const handleGenerateContent = async () => {
    if (!selectedTool) {
      setError('Por favor selecciona una herramienta');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/ai/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedTool,
          type: contentType
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al generar contenido');

      setResult(data.content);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNews = async () => {
    if (!newsTopic) {
      setError('Por favor ingresa un tema');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/ai/generate-news`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: newsTopic,
          toolId: selectedTool || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al generar noticia');

      setResult(data.news);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTutorial = async () => {
    if (!selectedTool) {
      setError('Por favor selecciona una herramienta');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/ai/generate-tutorial`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedTool,
          difficulty
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al generar tutorial');

      setResult(data.tutorial);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCourse = async () => {
    if (!selectedTool) {
      setError('Por favor selecciona una herramienta');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/ai/generate-course`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: selectedTool,
          level: courseLevel
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al generar curso');

      setResult(data.course);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAll = async () => {
    if (!selectedTool) {
      setError('Por favor selecciona una herramienta');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/api/ai/generate-all`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolId: selectedTool })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al generar contenido');

      setResult(data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: 'content', label: 'Contenido', icon: FileText },
    { id: 'news', label: 'Noticias', icon: Newspaper },
    { id: 'tutorial', label: 'Tutorial', icon: BookOpen },
    { id: 'course', label: 'Curso', icon: GraduationCap },
    { id: 'all', label: 'Todo', icon: Sparkles }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Generador de Contenido con IA</h1>
        <p className="text-secondary mt-1">Genera contenido automáticamente usando OpenAI</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-secondary/5 border border-border hover:bg-secondary/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-secondary/5 border border-border rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Configuración</h2>

          {/* Tool Selector (except for news) */}
          {activeTab !== 'news' && (
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Herramienta</label>
              <select
                value={selectedTool}
                onChange={(e) => setSelectedTool(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="">Selecciona una herramienta</option>
                {tools.map((tool) => (
                  <option key={tool.id} value={tool.id}>
                    {tool.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Content Type */}
          {activeTab === 'content' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tipo de Contenido</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="description">Descripción</option>
                  <option value="features">Características</option>
                  <option value="benefits">Beneficios</option>
                </select>
              </div>
              <button
                onClick={handleGenerateContent}
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {loading ? 'Generando...' : 'Generar Contenido'}
              </button>
            </>
          )}

          {/* News */}
          {activeTab === 'news' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Tema de la Noticia</label>
                <input
                  type="text"
                  value={newsTopic}
                  onChange={(e) => setNewsTopic(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                  placeholder="Ej: Últimas actualizaciones de ChatGPT"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Herramienta (Opcional)</label>
                <select
                  value={selectedTool}
                  onChange={(e) => setSelectedTool(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="">Ninguna</option>
                  {tools.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {tool.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleGenerateNews}
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Newspaper className="w-5 h-5" />}
                {loading ? 'Generando...' : 'Generar Noticia'}
              </button>
            </>
          )}

          {/* Tutorial */}
          {activeTab === 'tutorial' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Dificultad</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                </select>
              </div>
              <button
                onClick={handleGenerateTutorial}
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <BookOpen className="w-5 h-5" />}
                {loading ? 'Generando...' : 'Generar Tutorial'}
              </button>
            </>
          )}

          {/* Course */}
          {activeTab === 'course' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Nivel</label>
                <select
                  value={courseLevel}
                  onChange={(e) => setCourseLevel(e.target.value)}
                  className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="beginner">Principiante</option>
                  <option value="intermediate">Intermedio</option>
                  <option value="advanced">Avanzado</option>
                  <option value="expert">Experto</option>
                </select>
              </div>
              <button
                onClick={handleGenerateCourse}
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <GraduationCap className="w-5 h-5" />}
                {loading ? 'Generando...' : 'Generar Curso'}
              </button>
            </>
          )}

          {/* All */}
          {activeTab === 'all' && (
            <button
              onClick={handleGenerateAll}
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {loading ? 'Generando Todo...' : 'Generar Todo el Contenido'}
            </button>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Result Panel */}
        <div className="bg-secondary/5 border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Resultado</h2>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors text-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            )}
          </div>

          <div className="bg-background border border-border rounded-lg p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {!loading && !result && (
              <div className="text-secondary text-center h-full flex items-center justify-center">
                Los resultados aparecerán aquí
              </div>
            )}

            {!loading && result && (
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Eye } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getUserProfile } from '@/lib/supabase/auth';

interface Tool {
  id: string;
  name: string;
  description: string;
  url: string;
  pricing: string;
  platforms: string[];
  verified: boolean;
  featured: boolean;
  status: string;
  created_at: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  reviews: Array<{ rating: number }>;
}

export default function AdminToolsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tools, setTools] = useState<Tool[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const userWithProfile = await getUserProfile();

    if (!userWithProfile || userWithProfile.profile?.role !== 'admin') {
      router.push('/auth/signin');
      return;
    }

    fetchTools();
  };

  const fetchTools = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(*),
        reviews(rating)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tools:', error);
    } else {
      setTools(data || []);
    }

    setLoading(false);
  };

  const updateToolStatus = async (toolId: string, status: string) => {
    const { error } = await supabase
      .from('tools')
      .update({ status })
      .eq('id', toolId);

    if (error) {
      console.error('Error updating tool:', error);
    } else {
      // Update local state
      setTools(tools.map(t =>
        t.id === toolId ? { ...t, status } : t
      ));
    }
  };

  const toggleFeatured = async (toolId: string, currentFeatured: boolean) => {
    const { error } = await supabase
      .from('tools')
      .update({ featured: !currentFeatured })
      .eq('id', toolId);

    if (error) {
      console.error('Error updating tool:', error);
    } else {
      // Update local state
      setTools(tools.map(t =>
        t.id === toolId ? { ...t, featured: !currentFeatured } : t
      ));
    }
  };

  const filteredTools = tools.filter((tool) => {
    if (filter === 'all') return true;
    return tool.status === filter;
  });

  const getToolRating = (tool: Tool) => {
    if (!tool.reviews || tool.reviews.length === 0) return 0;
    const sum = tool.reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / tool.reviews.length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gestión de Herramientas</h1>
          <p className="text-secondary">
            Administra todas las herramientas de IA
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-secondary/10 hover:bg-secondary/20'
          }`}
        >
          Todas ({tools.length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'approved'
              ? 'bg-primary text-white'
              : 'bg-secondary/10 hover:bg-secondary/20'
          }`}
        >
          Aprobadas ({tools.filter((t) => t.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-primary text-white'
              : 'bg-secondary/10 hover:bg-secondary/20'
          }`}
        >
          Pendientes ({tools.filter((t) => t.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'rejected'
              ? 'bg-primary text-white'
              : 'bg-secondary/10 hover:bg-secondary/20'
          }`}
        >
          Rechazadas ({tools.filter((t) => t.status === 'rejected').length})
        </button>
      </div>

      {/* Tools List */}
      <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/10 border-b border-border">
            <tr>
              <th className="text-left p-4 font-semibold">Nombre</th>
              <th className="text-left p-4 font-semibold">Categoría</th>
              <th className="text-left p-4 font-semibold">Estado</th>
              <th className="text-left p-4 font-semibold">Rating</th>
              <th className="text-left p-4 font-semibold">Destacado</th>
              <th className="text-right p-4 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredTools.map((tool) => {
              const rating = getToolRating(tool);
              const reviewCount = tool.reviews?.length || 0;

              return (
                <tr key={tool.id} className="border-b border-border hover:bg-secondary/5">
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-secondary truncate max-w-xs">
                        {tool.description}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-secondary/10 rounded text-sm">
                      {tool.category.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        tool.status === 'approved'
                          ? 'bg-green-500/10 text-green-500'
                          : tool.status === 'pending'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}
                    >
                      {tool.status === 'approved'
                        ? 'Aprobado'
                        : tool.status === 'pending'
                        ? 'Pendiente'
                        : 'Rechazado'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{rating.toFixed(1)}</span>
                      <span className="text-sm text-secondary">
                        ({reviewCount})
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => toggleFeatured(tool.id, tool.featured)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        tool.featured
                          ? 'bg-accent text-white'
                          : 'bg-secondary/10 hover:bg-secondary/20'
                      }`}
                    >
                      {tool.featured ? 'Sí' : 'No'}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      {tool.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateToolStatus(tool.id, 'approved')}
                            className="p-2 bg-green-500/10 text-green-500 rounded-lg hover:bg-green-500/20 transition-colors"
                            title="Aprobar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateToolStatus(tool.id, 'rejected')}
                            className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                            title="Rechazar"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
                        title="Ver sitio"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

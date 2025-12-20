'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Eye, Plus, Edit2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getUserProfile } from '@/lib/supabase/auth';

interface Tool {
  id: string;
  name: string;
  slug?: string;
  description: string;
  url: string;
  image_url?: string;
  pricing: string;
  platforms: string[];
  verified: boolean;
  featured: boolean;
  status: string;
  created_at: string;
  category_id?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  reviews: Array<{ rating: number }>;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminToolsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [tools, setTools] = useState<Tool[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    url: '',
    image_url: '',
    pricing: 'Free' as 'Free' | 'Freemium' | 'Paid' | 'Trial',
    platforms: [] as string[],
    category_id: '',
    verified: false,
    featured: false,
    status: 'approved' as 'pending' | 'approved' | 'rejected'
  });
  const [error, setError] = useState('');

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
    fetchCategories();
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

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
    } else {
      setCategories(data || []);
    }
  };

  const handleCreate = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      url: '',
      image_url: '',
      pricing: 'Free',
      platforms: [],
      category_id: categories.length > 0 ? categories[0].id : '',
      verified: false,
      featured: false,
      status: 'approved'
    });
    setShowModal(true);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      slug: tool.slug || '',
      description: tool.description,
      url: tool.url,
      image_url: tool.image_url || '',
      pricing: tool.pricing as any,
      platforms: tool.platforms || [],
      category_id: tool.category_id || tool.category.id,
      verified: tool.verified,
      featured: tool.featured,
      status: tool.status as any
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const toolData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        url: formData.url,
        image_url: formData.image_url || null,
        pricing: formData.pricing,
        platforms: formData.platforms,
        category_id: formData.category_id,
        verified: formData.verified,
        featured: formData.featured,
        status: formData.status
      };

      if (editingTool) {
        // Update existing tool
        const { error } = await supabase
          .from('tools')
          .update(toolData)
          .eq('id', editingTool.id);

        if (error) throw error;
      } else {
        // Create new tool
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
          .from('tools')
          .insert([{
            ...toolData,
            submitted_by_id: userData.user?.id
          }]);

        if (error) throw error;
      }

      // Reset and refresh
      setShowModal(false);
      setEditingTool(null);
      fetchTools();
    } catch (error: any) {
      setError(error.message || 'Error al guardar la herramienta');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta herramienta? Esto también eliminará todas sus reseñas.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchTools();
    } catch (error: any) {
      alert('Error al eliminar la herramienta: ' + error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTool(null);
    setError('');
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
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
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Herramienta
        </button>
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
                      <button
                        onClick={() => handleEdit(tool)}
                        className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500/20 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id)}
                        className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-background border border-border rounded-xl w-full max-w-2xl p-6 my-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingTool ? 'Editar Herramienta' : 'Nueva Herramienta'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary font-mono text-sm"
                    placeholder="auto-generado si está vacío"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Descripción *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Imagen URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Categoría *</label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Precio *</label>
                  <select
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value as any })}
                    className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="Free">Gratis</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Pago</option>
                    <option value="Trial">Prueba</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Plataformas</label>
                <div className="flex flex-wrap gap-2">
                  {['Web', 'iOS', 'Android', 'Windows', 'Mac', 'Linux'].map((platform) => (
                    <button
                      key={platform}
                      type="button"
                      onClick={() => handlePlatformToggle(platform)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        formData.platforms.includes(platform)
                          ? 'bg-primary text-white'
                          : 'bg-secondary/10 hover:bg-secondary/20'
                      }`}
                    >
                      {platform}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Estado</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="approved">Aprobado</option>
                    <option value="rejected">Rechazado</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Verificado</span>
                  </label>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Destacado</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {editingTool ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

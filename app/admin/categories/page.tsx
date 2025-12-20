'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  tool_count: number;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: 'FolderOpen'
  });
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase
          .from('categories')
          .update({
            name: formData.name,
            slug: formData.slug,
            icon: formData.icon
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
      } else {
        // Create new category
        const { error } = await supabase
          .from('categories')
          .insert([{
            name: formData.name,
            slug: formData.slug,
            icon: formData.icon
          }]);

        if (error) throw error;
      }

      // Reset form and refresh
      setFormData({ name: '', slug: '', icon: 'FolderOpen' });
      setShowModal(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (error: any) {
      setError(error.message || 'Error al guardar la categoría');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      icon: category.icon
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría? Esto también eliminará todas las herramientas asociadas.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCategories();
    } catch (error: any) {
      alert('Error al eliminar la categoría: ' + error.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', slug: '', icon: 'FolderOpen' });
    setError('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary">Cargando categorías...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Categorías</h1>
          <p className="text-secondary mt-1">Gestiona las categorías de herramientas</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Slug</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Icono</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Herramientas</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Creación</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-secondary/5">
                <td className="px-6 py-4 font-medium">{category.name}</td>
                <td className="px-6 py-4 text-secondary font-mono text-sm">{category.slug}</td>
                <td className="px-6 py-4 text-secondary">{category.icon}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    {category.tool_count || 0}
                  </span>
                </td>
                <td className="px-6 py-4 text-secondary text-sm">
                  {new Date(category.created_at).toLocaleDateString('es-ES')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
            <p className="text-secondary">No hay categorías registradas</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
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
                  className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary font-mono"
                  required
                  pattern="[a-z0-9-]+"
                  title="Solo letras minúsculas, números y guiones"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Icono (Lucide Icon)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                  required
                  placeholder="MessageSquare, Image, Code..."
                />
                <p className="text-xs text-secondary mt-1">
                  Ver iconos en: <a href="https://lucide.dev/icons" target="_blank" className="text-primary hover:underline">lucide.dev</a>
                </p>
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
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

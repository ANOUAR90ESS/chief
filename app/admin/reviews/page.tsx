'use client';

import { useState, useEffect } from 'react';
import { Trash2, Star, MessageSquare, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  tool: {
    id: string;
    name: string;
    slug: string;
  } | null;
  user: {
    id: string;
    display_name: string;
  } | null;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          tool:tool_id(id, name, slug),
          user:user_id(id, display_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data as any || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta reseña?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchReviews();
    } catch (error: any) {
      alert('Error al eliminar la reseña: ' + error.message);
    }
  };

  const filteredReviews = filterRating
    ? reviews.filter(r => r.rating === filterRating)
    : reviews;

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary">Cargando reseñas...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reseñas</h1>
        <p className="text-secondary mt-1">Gestiona las reseñas de usuarios</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-secondary/5 border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-secondary">Total Reseñas</p>
              <p className="text-2xl font-bold">{reviews.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/5 border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-secondary">Promedio</p>
              <p className="text-2xl font-bold">{averageRating}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/5 border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Star className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-secondary">5 Estrellas</p>
              <p className="text-2xl font-bold">
                {reviews.filter(r => r.rating === 5).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/5 border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <Star className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-secondary">1-2 Estrellas</p>
              <p className="text-2xl font-bold">
                {reviews.filter(r => r.rating <= 2).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterRating(null)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterRating === null
              ? 'bg-primary text-white'
              : 'bg-secondary/5 border border-border hover:bg-secondary/10'
          }`}
        >
          Todas
        </button>
        {[5, 4, 3, 2, 1].map((rating) => (
          <button
            key={rating}
            onClick={() => setFilterRating(rating)}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1 ${
              filterRating === rating
                ? 'bg-primary text-white'
                : 'bg-secondary/5 border border-border hover:bg-secondary/10'
            }`}
          >
            {rating} <Star className="w-4 h-4 fill-current" />
          </button>
        ))}
      </div>

      {/* Reviews Table */}
      <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Herramienta</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Rating</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Comentario</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Fecha</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredReviews.map((review) => (
              <tr key={review.id} className="hover:bg-secondary/5">
                <td className="px-6 py-4">
                  <div className="font-medium">
                    {review.user?.display_name || 'Usuario eliminado'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.tool?.name || 'Herramienta eliminada'}</span>
                    {review.tool?.slug && (
                      <a
                        href={`/tools/${review.tool.slug}`}
                        target="_blank"
                        className="text-primary hover:text-primary/80"
                        title="Ver herramienta"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{review.rating.toFixed(1)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 max-w-md">
                  <p className="text-secondary text-sm line-clamp-2">
                    {review.comment || <span className="italic">Sin comentario</span>}
                  </p>
                </td>
                <td className="px-6 py-4 text-secondary text-sm">
                  {new Date(review.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleDelete(review.id)}
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

        {filteredReviews.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
            <p className="text-secondary">
              {filterRating
                ? `No hay reseñas con ${filterRating} estrellas`
                : 'No hay reseñas registradas'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

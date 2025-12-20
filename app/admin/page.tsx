'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Users, Star, Clock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getUserProfile } from '@/lib/supabase/auth';

interface Stats {
  totalTools: number;
  pendingTools: number;
  totalUsers: number;
  totalReviews: number;
}

interface Tool {
  id: string;
  name: string;
  status: string;
  created_at: string;
  category: {
    name: string;
  };
  submitted_by?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [stats, setStats] = useState<Stats>({
    totalTools: 0,
    pendingTools: 0,
    totalUsers: 0,
    totalReviews: 0,
  });
  const [recentTools, setRecentTools] = useState<Tool[]>([]);
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

    fetchDashboardData();
  };

  const fetchDashboardData = async () => {
    setLoading(true);

    // Fetch stats in parallel
    const [
      { count: approvedCount },
      { count: pendingCount },
      { count: usersCount },
      { count: reviewsCount },
    ] = await Promise.all([
      supabase.from('tools').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      supabase.from('tools').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('reviews').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      totalTools: approvedCount || 0,
      pendingTools: pendingCount || 0,
      totalUsers: usersCount || 0,
      totalReviews: reviewsCount || 0,
    });

    // Fetch recent tools
    const { data: tools } = await supabase
      .from('tools')
      .select(`
        *,
        category:categories(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    setRecentTools(tools || []);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-secondary">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard de Administración</h1>
        <p className="text-secondary">
          Bienvenido al panel de administración de AIChief
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-secondary/5 border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Package className="w-6 h-6 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalTools}</p>
          <p className="text-sm text-secondary">Herramientas Aprobadas</p>
        </div>

        <div className="bg-secondary/5 border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-500/10 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.pendingTools}</p>
          <p className="text-sm text-secondary">Pendientes de Revisión</p>
        </div>

        <div className="bg-secondary/5 border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Users className="w-6 h-6 text-accent" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
          <p className="text-sm text-secondary">Usuarios Registrados</p>
        </div>

        <div className="bg-secondary/5 border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <Star className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold">{stats.totalReviews}</p>
          <p className="text-sm text-secondary">Reseñas Totales</p>
        </div>
      </div>

      {/* Recent Tools */}
      <div className="bg-secondary/5 border border-border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Herramientas Recientes</h2>
        <div className="space-y-4">
          {recentTools.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center justify-between p-4 bg-background rounded-lg border border-border"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold">{tool.name}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
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
                </div>
                <p className="text-sm text-secondary">
                  Categoría: {tool.category.name}
                </p>
              </div>
              <div className="text-sm text-secondary">
                {new Date(tool.created_at).toLocaleDateString('es-ES')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

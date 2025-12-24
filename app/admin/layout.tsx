'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Users,
  Star,
  Settings,
  LogOut,
  FolderOpen,
  Sparkles
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/lib/supabase/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    setUserEmail(user.email || '');

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      router.push('/');
      return;
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-secondary">Verificando permisos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="border-b border-border bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-2xl font-bold text-gradient">
                AIChief
              </Link>
              <span className="px-2 py-1 bg-accent text-white text-xs font-semibold rounded">
                ADMIN
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-secondary">
                {userEmail}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-2 sticky top-24">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                href="/admin/tools"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <Package className="w-5 h-5" />
                <span className="font-medium">Herramientas</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <FolderOpen className="w-5 h-5" />
                <span className="font-medium">Categorías</span>
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Usuarios</span>
              </Link>
              <Link
                href="/admin/reviews"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span className="font-medium">Reseñas</span>
              </Link>
              <Link
                href="/admin/ai-generator"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                <span className="font-medium">Generador IA</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/10 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Configuración</span>
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

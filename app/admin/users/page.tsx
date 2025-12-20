'use client';

import { useState, useEffect } from 'react';
import { Users, Shield, User as UserIcon, Edit2, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface UserProfile {
  id: string;
  role: 'user' | 'admin';
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  email?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState<'all' | 'admin' | 'user'>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState({
    display_name: '',
    role: 'user' as 'user' | 'admin'
  });
  const [error, setError] = useState('');

  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch auth users to get emails
      const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        // If admin API is not available, just use profiles without emails
        setUsers(profiles || []);
      } else {
        // Merge email data with profiles
        const usersWithEmails = profiles?.map(profile => ({
          ...profile,
          email: authData.users.find(u => u.id === profile.id)?.email || 'N/A'
        })) || [];
        setUsers(usersWithEmails);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      // Fallback: just fetch profiles without email
      try {
        const { data: profiles } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });
        setUsers(profiles || []);
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserProfile) => {
    setEditingUser(user);
    setFormData({
      display_name: user.display_name,
      role: user.role
    });
    setShowEditModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!editingUser) return;

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: formData.display_name,
          role: formData.role
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      setError(error.message || 'Error al actualizar el usuario');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      // This will cascade delete the profile due to foreign key constraint
      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) {
        // Fallback: just delete the profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .delete()
          .eq('id', id);

        if (profileError) throw profileError;
      }

      fetchUsers();
    } catch (error: any) {
      alert('Error al eliminar el usuario: ' + error.message);
    }
  };

  const filteredUsers = filterRole === 'all'
    ? users
    : users.filter(u => u.role === filterRole);

  const adminCount = users.filter(u => u.role === 'admin').length;
  const userCount = users.filter(u => u.role === 'user').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-secondary">Cargando usuarios...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-secondary mt-1">Gestiona los usuarios de la plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/5 border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-secondary">Total Usuarios</p>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/5 border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-secondary">Administradores</p>
              <p className="text-2xl font-bold">{adminCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-secondary/5 border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <UserIcon className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-secondary">Usuarios Regulares</p>
              <p className="text-2xl font-bold">{userCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilterRole('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterRole === 'all'
              ? 'bg-primary text-white'
              : 'bg-secondary/5 border border-border hover:bg-secondary/10'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilterRole('admin')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterRole === 'admin'
              ? 'bg-primary text-white'
              : 'bg-secondary/5 border border-border hover:bg-secondary/10'
          }`}
        >
          Administradores
        </button>
        <button
          onClick={() => setFilterRole('user')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filterRole === 'user'
              ? 'bg-primary text-white'
              : 'bg-secondary/5 border border-border hover:bg-secondary/10'
          }`}
        >
          Usuarios
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-secondary/5 border border-border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold">Usuario</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Rol</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">Fecha Registro</th>
              <th className="px-6 py-4 text-right text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-secondary/5">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.display_name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{user.display_name}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-secondary font-mono text-sm">
                  {user.email || 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-500/10 text-purple-500'
                        : 'bg-green-500/10 text-green-500'
                    }`}
                  >
                    {user.role === 'admin' ? (
                      <>
                        <Shield className="w-3 h-3 inline mr-1" />
                        Admin
                      </>
                    ) : (
                      'Usuario'
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 text-secondary text-sm">
                  {new Date(user.created_at).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
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

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-secondary mx-auto mb-3 opacity-50" />
            <p className="text-secondary">No hay usuarios registrados</p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-6">Editar Usuario</h2>

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
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Rol</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'user' | 'admin' })}
                  className="w-full px-4 py-2 bg-secondary/5 border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    setError('');
                  }}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Actualizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

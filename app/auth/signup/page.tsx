'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import { signUpWithEmail } from '@/lib/supabase/auth';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validations
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await signUpWithEmail(email, password, displayName);
      setSuccess(true);

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">AIChief</h1>
          <p className="text-secondary">Crear Nueva Cuenta</p>
        </div>

        <div className="bg-secondary/5 border border-border rounded-xl p-8">
          <h2 className="text-2xl font-bold mb-6">Registro</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
              ¡Cuenta creada exitosamente! Redirigiendo...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="Juan Pérez"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <p className="text-xs text-secondary mt-1">Mínimo 6 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Confirmar Contraseña
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Creando cuenta...'
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-secondary">
              ¿Ya tienes cuenta?{' '}
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Inicia Sesión
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-secondary hover:text-primary transition-colors">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  );
}

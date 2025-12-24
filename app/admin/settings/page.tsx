'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Save, Database, Key, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // Simulate save
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Configuración guardada exitosamente');
    } catch (err: any) {
      setError('Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-secondary mt-1">Administra la configuración del sitio</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-secondary/5 border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Configuración General</h2>
              <p className="text-sm text-secondary">Configuración básica del sitio</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nombre del Sitio
              </label>
              <input
                type="text"
                defaultValue="AIChief"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Descripción
              </label>
              <textarea
                defaultValue="Discover the Best AI Tools"
                rows={3}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                URL del Sitio
              </label>
              <input
                type="url"
                defaultValue="https://www.vetorre.com"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Database Settings */}
        <div className="bg-secondary/5 border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Database className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Base de Datos</h2>
              <p className="text-sm text-secondary">Configuración de Supabase</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Supabase URL
              </label>
              <input
                type="text"
                defaultValue="https://yigzyexdlswgbfgipbqi.supabase.co"
                disabled
                className="w-full px-4 py-3 bg-background border border-border rounded-lg opacity-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Status
              </label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-500 font-medium">Conectado</span>
              </div>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bg-secondary/5 border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <Key className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">API de IA</h2>
              <p className="text-sm text-secondary">Cloudflare Workers</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Cloudflare API URL
              </label>
              <input
                type="text"
                defaultValue="https://aichief-api.vetorre.workers.dev"
                disabled
                className="w-full px-4 py-3 bg-background border border-border rounded-lg opacity-50 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Status del API
              </label>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-green-500 font-medium">Operativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

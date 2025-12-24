# 🚀 Deploy a Vercel - Guía Paso a Paso

## ✅ Código Ya Está en GitHub

**Repository**: https://github.com/ANOUAR90ESS/chief
**Branch**: main
**Último commit**: Production ready - Vetorre complete

---

## 📋 Pre-requisitos

Antes de deployar, asegúrate de tener:
- ✅ Cuenta en [vercel.com](https://vercel.com)
- ✅ Cuenta en [supabase.com](https://supabase.com)
- ✅ Schema SQL ejecutado en Supabase
- ✅ Service Role Key de Supabase (opcional para AI features)

---

## 🎯 Paso 1: Importar a Vercel

### 1.1 Ir a Vercel
1. Abre: https://vercel.com/new
2. Sign in con GitHub

### 1.2 Importar Repositorio
1. En "Import Git Repository"
2. Busca: `ANOUAR90ESS/chief`
3. Click **"Import"**

### 1.3 Configurar Proyecto
- **Project Name**: `vetorre` (o el que prefieras)
- **Framework Preset**: Next.js (auto-detectado)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

---

## 🔑 Paso 2: Variables de Entorno

Click en **"Environment Variables"** y agrega:

### Supabase (Requerido)
```
NEXT_PUBLIC_SUPABASE_URL
```
**Value**: `https://cuphebrekwnddbedzojc.supabase.co`

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value**: Tu anon key desde https://supabase.com/dashboard/project/cuphebrekwnddbedzojc/settings/api

### AI APIs (Opcional - solo si usarás features de AI)
```
OPENAI_API_KEY
```
**Value**: Tu OpenAI API key

```
GEMINI_API_KEY
```
**Value**: Tu Gemini API key

### Cloudflare Workers (Opcional)
```
NEXT_PUBLIC_CLOUDFLARE_API_URL
```
**Value**: `https://aichief-api.vetorre.workers.dev`

### Service Role Key (Solo para AI generation)
```
SUPABASE_SERVICE_ROLE_KEY
```
**Value**: Tu service role key (si usas Cloudflare Workers)

---

## 🚀 Paso 3: Deploy

1. Click **"Deploy"**
2. Espera 2-3 minutos
3. ✅ Deploy completo!

Vercel te dará una URL como:
```
https://vetorre.vercel.app
```

---

## 🌐 Paso 4: Configurar Dominio vetorre.com

### 4.1 En Vercel
1. Ve a: Project Settings → Domains
2. Click **"Add Domain"**
3. Ingresa: `vetorre.com`
4. Click **"Add"**

### 4.2 También agrega www
1. Click **"Add Domain"**
2. Ingresa: `www.vetorre.com`
3. Click **"Add"**

### 4.3 Configurar DNS
Vercel te mostrará los records DNS necesarios. En tu proveedor de DNS:

**Para dominio apex (vetorre.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Para www:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 4.4 Esperar Propagación
- Tiempo: 5 minutos a 48 horas
- Vercel verificará automáticamente
- SSL se configurará automático

---

## 🔧 Paso 5: Actualizar Supabase Auth URLs

Una vez tengas la URL de Vercel:

1. Ve a: https://supabase.com/dashboard/project/cuphebrekwnddbedzojc/auth/url-configuration

2. **Site URL**:
   ```
   https://vetorre.com
   ```

3. **Redirect URLs** (agrega estos):
   ```
   https://vetorre.com/**
   https://www.vetorre.com/**
   https://vetorre.vercel.app/**
   http://localhost:3000/**
   ```

4. Click **"Save"**

---

## 🔄 Paso 6: Actualizar CORS en Cloudflare (si usas Workers)

```bash
cd cloudflare-api

# Editar wrangler.toml
```

Actualizar línea 7:
```toml
ALLOWED_ORIGINS = "http://localhost:3000,https://vetorre.com,https://www.vetorre.com,https://vetorre.vercel.app"
```

Deploy:
```bash
npx wrangler deploy
```

---

## ✅ Paso 7: Verificar Deploy

### 7.1 Homepage
Visita: `https://vetorre.vercel.app` o `https://vetorre.com`

Debe cargar:
- ✅ Hero section
- ✅ Featured tools
- ✅ Footer con "Vetorre"

### 7.2 Páginas
Verifica que funcionen:
- ✅ `/tools` - Listado de herramientas
- ✅ `/tools/[id]` - Detalle (si hay datos)
- ✅ `/categories/[slug]` - Por categoría
- ✅ `/auth/signin` - Login
- ✅ `/auth/signup` - Registro
- ✅ `/admin` - Admin panel (si eres admin)

### 7.3 Funcionalidad
- ✅ Theme toggle (dark/light)
- ✅ Navigation funciona
- ✅ Signup/Login funciona
- ✅ Admin panel accesible (si eres admin)

---

## 🐛 Troubleshooting

### Build Failed

**Error**: "Missing environment variables"
```bash
# Solución:
1. Ve a Project Settings → Environment Variables
2. Verifica que NEXT_PUBLIC_SUPABASE_URL esté configurada
3. Verifica que NEXT_PUBLIC_SUPABASE_ANON_KEY esté configurada
4. Redeploy
```

**Error**: "Module not found"
```bash
# Solución:
git push # Asegúrate que el código esté actualizado
Vercel redeployará automáticamente
```

### Runtime Errors

**Error**: "Supabase connection failed"
```bash
# Verifica:
1. URLs en Environment Variables son correctas
2. Supabase project está activo
3. Schema SQL fue ejecutado
```

**Error**: "Auth error"
```bash
# Verifica:
1. Auth URLs en Supabase incluyen tu dominio Vercel
2. Site URL está configurada
3. Redirect URLs incluyen /** al final
```

### Domain Issues

**Error**: "Domain not working"
```bash
# Verifica:
1. DNS records están correctos
2. Espera 24-48 horas para propagación
3. Usa https://dnschecker.org para verificar
```

---

## 📊 Después del Deploy

### Analytics
Vercel Analytics está incluido automáticamente:
- Ve a: Analytics tab en Vercel dashboard
- Monitorea: Page views, visitors, performance

### Logs
Para ver errores:
1. Ve a: Deployments tab
2. Click en tu deployment
3. Ve a: Runtime Logs

### Redeploy
Para actualizar:
```bash
git add .
git commit -m "Update"
git push origin main
```
Vercel deployará automáticamente!

---

## 🎯 Checklist Final

Antes de anunciar el sitio:

- [ ] Homepage carga correctamente
- [ ] Todas las páginas funcionan
- [ ] Signup/Login funcional
- [ ] Admin panel accesible
- [ ] Theme toggle funciona
- [ ] Responsive en mobile
- [ ] SSL activo (https)
- [ ] Dominio personalizado configurado
- [ ] Google Search Console configurado (opcional)
- [ ] Analytics funcionando

---

## 🔗 Links Útiles

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://supabase.com/dashboard/project/cuphebrekwnddbedzojc
- **GitHub Repo**: https://github.com/ANOUAR90ESS/chief
- **Documentación**: Ver [README.md](README.md)

---

## 📝 Próximos Pasos

1. ✅ **Deploy completado**
2. ⏭️ Poblar datos (tools, categories)
3. ⏭️ Crear usuario admin
4. ⏭️ Configurar SEO (sitemap, robots.txt)
5. ⏭️ Marketing y anuncio

---

**🎉 ¡Felicidades! Tu sitio Vetorre está en producción!**

Para soporte o preguntas, consulta la [documentación completa](DEPLOYMENT.md).

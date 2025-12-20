# AIChief Backend API - Cloudflare Workers

Backend API para generación de contenido con IA usando OpenAI y Gemini.

## 🚀 Features

- ✅ Generación de descripciones mejoradas con IA
- ✅ Creación automática de artículos de noticias
- ✅ Generación de tutoriales paso a paso
- ✅ Creación de cursos completos
- ✅ Edge computing (rápido globalmente)
- ✅ API keys seguras (nunca expuestas al frontend)
- ✅ CORS configurado
- ✅ TypeScript

## 📦 Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **IA**: OpenAI GPT-4 / GPT-3.5
- **Database**: Supabase (PostgreSQL)
- **Language**: TypeScript

## 🛠️ Instalación Local

```bash
# Instalar dependencias
npm install

# Login a Cloudflare
wrangler login

# Configurar secrets locales (.dev.vars)
cat > .dev.vars << EOF
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ALLOWED_ORIGINS=http://localhost:3000
EOF

# Correr en desarrollo
npm run dev
```

La API estará disponible en: `http://localhost:8787`

## 📡 Endpoints

### Health Check
```
GET /
```

Response:
```json
{
  "status": "ok",
  "service": "AIChief API",
  "version": "1.0.0"
}
```

### Generate Content
```
POST /api/ai/generate-content
```

Body:
```json
{
  "toolId": "uuid",
  "type": "description" | "features" | "benefits"
}
```

Response:
```json
{
  "success": true,
  "content": "Generated content..."
}
```

### Generate News
```
POST /api/ai/generate-news
```

Body:
```json
{
  "topic": "Latest AI tool updates",
  "toolId": "uuid" // optional
}
```

Response:
```json
{
  "success": true,
  "news": {
    "title": "...",
    "excerpt": "...",
    "content": "...",
    "tags": ["ai", "tools"]
  }
}
```

### Generate Tutorial
```
POST /api/ai/generate-tutorial
```

Body:
```json
{
  "toolId": "uuid",
  "difficulty": "beginner" | "intermediate" | "advanced"
}
```

Response:
```json
{
  "success": true,
  "tutorial": {
    "title": "...",
    "description": "...",
    "duration": "30 minutes",
    "steps": [...],
    "resources": [...]
  }
}
```

### Generate Course
```
POST /api/ai/generate-course
```

Body:
```json
{
  "toolId": "uuid",
  "level": "beginner" | "intermediate" | "advanced" | "expert"
}
```

Response:
```json
{
  "success": true,
  "course": {
    "title": "...",
    "description": "...",
    "modules": [...],
    "objectives": [...],
    "prerequisites": [...]
  }
}
```

### Generate All Content
```
POST /api/ai/generate-all
```

Body:
```json
{
  "toolId": "uuid"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "description": "...",
    "news": {...},
    "tutorial": {...},
    "course": {...}
  }
}
```

## 🔐 Configurar Secrets

Para producción, usa `wrangler secret`:

```bash
# OpenAI
wrangler secret put OPENAI_API_KEY

# Gemini (opcional)
wrangler secret put GEMINI_API_KEY

# Supabase
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

## 🚢 Deploy

```bash
# Deploy a producción
npm run deploy

# O con nombre custom
wrangler deploy --name aichief-api-prod

# Ver logs
wrangler tail
```

Obtendrás una URL como:
```
https://aichief-api.tu-cuenta.workers.dev
```

## 🌍 CORS

Actualiza los orígenes permitidos en `wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGINS = "https://tu-dominio.vercel.app,https://otro-dominio.com"
```

## 📁 Estructura

```
cloudflare-api/
├── src/
│   ├── index.ts                  # Main server
│   └── ai/
│       ├── content-generator.ts  # Description generator
│       ├── news-generator.ts     # News generator
│       ├── tutorial-generator.ts # Tutorial generator
│       └── course-generator.ts   # Course generator
├── wrangler.toml                 # Cloudflare config
├── package.json
└── tsconfig.json
```

## 💰 Costos

- **Cloudflare Workers**: Gratis hasta 100K req/día
- **OpenAI GPT-3.5**: ~$0.002 por 1K tokens
- **OpenAI GPT-4**: ~$0.01-0.03 por 1K tokens

Generación promedio (500 palabras): $0.01-0.05

## 🧪 Testing Local

```bash
# Iniciar dev server
npm run dev

# En otra terminal, test con curl
curl http://localhost:8787

# Test generación de contenido
curl -X POST http://localhost:8787/api/ai/generate-news \
  -H "Content-Type: application/json" \
  -d '{"topic": "Latest AI trends", "toolId": "uuid-here"}'
```

## 📝 Variables de Entorno

### Requeridas
- `OPENAI_API_KEY` - API key de OpenAI
- `SUPABASE_URL` - URL de tu proyecto Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key de Supabase

### Opcionales
- `GEMINI_API_KEY` - API key de Google Gemini
- `ALLOWED_ORIGINS` - Orígenes permitidos para CORS

## 🔧 Desarrollo

```bash
# Instalar deps
npm install

# Formato y lint
npm run format

# Type check
npm run typecheck
```

## 📚 Recursos

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Hono Framework](https://hono.dev/)
- [OpenAI API](https://platform.openai.com/docs)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

---

**Desarrollado para AIChief** 🚀

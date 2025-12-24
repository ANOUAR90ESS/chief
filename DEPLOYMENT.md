# Deployment Guide - Vetorre Production

## ✅ Status: Ready for Production

All critical issues have been resolved. The project is now production-ready.

## Pre-Deployment Checklist

- [x] Remove hardcoded credentials
- [x] Create `.env.example` template
- [x] Clean legacy environment variables
- [x] Remove unnecessary console.logs
- [x] Fix static rendering issues
- [x] Verify production build passes

## Environment Variables Required

### Next.js App (Vercel/Platform)

Configure these environment variables in your deployment platform:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yigzyexdlswgbfgipbqi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# OpenAI API
OPENAI_API_KEY=sk-proj-...

# Google Gemini API
GEMINI_API_KEY=AIza...

# Cloudflare Workers API
NEXT_PUBLIC_CLOUDFLARE_API_URL=https://aichief-api.vetorre.workers.dev
```

### Cloudflare Workers API

The API is already deployed at `https://aichief-api.vetorre.workers.dev`

Verify secrets are configured:

```bash
cd cloudflare-api

# Set secrets (if not already set)
npx wrangler secret put OPENAI_API_KEY
npx wrangler secret put GEMINI_API_KEY
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

## Deployment Steps

### Option 1: Deploy to Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Your repo is already at: https://github.com/ANOUAR90ESS/chief.git
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub: `ANOUAR90ESS/chief`

3. **Configure Environment Variables**
   - In Vercel project settings → Environment Variables
   - Add all variables from `.env.example`
   - Use your actual API keys (see `.env` file locally)

4. **Deploy**
   - Vercel will automatically build and deploy
   - Domain: Your project will be at `https://your-project.vercel.app`

5. **Update CORS**
   - After deployment, add your Vercel domain to Cloudflare CORS:
   ```bash
   cd cloudflare-api
   # Edit wrangler.toml and add your domain to ALLOWED_ORIGINS
   npx wrangler deploy
   ```

### Option 2: Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform**
   - Ensure environment variables are configured
   - Upload the `.next` folder and required files
   - Start with `npm start`

## Post-Deployment

### 1. Verify Deployment

- ✅ Homepage loads correctly
- ✅ Featured tools display
- ✅ Authentication works (login/signup)
- ✅ Admin panel accessible
- ✅ AI generation endpoints respond

### 2. Update CORS Origins

Add your production domain to:
- [cloudflare-api/wrangler.toml](cloudflare-api/wrangler.toml#L7) → `ALLOWED_ORIGINS`

### 3. Security Checklist

- [x] No API keys in source code
- [x] `.env` file in `.gitignore`
- [x] Environment variables configured in platform
- [x] CORS properly configured
- [x] Supabase RLS policies enabled
- [ ] Set up monitoring/error tracking (optional: Sentry, LogRocket)

### 4. Performance Optimization (Optional)

Consider adding:
- CDN for static assets
- Image optimization (Next.js already handles this)
- Database connection pooling (Supabase handles this)
- Redis caching for frequently accessed data

## Rollback Plan

If issues occur:

1. **Vercel**: Use "Redeploy" from previous deployment
2. **Manual**: Keep previous `.next` build folder as backup

## Monitoring

Monitor these metrics:
- Response times (Vercel Analytics)
- Error rates (Vercel/Platform logs)
- Database performance (Supabase dashboard)
- API usage (OpenAI/Gemini dashboards)
- Worker performance (Cloudflare dashboard)

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Cloudflare Workers: https://developers.cloudflare.com/workers/

## Changes Made for Production

1. **Security**
   - Removed hardcoded Supabase credentials from [lib/supabase/client.ts](lib/supabase/client.ts)
   - Now uses `process.env` variables
   - Added validation for missing environment variables

2. **Environment**
   - Created [.env.example](.env.example) template
   - Cleaned legacy variables (DATABASE_URL, NEXTAUTH_*)
   - Documented all required variables

3. **Error Handling**
   - Removed debug console.logs
   - API routes keep console.error for critical errors
   - Graceful error handling in components

4. **Performance**
   - Fixed static rendering warnings
   - Added `export const dynamic = 'force-dynamic'` to [app/page.tsx](app/page.tsx)
   - Build completes without errors

## Build Output

```
Route (app)
┌ ƒ /                        (Dynamic - uses cookies)
├ ○ /_not-found             (Static)
├ ○ /admin                  (Static)
├ ○ /admin/ai-generator     (Static)
├ ○ /admin/categories       (Static)
├ ○ /admin/reviews          (Static)
├ ○ /admin/settings         (Static)
├ ○ /admin/tools            (Static)
├ ○ /admin/users            (Static)
├ ƒ /api/gemini             (Dynamic - API route)
├ ƒ /api/openai             (Dynamic - API route)
├ ○ /auth/signin            (Static)
└ ○ /auth/signup            (Static)
```

All routes compiled successfully! ✅

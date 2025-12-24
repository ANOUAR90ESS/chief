# ⚡ Quick Deploy to Vercel

## 1. Push to GitHub

Your code is already at: `https://github.com/ANOUAR90ESS/chief.git`

```bash
git add .
git commit -m "Production ready - all security fixes applied"
git push origin main
```

## 2. Deploy to Vercel

### Step-by-Step:

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to `ANOUAR90ESS/chief`
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

5. **Add Environment Variables** (click "Environment Variables"):

> **Important**: Get your actual values from `.env` file (never commit this file!)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://cuphebrekwnddbedzojc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase-dashboard
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase-dashboard
OPENAI_API_KEY=your-openai-api-key
GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_CLOUDFLARE_API_URL=https://aichief-api.vetorre.workers.dev
```

6. Click **"Deploy"**

## 3. Wait for Build

Vercel will:
- ✅ Clone your repository
- ✅ Install dependencies
- ✅ Build Next.js app
- ✅ Deploy to production

Build time: ~2-3 minutes

## 4. Update CORS

After deployment, you'll get a URL like: `https://your-app.vercel.app`

Update Cloudflare CORS to include it:

```bash
cd cloudflare-api
```

Edit `wrangler.toml` line 7:
```toml
ALLOWED_ORIGINS = "http://localhost:3000,https://vetorre.com,https://www.vetorre.com,https://aichief.vetorre.com,https://your-app.vercel.app"
```

Deploy update:
```bash
npx wrangler deploy
```

## 5. Test Your App

Visit your Vercel URL and test:
- ✅ Homepage loads
- ✅ Tools display
- ✅ Sign up works
- ✅ Sign in works
- ✅ Admin panel (if admin)

## 🎉 Done!

Your app is live!

### Useful Links:
- **Your App**: Check Vercel dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Deployment Logs**: Click on your deployment in Vercel
- **Environment Variables**: Project Settings → Environment Variables

### Custom Domain (Optional)

To add a custom domain:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for DNS propagation (~24 hours)

---

## Troubleshooting

### Build Fails
- Check environment variables are all set
- View build logs in Vercel dashboard
- Verify all variables are copied correctly (no extra spaces)

### App Loads but Features Don't Work
- Check browser console for errors
- Verify API keys are valid
- Check CORS includes your Vercel domain

### Database Connection Issues
- Verify Supabase credentials are correct
- Check Supabase project is running
- Test connection from Supabase dashboard

---

**Need Help?** Check [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

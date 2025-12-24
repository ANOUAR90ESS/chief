# Vetorre - AI Tools Directory

![Vetorre](https://img.shields.io/badge/Vetorre-AI%20Tools-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.1.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Supabase](https://img.shields.io/badge/Supabase-Database-green)

> Discover the best AI tools across 180+ categories. Your comprehensive directory for finding and comparing AI solutions.

## 🌐 Live Site

**Production**: [https://vetorre.com](https://vetorre.com)

## 🚀 Features

- ✅ **AI Tools Directory** - Browse thousands of AI tools
- ✅ **Advanced Search** - Find tools by name, category, or features
- ✅ **Categories** - Organized into 180+ categories
- ✅ **Tool Details** - Comprehensive information, reviews, and ratings
- ✅ **User Reviews** - Community-driven ratings and feedback
- ✅ **Admin Panel** - Full content management system
- ✅ **Dark/Light Mode** - Beautiful UI with theme support
- ✅ **Responsive Design** - Works perfectly on all devices
- ✅ **SEO Optimized** - Built for search engine visibility

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Lucide React** - Icons
- **next-themes** - Dark mode support

### Backend
- **Supabase** - PostgreSQL database, authentication, and storage
- **Cloudflare Workers** - AI content generation API
- **OpenAI API** - GPT-4 integration
- **Google Gemini API** - Gemini integration

### Tools & Services
- **Vercel** - Deployment platform
- **GitHub** - Version control
- **Wrangler** - Cloudflare Workers CLI

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key (optional)
- Google Gemini API key (optional)

### Clone Repository

```bash
git clone https://github.com/ANOUAR90ESS/chief.git
cd chief
```

### Install Dependencies

```bash
npm install
```

### Environment Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# AI APIs
OPENAI_API_KEY=your-openai-key
GEMINI_API_KEY=your-gemini-key

# Cloudflare Workers
NEXT_PUBLIC_CLOUDFLARE_API_URL=your-worker-url
```

### Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
vetorre/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout with metadata
│   ├── tools/               # Tools pages
│   │   ├── page.tsx         # Tools listing
│   │   └── [id]/page.tsx    # Tool detail
│   ├── categories/          # Category pages
│   │   └── [slug]/page.tsx  # Tools by category
│   ├── admin/               # Admin panel
│   ├── auth/                # Authentication pages
│   └── api/                 # API routes
├── components/              # React components
│   ├── header.tsx          # Main navigation
│   ├── footer.tsx          # Footer
│   ├── hero.tsx            # Homepage hero
│   ├── tool-card.tsx       # Tool card component
│   └── ...
├── lib/                    # Utilities
│   ├── supabase/          # Supabase clients
│   └── types.ts           # TypeScript types
├── cloudflare-api/        # Cloudflare Workers
│   ├── src/
│   │   ├── index.ts      # Main worker
│   │   └── ai/           # AI generation
│   └── wrangler.toml     # Worker config
└── public/               # Static assets
```

## 🚀 Deployment

### Quick Deploy to Vercel

1. Push code to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy!

Full guide: [DEPLOYMENT.md](DEPLOYMENT.md)

### Cloudflare Workers

```bash
cd cloudflare-api
npx wrangler deploy
```

## 📖 Documentation

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Complete deployment guide
- **[PRODUCTION_READY.md](PRODUCTION_READY.md)** - Production readiness report
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - Quick start deployment
- **[PAGES_CREATED.md](PAGES_CREATED.md)** - Pages architecture

## 🔑 Key Features

### For Users
- **Browse Tools** - Explore AI tools by category
- **Search** - Find tools quickly
- **Reviews** - Read and write tool reviews
- **Compare** - Compare different tools
- **Save Favorites** - Bookmark your favorite tools

### For Admins
- **Tool Management** - Add, edit, approve tools
- **Category Management** - Organize categories
- **User Management** - Manage user accounts
- **Review Moderation** - Approve/reject reviews
- **AI Generator** - Auto-generate content
- **Analytics** - Track site statistics

## 🎨 Design

- **Modern UI** - Clean, professional design
- **Dark Mode** - Full dark/light theme support
- **Responsive** - Mobile-first approach
- **Accessible** - WCAG compliant
- **Fast** - Optimized performance

## 🔒 Security

- ✅ No hardcoded credentials
- ✅ Environment variables for secrets
- ✅ Supabase Row Level Security (RLS)
- ✅ CORS protection
- ✅ Input validation
- ✅ SQL injection prevention

## 📊 Database Schema

### Main Tables
- `tools` - AI tool listings
- `categories` - Tool categories
- `reviews` - User reviews
- `user_profiles` - Extended user data
- `news` - News articles
- `tutorials` - Tutorial content
- `courses` - Course listings

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is private and proprietary.

## 📧 Contact

- **Website**: [https://vetorre.com](https://vetorre.com)
- **Email**: contact@vetorre.com
- **Twitter**: [@vetorre](https://twitter.com/vetorre)

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudflare Workers](https://workers.cloudflare.com/)
- [OpenAI](https://openai.com/)
- [Google Gemini](https://deepmind.google/technologies/gemini/)

---

**Made with ❤️ by the Vetorre Team**

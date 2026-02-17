# AgenticPencil Platform Dashboard

The official platform dashboard for AgenticPencil - AI-powered SEO tools platform.

## 🚀 Features

- **Authentication**: GitHub and Google OAuth integration via Supabase
- **Dashboard Overview**: Credits usage, plan information, and API call analytics
- **API Key Management**: Create, view, and revoke API keys securely
- **Usage Analytics**: Detailed usage logs and credit consumption tracking
- **Billing**: Current plan details and upgrade options with Stripe integration
- **Results Viewer**: View and download past API call results

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: Supabase Auth (SSR)
- **Database**: Supabase PostgreSQL
- **Charts**: Recharts
- **Deployment**: Vercel

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔐 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://ruavjaxonlqfzoupznof.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yyQynsWUZ81eFm5QSVA_ZQ_5eMWD8We
NEXT_PUBLIC_API_BASE_URL=https://api.agenticpencil.com
```

## 🎨 Design System

The platform uses a dark theme with emerald/green accent colors to match the AgenticPencil brand:

- **Background**: Dark gray (`#0a0a0a`)
- **Primary**: Emerald green (`#10b981`)
- **Components**: shadcn/ui with custom theming
- **Layout**: Responsive sidebar navigation

## 📱 Pages

1. **Landing/Login** (`/`) - OAuth sign-in with GitHub and Google
2. **Dashboard** (`/dashboard`) - Overview with credits, plan info, and usage charts
3. **API Keys** (`/dashboard/keys`) - Create and manage API keys
4. **Usage** (`/dashboard/usage`) - Detailed usage logs and analytics
5. **Billing** (`/dashboard/billing`) - Plan details and upgrade options
6. **Results** (`/dashboard/results`) - View and download API call results

## 🔗 API Integration

The platform integrates with the AgenticPencil API:

- **Base URL**: `https://api.agenticpencil.com`
- **Authentication**: Bearer token (API key)
- **Endpoints**: Usage stats, API keys, billing, results

## 🚀 Deployment

The app is configured for Vercel deployment:

```bash
# Deploy to Vercel
vercel --prod
```

Vercel configuration is in `vercel.json` with environment variables and build settings.

## 🏗 Architecture

```
src/
├── app/                 # Next.js App Router pages
├── components/ui/       # shadcn/ui components
├── hooks/              # React hooks (auth)
├── lib/                # Utilities (API client, Supabase)
└── middleware.ts       # Authentication middleware
```

## 📊 Database Schema

The platform uses Supabase with the following tables:
- `profiles` - User profile data
- `api_keys` - API key management
- `usage_logs` - API usage tracking
- `cached_results` - Stored API results
- `rate_limits` - Rate limiting data

## 🔒 Security Features

- Server-side authentication with Supabase SSR
- Secure API key storage and display (prefix only)
- Protected routes with middleware
- CSRF protection
- Input validation and sanitization

## 📈 Performance

- Static generation where possible
- Optimized images and assets
- Code splitting by route
- Efficient API data fetching
- Responsive lazy loading
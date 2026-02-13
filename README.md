# AgenticPencil

**Your agentic content strategist. Know what to write.**

Stop guessing what to publish. AgenticPencil turns AI visibility intelligence, keyword research, and competitor analysis into a prioritized content map. One API call.

## What it does

- **Content Mapping** — Full topic clustering, prioritization, and content gap analysis. Give us your domain, we give you your next 100 articles ranked by impact.
- **AI Visibility Intelligence** — Real browser-based monitoring of ChatGPT, Perplexity, Gemini, Google AI Mode, and more. Not API calls — actual user interface scraping, the same way top SEO and AI SEO companies do.
- **Enterprise Writer API** — 14-step content pipeline with brand guidelines, schema markup, internal linking, and direct Webflow publishing.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Tech stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4

## Project structure

```
src/
  app/
    layout.tsx          — Root layout with fonts + metadata
    page.tsx            — Landing page composition
    globals.css         — All custom styles
  components/
    FadeIn.tsx          — Intersection observer animation wrapper
    Nav.tsx             — Fixed navigation bar
    Hero.tsx            — Hero section
    Statement.tsx       — Quote section
    ApiDemo.tsx         — Typing code window demo
    Features.tsx        — 3-card features grid
    Analysis.tsx        — Sitemap visual + analysis items + geo pills
    DataSources.tsx     — Data source logos strip
    Comparison.tsx      — Comparison table
    FinalCta.tsx        — Bottom CTA
    Footer.tsx          — Footer
```

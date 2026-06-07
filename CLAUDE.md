# Personal Portfolio — Project Context

## What this project is
Next.js 15 + TypeScript personal portfolio for **Raviganesh M** (Developer at SAP Labs). Replaces an old React + Sanity portfolio at `raviganeshmaniyoor.netlify.app`. Target hosting: **Vercel**. Backend: **Supabase** (PostgreSQL + Storage).

## Stack
- **Framework**: Next.js 15 App Router + TypeScript
- **Styling**: Tailwind CSS v3 (dark mode via `class`), Framer Motion animations
- **Backend**: Supabase JS v2 (lazy singleton in `src/lib/supabase.ts`)
- **Theme**: next-themes (default dark), amber/orange accent
- **Icons**: lucide-react
- **Notifications**: react-hot-toast (contact form)

## Design language
Gradient + futuristic + glassmorphism. Dark/light toggle. Amber (`#F59E0B`) / orange (`#F97316`) as primary accent. Dot-grid background pattern. Frosted glass cards (`bg-white/60 dark:bg-white/[0.04] backdrop-blur-xl`). Animation-rich: scroll-triggered reveals, stagger containers, typewriter, floating orbs, hover lifts.

## Project structure
```
src/
  app/
    page.tsx              ← "use client", renders all sections, fires visitor POST on mount
    layout.tsx            ← ThemeProvider, Navbar, Footer, Google Fonts (Inter + Space Grotesk)
    globals.css           ← Tailwind directives + custom utilities (.glass, .text-gradient, .dot-pattern)
    api/
      visitors/route.ts   ← GET (count), POST (record visit) — uses SUPABASE_SECRET_KEY
      contact/route.ts    ← POST (insert contact_messages) — uses SUPABASE_SECRET_KEY
  components/
    layout/
      Navbar.tsx          ← Sticky, scroll-blur, active section tracking via IntersectionObserver, mobile hamburger
      Footer.tsx          ← Visitor count badge, social links, copyright
      ThemeToggle.tsx     ← Sun/Moon toggle with rotation animation
    shared/
      AnimatedSection.tsx ← Framer Motion scroll-triggered wrapper + StaggerContainer + staggerItem
      GlassCard.tsx       ← Extends HTMLAttributes<HTMLDivElement> so onClick etc. pass through
      SectionHeader.tsx   ← tag chip + title (ReactNode) + subtitle + amber accent bar
      Skeleton.tsx        ← Skeleton + SkeletonCard for loading states
    sections/
      Hero.tsx            ← Full-screen, typewriter roles, profile image from /public/ravi_image.png, floating orbs, CTAs
      About.tsx           ← 3 cards (Who/What/Explore) + location/status cards + philosophy quote + stats
      Skills.tsx          ← Filterable by category, proficiency bar animated on viewport
      Experience.tsx      ← Vertical timeline with company logo, date range, skill tags
      Projects.tsx        ← Filterable by tag, hover overlay with Live Demo + Code links, featured badge
      Photography.tsx     ← RG Clicks gallery, category filter, built-in Framer Motion lightbox
      Testimonials.tsx    ← Auto-scroll carousel (5s), animated dots, stars
      Contact.tsx         ← Split layout: contact info left, form right; Toaster for feedback
  hooks/
    useData.ts            ← useProfile, useSkills, useExperience, useProjects, useTestimonials, usePhotography, useVisitorCount
  lib/
    supabase.ts           ← Lazy singleton: getSupabase() — IMPORTANT: never createClient at module level (causes build failure)
    utils.ts              ← cn(), formatDate(), formatDateRange(), getInitials(), pluralize()
  types/
    index.ts              ← Profile, Skill, ExperienceItem, Project, Testimonial, Photo, ContactMessage, VisitorStats
public/
  ravi_image.png          ← Profile photo (copied from ~/Downloads)
```

## Supabase tables
| Table | Key columns | Notes |
|---|---|---|
| `profile` | name, title, bio, avatar_url, resume_url, github_url, linkedin_url, instagram_url, email, location, available_for_work | Single row |
| `skills` | name, category, proficiency (0–100), icon_url, color, order_index, is_active | Filterable by category |
| `experience` | company, role, description, start_date, end_date, is_current, company_logo_url, skills_used[], order_index | Timeline |
| `projects` | title, description, image_url, project_url, github_url, tags[], is_featured, is_active, order_index | Tag-filterable |
| `testimonials` | name, role, company, avatar_url, feedback, rating, is_active, order_index | Star rating |
| `photography` | title, image_url, category, is_featured (→ larger grid cell), is_active, order_index | RG Clicks |
| `contact_messages` | name, email, subject, message, is_read | Written via secret key |
| `visitors` | page, user_agent, referrer, visited_at | Count shown in Footer |
| `visitor_stats` (view) | total_visits, unique_days, first_visit, last_visit, visits_last_7_days, visits_last_30_days | Analytics |

Full SQL + RLS policies + seed data in `SUPABASE_SETUP.md`.

## Environment variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=   ← replaces legacy anon key
SUPABASE_SECRET_KEY=                    ← server-side only, never exposed to client (replaces legacy service_role key)
```
Copy `.env.example` → `.env.local` and fill in values from Supabase dashboard (Settings → API Keys).

## Running locally
```bash
npm install
cp .env.example .env.local   # fill in Supabase credentials
npm run dev                   # http://localhost:3000
```

## Build / deploy
```bash
npm run build    # must pass before deploying
```
Deploy on Vercel: import repo, add env vars in Project Settings → Environment Variables.

## Important implementation notes
- `getSupabase()` in `src/lib/supabase.ts` is a lazy singleton — **never** change it to a module-level `createClient()` call. That causes a build failure because Next.js evaluates the module during static prerendering when env vars are not available.
- `GlassCard` extends `HTMLAttributes<HTMLDivElement>` so it accepts `onClick`, `aria-*` etc. natively.
- `SectionHeader.title` accepts `ReactNode` (not just `string`) so JSX (e.g., inline icons) can be passed.
- Section IDs match Navbar links: `home, about, skills, experience, projects, photography, testimonials, contact`.
- Profile image is at `/public/ravi_image.png` — used in `Hero.tsx` with `next/image`.
- `Photography.tsx` has a built-in Framer Motion lightbox (no extra library needed).
- Visitor tracking: `page.tsx` POSTs to `/api/visitors` on mount; `Footer.tsx` GETs the count via `useVisitorCount` hook.

## What still needs to be done (Supabase side)
1. Create Supabase project
2. Run all SQL from `SUPABASE_SETUP.md`
3. Upload images to Storage buckets (`avatars`, `projects`, `photography`, `company-logos`, `skill-icons`)
4. Insert real data into all tables (profile, skills, experience, projects, testimonials, photography)
5. Update social URLs in `Footer.tsx` and `Contact.tsx` with real links (currently placeholder hrefs)
6. Add real `resume_url` in profile row for the "Download CV" button to appear

# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project** — choose a name (e.g., `personal-portfolio`), set a strong DB password, pick a region close to you.
3. Wait for provisioning (~2 min).

---

## 2. Get Your API Keys

In your project dashboard go to **Settings → API**:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key (`sb_publishable_...`) |
| `SUPABASE_SECRET_KEY` | Secret key (`sb_secret_...`) — **keep secret** |

Copy these into `.env.local` (copy `.env.example` and fill in values).

---

## 3. Run the Database Schema

Go to **SQL Editor** in the Supabase dashboard and run each block below.

### 3.1 — Profile Table

```sql
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  resume_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  instagram_url TEXT,
  email TEXT,
  location TEXT,
  available_for_work BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Only one profile row should exist
ALTER TABLE profile ADD CONSTRAINT single_profile CHECK (id IS NOT NULL);
```

### 3.2 — Skills Table

```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,          -- e.g. 'Frontend', 'Backend', 'AI/ML', 'DevOps', 'Tools'
  proficiency INTEGER DEFAULT 80 CHECK (proficiency BETWEEN 0 AND 100),
  icon_url TEXT,                   -- URL to skill icon (Supabase Storage or external)
  color TEXT,                      -- Hex or CSS gradient string for fallback display
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_skills_order ON skills(order_index);
```

### 3.3 — Experience Table

```sql
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,                   -- NULL if is_current = true
  is_current BOOLEAN DEFAULT false,
  company_logo_url TEXT,
  company_url TEXT,
  location TEXT,
  skills_used TEXT[],              -- array of skill/technology names
  order_index INTEGER DEFAULT 0
);

CREATE INDEX idx_experience_order ON experience(order_index DESC);
```

### 3.4 — Projects Table

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  image_url TEXT,
  project_url TEXT,
  github_url TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_projects_active ON projects(is_active);
CREATE INDEX idx_projects_order ON projects(order_index);
```

### 3.5 — Testimonials Table

```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  avatar_url TEXT,
  feedback TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);
```

### 3.6 — Photography Table

```sql
CREATE TABLE photography (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,                   -- e.g. 'Portrait', 'Landscape', 'Wildlife', 'Street', 'Macro'
  taken_at DATE,
  is_featured BOOLEAN DEFAULT false,  -- featured photos render larger in the grid
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

CREATE INDEX idx_photography_category ON photography(category);
```

### 3.7 — Contact Messages Table

```sql
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_read ON contact_messages(is_read);
CREATE INDEX idx_contact_created ON contact_messages(created_at DESC);
```

### 3.8 — Visitors Table

```sql
CREATE TABLE visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT DEFAULT '/',
  user_agent TEXT,
  referrer TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visitors_date ON visitors(visited_at DESC);
```

### 3.9 — Visitor Stats View

```sql
CREATE OR REPLACE VIEW visitor_stats AS
SELECT
  COUNT(*)                                                  AS total_visits,
  COUNT(DISTINCT DATE_TRUNC('day', visited_at))             AS unique_days,
  MIN(visited_at)                                           AS first_visit,
  MAX(visited_at)                                           AS last_visit,
  COUNT(*) FILTER (WHERE visited_at > NOW() - INTERVAL '7 days')  AS visits_last_7_days,
  COUNT(*) FILTER (WHERE visited_at > NOW() - INTERVAL '30 days') AS visits_last_30_days
FROM visitors;
```

---

## 4. Row Level Security (RLS)

Enable RLS and add policies so **anyone can read** portfolio data, but **only service role can write**.

```sql
-- Enable RLS on all tables
ALTER TABLE profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills           ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience       ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE photography      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors         ENABLE ROW LEVEL SECURITY;

-- Public read access for portfolio display tables
CREATE POLICY "Public read profile"       ON profile          FOR SELECT USING (true);
CREATE POLICY "Public read skills"        ON skills           FOR SELECT USING (true);
CREATE POLICY "Public read experience"    ON experience       FOR SELECT USING (true);
CREATE POLICY "Public read projects"      ON projects         FOR SELECT USING (true);
CREATE POLICY "Public read testimonials"  ON testimonials     FOR SELECT USING (true);
CREATE POLICY "Public read photography"   ON photography      FOR SELECT USING (true);

-- Visitors: anyone can insert (tracked per page visit), public read for count
CREATE POLICY "Public insert visitors"    ON visitors         FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read visitors"      ON visitors         FOR SELECT USING (true);

-- Contact messages: anyone can insert (contact form), no public read
CREATE POLICY "Public insert contact"     ON contact_messages FOR INSERT WITH CHECK (true);
```

---

## 5. Seed Initial Profile Data

```sql
INSERT INTO profile (name, title, bio, email, location, github_url, linkedin_url, instagram_url, available_for_work)
VALUES (
  'Raviganesh M',
  'Developer · AI Engineer · SAP Labs',
  'Passionate developer at SAP Labs with a relentless drive to explore the frontiers of AI and emerging technology. I transform complex challenges into elegant, production-ready solutions — from intelligent AI-powered applications to scalable enterprise systems. Always learning, always shipping, always pushing the boundaries of what''s possible.',
  'your-email@example.com',
  'Bengaluru, India',
  'https://github.com/your-github',
  'https://linkedin.com/in/your-linkedin',
  'https://instagram.com/rg_clicks_',
  true
);
```

---

## 6. Example Seed Data

### Skills

```sql
INSERT INTO skills (name, category, proficiency, order_index) VALUES
  ('React',       'Frontend', 90, 1),
  ('Next.js',     'Frontend', 88, 2),
  ('TypeScript',  'Frontend', 85, 3),
  ('Tailwind CSS','Frontend', 90, 4),
  ('Node.js',     'Backend',  85, 5),
  ('Python',      'Backend',  80, 6),
  ('PostgreSQL',  'Backend',  78, 7),
  ('Supabase',    'Backend',  82, 8),
  ('LangChain',   'AI/ML',    80, 9),
  ('OpenAI API',  'AI/ML',    85, 10),
  ('Docker',      'DevOps',   75, 11),
  ('Git',         'Tools',    92, 12);
```

### Experience

```sql
INSERT INTO experience (company, role, description, start_date, is_current, location, skills_used, order_index)
VALUES (
  'SAP Labs',
  'Developer',
  'Building enterprise-grade applications and AI-powered solutions at one of the world''s leading technology companies. Working on full-stack features, AI integrations, and scalable backend services.',
  '2020-01-01',
  true,
  'Bengaluru, India',
  ARRAY['React', 'Node.js', 'TypeScript', 'Python', 'AI/ML'],
  1
);
```

---

## 7. Storage Buckets (for Images)

In **Storage → Create Bucket**:

| Bucket Name | Public | Usage |
|---|---|---|
| `avatars` | ✅ Yes | Profile + testimonial avatars |
| `projects` | ✅ Yes | Project screenshots |
| `photography` | ✅ Yes | RG Clicks photos |
| `company-logos` | ✅ Yes | Experience company logos |
| `skill-icons` | ✅ Yes | Skill technology icons |

For each public bucket, set the **Storage Policy** to allow public reads:

```sql
-- Example for 'avatars' bucket (repeat for each public bucket)
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

Image URL format after upload:
```
https://your-project-id.supabase.co/storage/v1/object/public/bucket-name/filename.png
```

---

## 8. Viewing Visitor Stats

To check your visitor count from the Supabase dashboard:

```sql
-- Total visitor count
SELECT COUNT(*) FROM visitors;

-- Full stats summary
SELECT * FROM visitor_stats;

-- Visitors by day (last 30 days)
SELECT DATE_TRUNC('day', visited_at) AS day, COUNT(*) AS visits
FROM visitors
WHERE visited_at > NOW() - INTERVAL '30 days'
GROUP BY day
ORDER BY day DESC;

-- Unread contact messages
SELECT * FROM contact_messages WHERE is_read = false ORDER BY created_at DESC;
```

---

## 9. Vercel Deployment

1. Push to GitHub.
2. Import repo in [vercel.com](https://vercel.com).
3. Add all env variables from `.env.example` in **Project Settings → Environment Variables**.
4. Deploy — Vercel auto-detects Next.js.

Add your Vercel URL to Supabase **Authentication → URL Configuration → Site URL**.

# Supabase Setup — Personal Portfolio

Paste **Block 1** first (schema), then **Block 2** (seed data) into the Supabase SQL Editor.

---

## Block 1 — Schema (tables, indexes, view, RLS)

```sql
-- =============================================
-- TABLES
-- =============================================

CREATE TABLE profile (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT        NOT NULL,
  title             TEXT        NOT NULL,
  bio               TEXT        NOT NULL,
  avatar_url        TEXT,
  resume_url        TEXT,
  github_url        TEXT,
  linkedin_url      TEXT,
  twitter_url       TEXT,
  instagram_url     TEXT,
  email             TEXT,
  location          TEXT,
  available_for_work BOOLEAN    DEFAULT true,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE skills (
  id           UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT     NOT NULL,
  category     TEXT     NOT NULL,
  proficiency  INTEGER  DEFAULT 80 CHECK (proficiency BETWEEN 0 AND 100),
  icon_url     TEXT,
  color        TEXT,
  order_index  INTEGER  DEFAULT 0,
  is_active    BOOLEAN  DEFAULT true
);

CREATE TABLE experience (
  id               UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  company          TEXT     NOT NULL,
  role             TEXT     NOT NULL,
  description      TEXT,
  start_date       DATE     NOT NULL,
  end_date         DATE,
  is_current       BOOLEAN  DEFAULT false,
  company_logo_url TEXT,
  company_url      TEXT,
  location         TEXT,
  skills_used      TEXT[],
  sub_roles        JSONB    DEFAULT '[]',
  order_index      INTEGER  DEFAULT 0
);

CREATE TABLE projects (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT        NOT NULL,
  description      TEXT        NOT NULL,
  long_description TEXT,
  image_url        TEXT,
  project_url      TEXT,
  github_url       TEXT,
  tags             TEXT[]      DEFAULT '{}',
  is_featured      BOOLEAN     DEFAULT false,
  order_index      INTEGER     DEFAULT 0,
  is_active        BOOLEAN     DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE testimonials (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT    NOT NULL,
  role        TEXT    NOT NULL,
  company     TEXT    NOT NULL,
  avatar_url  TEXT,
  feedback    TEXT    NOT NULL,
  rating      INTEGER DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_active   BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE photography (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT    NOT NULL,
  description TEXT,
  image_url   TEXT    NOT NULL,
  category    TEXT,
  taken_at    DATE,
  is_featured BOOLEAN DEFAULT false,
  is_active   BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE contact_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT,
  message    TEXT        NOT NULL,
  is_read    BOOLEAN     DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE visitors (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  page       TEXT        DEFAULT '/',
  user_agent TEXT,
  referrer   TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX idx_skills_category      ON skills(category);
CREATE INDEX idx_skills_order         ON skills(order_index);
CREATE INDEX idx_experience_order     ON experience(order_index);
CREATE INDEX idx_projects_active      ON projects(is_active);
CREATE INDEX idx_projects_order       ON projects(order_index);
CREATE INDEX idx_photography_category ON photography(category);
CREATE INDEX idx_contact_read         ON contact_messages(is_read);
CREATE INDEX idx_contact_created      ON contact_messages(created_at DESC);
CREATE INDEX idx_visitors_date        ON visitors(visited_at DESC);

-- =============================================
-- VISITOR STATS VIEW
-- =============================================

CREATE OR REPLACE VIEW visitor_stats AS
SELECT
  COUNT(*)                                                              AS total_visits,
  COUNT(DISTINCT DATE_TRUNC('day', visited_at))                         AS unique_days,
  MIN(visited_at)                                                       AS first_visit,
  MAX(visited_at)                                                       AS last_visit,
  COUNT(*) FILTER (WHERE visited_at > NOW() - INTERVAL '7 days')       AS visits_last_7_days,
  COUNT(*) FILTER (WHERE visited_at > NOW() - INTERVAL '30 days')      AS visits_last_30_days
FROM visitors;

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

ALTER TABLE profile          ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills           ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience       ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects         ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials     ENABLE ROW LEVEL SECURITY;
ALTER TABLE photography      ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors         ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read profile"      ON profile          FOR SELECT USING (true);
CREATE POLICY "Public read skills"       ON skills           FOR SELECT USING (true);
CREATE POLICY "Public read experience"   ON experience       FOR SELECT USING (true);
CREATE POLICY "Public read projects"     ON projects         FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials     FOR SELECT USING (true);
CREATE POLICY "Public read photography"  ON photography      FOR SELECT USING (true);
CREATE POLICY "Public insert visitors"   ON visitors         FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read visitors"     ON visitors         FOR SELECT USING (true);
CREATE POLICY "Public insert contact"    ON contact_messages FOR INSERT WITH CHECK (true);
```

---

## Block 2 — Seed Data

> Update the `TODO` placeholders before running.

```sql
-- =============================================
-- PROFILE
-- =============================================

INSERT INTO profile (
  name, title, bio,
  email, location,
  github_url, linkedin_url, instagram_url,
  available_for_work
) VALUES (
  'Raviganesh M',
  'Developer · AI Engineer · SAP Labs',
  'Passionate developer at SAP Labs with a relentless drive to explore the frontiers of AI and emerging technology. I transform complex challenges into elegant, production-ready solutions — from intelligent AI-powered applications to scalable enterprise systems. Always learning, always shipping, always pushing the boundaries of what''s possible.',
  'TODO: your-email@example.com',
  'Bengaluru, India',
  'TODO: https://github.com/your-handle',
  'TODO: https://linkedin.com/in/your-handle',
  'https://instagram.com/rg_clicks_',
  true
);

-- =============================================
-- SKILLS
-- =============================================

INSERT INTO skills (name, category, proficiency, order_index) VALUES
  ('React',        'Frontend', 90,  1),
  ('Next.js',      'Frontend', 88,  2),
  ('TypeScript',   'Frontend', 85,  3),
  ('Tailwind CSS', 'Frontend', 90,  4),
  ('SAPUI5',       'Frontend', 82,  5),
  ('Node.js',      'Backend',  85,  6),
  ('Python',       'Backend',  80,  7),
  ('PostgreSQL',   'Backend',  78,  8),
  ('Supabase',     'Backend',  82,  9),
  ('LangChain',    'AI/ML',    80, 10),
  ('OpenAI API',   'AI/ML',    85, 11),
  ('Docker',       'DevOps',   75, 12),
  ('Git',          'Tools',    92, 13),
  ('Grafana',      'Tools',    80, 14);

-- =============================================
-- EXPERIENCE
-- Columns follow CREATE TABLE order:
-- company, role, description,
-- start_date, end_date, is_current,
-- company_logo_url, company_url, location,
-- skills_used, sub_roles, order_index
-- =============================================

INSERT INTO experience (
  company, role, description,
  start_date, end_date, is_current,
  company_logo_url, company_url, location,
  skills_used, sub_roles, order_index
) VALUES

-- 1. SAP Labs India — Current (with promotion: Associate Dev → Developer)
(
  'SAP Labs India',
  'Developer',
  NULL,
  '2024-11-01', NULL, true,
  'https://logo.clearbit.com/sap.com',
  'https://www.sap.com',
  'Bengaluru, Karnataka',
  NULL,
  '[
    {
      "title": "Developer",
      "description": "TODO: Add your Developer role description here.",
      "start_date": "2026-03-01",
      "end_date": null,
      "is_current": true,
      "skills_used": ["TODO: Add your skills"]
    },
    {
      "title": "Associate Developer",
      "description": "TODO: Add your Associate Developer role description here.",
      "start_date": "2024-11-01",
      "end_date": "2026-02-28",
      "is_current": false,
      "skills_used": ["TODO: Add your skills"]
    }
  ]',
  1
),

-- 2. VuNet Systems
(
  'VuNet Systems',
  'Developer',
  'Spearheaded development of multiple Grafana panel plugin visualizations using ReactJS and TypeScript, including a Unified Transaction Map (UTM), Matrix visualizations, and Insights modules. Contributed to VuBlocks — streamlining agent installation, monitoring, and data extraction in customer environments.',
  '2022-08-01', '2024-10-31', false,
  'https://logo.clearbit.com/vunet.in',
  'https://vunet.in',
  'Bengaluru, Karnataka',
  ARRAY['JavaScript', 'TypeScript', 'ReactJS', 'Grafana'],
  '[]',
  2
),

-- 3. SAP Labs India — Scholar@SAP (two project teams)
(
  'SAP Labs India',
  'Scholar@SAP',
  NULL,
  '2020-08-01', '2022-07-31', false,
  'https://logo.clearbit.com/sap.com',
  'https://www.sap.com',
  'Bengaluru, Karnataka',
  NULL,
  '[
    {
      "title": "Next Gen Cloud Native Payrolls",
      "description": "Built responsive web pages for the Attendance Valuation application following the MVC Design Pattern of SAPUI5 (JavaScript), enabling caching to increase loading speed by 3 seconds. Optimised the web app load time from 8s to 4s by improving OData calls and async-loading non-critical scripts. Built the Attendance Valuation UI using ReactJS. Received Star Player appreciation for end-to-end ownership of UI tasks.",
      "start_date": "2021-09-01",
      "end_date": "2022-07-31",
      "is_current": false,
      "skills_used": ["SAPUI5", "JavaScript", "ReactJS", "OData"]
    },
    {
      "title": "Digital Manufacturing Cloud",
      "description": "Built the Machine Connectivity detail page using ReactJS, increasing user interaction by 4%. Developed RESTful APIs for PCo web servers using Node.js. Wrote integration tests with OPA, improving coverage from 76% to 87% and passing SonarQube quality gates. Addressed Design Gate changes to bring the app to 100% Fiori Guidelines compliance.",
      "start_date": "2020-08-01",
      "end_date": "2021-08-31",
      "is_current": false,
      "skills_used": ["ReactJS", "Node.js", "OPA", "SAPUI5", "Fiori"]
    }
  ]',
  3
);
```

---

## What to do after running Block 2

1. Replace all `TODO` values in profile and the current SAP sub_roles with real content.
2. Create Storage buckets in **Storage → New Bucket** (all Public): `avatars`, `projects`, `photography`, `company-logos`, `skill-icons`.
3. Add projects, testimonials, and photography rows when ready.

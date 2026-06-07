export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string | null;
  resume_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  email: string | null;
  location: string | null;
  available_for_work: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  icon_url: string | null;
  color: string | null;
  order_index: number;
  is_active: boolean;
}

export interface SubRole {
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  is_current?: boolean;
  skills_used: string[];
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  company_logo_url: string | null;
  company_url: string | null;
  location: string | null;
  skills_used: string[] | null;
  sub_roles: SubRole[] | null;
  order_index: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  image_url: string | null;
  project_url: string | null;
  github_url: string | null;
  tags: string[];
  is_featured: boolean;
  order_index: number;
  is_active: boolean;
  created_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar_url: string | null;
  feedback: string;
  rating: number;
  is_active: boolean;
  order_index: number;
}

export interface Photo {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  taken_at: string | null;
  is_featured: boolean;
  is_active: boolean;
  order_index: number;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string | null;
  message: string;
}

export interface VisitorStats {
  total_visits: number;
  unique_days: number;
  first_visit: string;
  last_visit: string;
}

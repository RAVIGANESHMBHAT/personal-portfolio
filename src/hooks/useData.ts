"use client";

import { useState, useEffect } from "react";
import { getSupabase } from "@/lib/supabase";
import type { Profile, Skill, ExperienceItem, Project, Testimonial, Photo } from "@/types";

export function useProfile() {
  const [data, setData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .from("profile")
      .select("*")
      .single()
      .then(({ data: result, error: err }) => {
        if (err) setError(err.message);
        else setData(result);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useSkills() {
  const [data, setData] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .from("skills")
      .select("*")
      .eq("is_active", true)
      .order("order_index")
      .then(({ data: result, error: err }) => {
        if (err) setError(err.message);
        else setData(result || []);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useExperience() {
  const [data, setData] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .from("experience")
      .select("*")
      .order("start_date", { ascending: false })
      .then(({ data: result, error: err }) => {
        if (err) setError(err.message);
        else setData(result || []);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useProjects() {
  const [data, setData] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .from("projects")
      .select("*")
      .eq("is_active", true)
      .order("order_index")
      .then(({ data: result, error: err }) => {
        if (err) setError(err.message);
        else setData(result || []);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useTestimonials() {
  const [data, setData] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("order_index")
      .then(({ data: result, error: err }) => {
        if (err) setError(err.message);
        else setData(result || []);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function usePhotography() {
  const [data, setData] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSupabase()
      .from("photography")
      .select("*")
      .eq("is_active", true)
      .order("order_index")
      .then(({ data: result, error: err }) => {
        if (err) setError(err.message);
        else setData(result || []);
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}

export function useVisitorCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/visitors")
      .then((r) => r.json())
      .then((d) => setCount(d.count ?? 0))
      .catch(() => setCount(null));
  }, []);

  return count;
}

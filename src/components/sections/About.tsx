"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Briefcase, Brain, Coffee, Code2, Zap } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import {
  StaggerContainer,
  staggerItem,
} from "@/components/shared/AnimatedSection";
import { useProfile, useExperience, useProjects } from "@/hooks/useData";

const ABOUT_CARDS = [
  {
    icon: Code2,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    title: "Who I Am",
    description:
      "A passionate developer at SAP Labs who thrives at the intersection of software engineering and human experience. I write clean, purposeful code that solves real problems.",
  },
  {
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-500/10",
    title: "What I Build",
    description:
      "Full-stack applications, AI-powered tools, and enterprise solutions. I bring ideas from whiteboard to production — fast, reliable, and scalable.",
  },
  {
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    title: "What I Explore",
    description:
      "Generative AI, LLMs, agentic systems, and emerging tech. I love finding the next useful use case where AI can create genuine value.",
  },
];

const AI_TAGS = new Set([
  "ai",
  "ml",
  "llm",
  "genai",
  "machine learning",
  "deep learning",
  "nlp",
  "gpt",
  "openai",
  "langchain",
]);

export function About() {
  const { data: profile } = useProfile();
  const { data: experience } = useExperience();
  const { data: projects } = useProjects();

  const stats = useMemo(() => {
    const yearsExp = (() => {
      if (!experience.length) return "5+";
      const earliest = experience.reduce(
        (min, e) => Math.min(min, new Date(e.start_date).getTime()),
        new Date(experience[0].start_date).getTime(),
      );
      const years = Math.floor(
        (Date.now() - earliest) / (1000 * 60 * 60 * 24 * 365),
      );
      return `${years}+`;
    })();

    const projectCount = projects.length ? `${projects.length}+` : "-";

    const aiCount = projects.filter((p) =>
      p.tags?.some((t) => AI_TAGS.has(t.toLowerCase())),
    ).length;

    return [
      { icon: Briefcase, label: "Years Experience", value: yearsExp },
      { icon: Code2, label: "Projects Built", value: projectCount },
      {
        icon: Brain,
        label: "AI Solutions",
        value: aiCount ? `${aiCount}+` : "-",
      },
      { icon: Coffee, label: "Cups of Coffee", value: "∞" },
    ];
  }, [experience, projects]);

  const location = profile?.location ?? "Bengaluru, India";
  const currentJob = experience.find((e) => e.is_current);
  const currentCompany = currentJob?.company ?? "SAP Labs India";
  const isAvailable = profile?.available_for_work ?? true;

  return (
    <section id="about" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-[#0D0D16] dark:via-[#0A0A0F] dark:to-[#0D0D16]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="About Me"
          title="The Story Behind the Code"
          subtitle="I'm not just writing code — I'm crafting solutions that make a difference. Here's a little about who I am and what drives me."
        />

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {ABOUT_CARDS.map(({ icon: Icon, color, bg, title, description }) => (
            <motion.div key={title} variants={staggerItem}>
              <GlassCard hover glow className="h-full">
                <div
                  className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-5`}
                >
                  <Icon size={22} className={color} />
                </div>
                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-3">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <motion.div variants={staggerItem} className="space-y-4">
            <GlassCard hover={false} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin
                  size={18}
                  className="text-amber-600 dark:text-amber-400"
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  Location
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {location}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Working at {currentCompany}
                </p>
              </div>
            </GlassCard>

            <GlassCard hover={false} className="flex items-start gap-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isAvailable ? "bg-green-50 dark:bg-green-500/10" : "bg-gray-50 dark:bg-white/5"}`}
              >
                <Briefcase
                  size={18}
                  className={
                    isAvailable
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-400"
                  }
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                  Status
                </p>
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${isAvailable ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
                  />
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {isAvailable
                      ? "Open to new opportunities"
                      : "Not looking right now"}
                  </p>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Exploring senior developer roles
                </p>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={staggerItem}>
            <GlassCard hover={false} className="h-full">
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                My Philosophy
              </p>
              <blockquote className="text-gray-700 dark:text-gray-300 text-base leading-relaxed italic border-l-2 border-amber-400 pl-4">
                &ldquo;Technology is not just a tool — it&apos;s a language for
                shaping the future. I believe in writing that language with
                clarity, curiosity, and a relentless hunger to push what&apos;s
                possible.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-amber-600 dark:text-amber-400 font-semibold">
                — {profile?.name ?? "Raviganesh M"}
              </p>
            </GlassCard>
          </motion.div>
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <motion.div key={label} variants={staggerItem}>
              <GlassCard hover glow className="text-center">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
                  <Icon
                    size={18}
                    className="text-amber-600 dark:text-amber-400"
                  />
                </div>
                <p className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {label}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

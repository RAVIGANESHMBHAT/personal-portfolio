"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Star } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, staggerItem } from "@/components/shared/AnimatedSection";
import { SkeletonCard } from "@/components/shared/Skeleton";
import { useProjects } from "@/hooks/useData";

export function Projects() {
  const { data: projects, loading } = useProjects();
  const [activeTag, setActiveTag] = useState("All");

  const allTags = ["All", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];
  const filtered =
    activeTag === "All" ? projects : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <section id="projects" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-amber-50/20 to-white dark:from-[#0A0A0F] dark:via-[#0D0D16] dark:to-[#0A0A0F]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Projects"
          title="Things I've Built"
          subtitle="A curated selection of projects that showcase my craft — from AI experiments to full-stack products."
        />

        {/* Tag filter */}
        {!loading && allTags.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {allTags.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setActiveTag(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  activeTag === tag
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : "border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400"
                }`}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <motion.div
                  key={project.id}
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <GlassCard hover glow padding="none" className="overflow-hidden h-full flex flex-col group">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {project.image_url ? (
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 flex items-center justify-center">
                          <span className="font-display text-4xl font-bold text-amber-300 dark:text-amber-700">
                            {project.title[0]}
                          </span>
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 gap-3">
                        {project.project_url && (
                          <a
                            href={project.project_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 text-gray-900 text-xs font-semibold hover:bg-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={13} />
                            Live Demo
                          </a>
                        )}
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-semibold hover:bg-black transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={13} />
                            Code
                          </a>
                        )}
                      </div>

                      {/* Featured badge */}
                      {project.is_featured && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-lg">
                          <Star size={10} fill="white" />
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-display text-base font-bold text-gray-900 dark:text-white mb-2">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-1 mb-4">
                        {project.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20"
                          >
                            {tag}
                          </span>
                        ))}
                        {project.tags.length > 4 && (
                          <span className="text-[11px] text-gray-400 dark:text-gray-500 px-1">
                            +{project.tags.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </StaggerContainer>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">
            No projects with this tag.
          </p>
        )}
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { GlassCard } from "@/components/shared/GlassCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, staggerItem } from "@/components/shared/AnimatedSection";
import { SkeletonCard } from "@/components/shared/Skeleton";
import { useSkills } from "@/hooks/useData";

export function Skills() {
  const { data: skills, loading } = useSkills();
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(skills.map((s) => s.category)))];
  const filtered =
    activeCategory === "All" ? skills : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-amber-50/20 dark:from-[#0A0A0F] dark:via-[#0A0A0F] dark:to-[#0D0D16]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Skills"
          title="Tools of the Trade"
          subtitle="The technologies I wield to bring ideas to life — from the frontend canvas to backend infrastructure and AI pipelines."
        />

        {/* Category filter */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white border-transparent shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                    : "border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        )}

        {/* Skills grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((skill) => (
              <motion.div
                key={skill.id}
                variants={staggerItem}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard hover glow className="text-center p-4 group">
                  {/* Icon */}
                  <div className="relative w-12 h-12 mx-auto mb-3">
                    {skill.icon_url ? (
                      <Image
                        src={skill.icon_url}
                        alt={skill.name}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{
                          background:
                            skill.color ||
                            "linear-gradient(135deg, #F59E0B, #F97316)",
                        }}
                      >
                        {skill.name[0]}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-2 leading-tight">
                    {skill.name}
                  </p>

                  {/* Category pill */}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
                    {skill.category}
                  </span>

                  {/* Proficiency bar */}
                  <div className="mt-3 w-full bg-gray-100 dark:bg-white/5 rounded-full h-1 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.proficiency}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                    {skill.proficiency}%
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerContainer>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">
            No skills in this category yet.
          </p>
        )}
      </div>
    </section>
  );
}

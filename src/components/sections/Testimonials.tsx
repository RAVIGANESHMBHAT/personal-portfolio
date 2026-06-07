"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Skeleton } from "@/components/shared/Skeleton";
import { useTestimonials } from "@/hooks/useData";
import { getInitials } from "@/lib/utils";

export function Testimonials() {
  const { data: testimonials, loading } = useTestimonials();
  const [index, setIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, resetKey]);

  const prev = () => {
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
    setResetKey((k) => k + 1);
  };
  const next = () => {
    setIndex((i) => (i + 1) % testimonials.length);
    setResetKey((k) => k + 1);
  };
  const goTo = (i: number) => {
    setIndex(i);
    setResetKey((k) => k + 1);
  };

  return (
    <section id="testimonials" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-amber-50/20 to-white dark:from-[#0A0A0F] dark:via-[#0D0D16] dark:to-[#0A0A0F]" />

      {/* Decorative quote mark */}
      <div className="absolute left-1/2 top-20 -translate-x-1/2 text-amber-100 dark:text-amber-900/20 pointer-events-none select-none">
        <Quote size={200} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Testimonials"
          title="What People Say"
          subtitle="Kind words from colleagues, collaborators, and people I've had the privilege of working with."
        />

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full rounded-2xl" />
            <div className="flex justify-center gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="w-2 h-2 rounded-full" />
              ))}
            </div>
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">
            Testimonials coming soon.
          </p>
        ) : (
          <div className="relative">
            {/* Carousel */}
            <div className="overflow-hidden relative min-h-[280px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <AnimatedSection>
                    <GlassCard hover={false} glow className="text-center">
                      {/* Stars */}
                      <div className="flex justify-center gap-1 mb-5">
                        {Array.from({ length: testimonials[index].rating }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>

                      {/* Feedback */}
                      <blockquote className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed italic mb-6 max-w-2xl mx-auto">
                        &ldquo;{testimonials[index].feedback}&rdquo;
                      </blockquote>

                      {/* Author */}
                      <div className="flex items-center gap-3 justify-center">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400/40">
                          {testimonials[index].avatar_url ? (
                            <Image
                              src={testimonials[index].avatar_url!}
                              alt={testimonials[index].name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                              {getInitials(testimonials[index].name)}
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          <p className="font-display font-bold text-gray-900 dark:text-white">
                            {testimonials[index].name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonials[index].role} · {testimonials[index].company}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </AnimatedSection>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <motion.button
                  onClick={prev}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <ChevronLeft size={16} />
                </motion.button>

                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className="transition-all duration-300"
                    >
                      <motion.div
                        animate={{
                          width: i === index ? 24 : 8,
                          backgroundColor: i === index ? "#F59E0B" : "#D1D5DB",
                        }}
                        className="h-2 rounded-full"
                      />
                    </button>
                  ))}
                </div>

                <motion.button
                  onClick={next}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-9 h-9 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-amber-400/50 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <ChevronRight size={16} />
                </motion.button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

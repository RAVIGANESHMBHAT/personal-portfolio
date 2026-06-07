"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StaggerContainer, staggerItem } from "@/components/shared/AnimatedSection";
import { SkeletonCard } from "@/components/shared/Skeleton";
import { usePhotography } from "@/hooks/useData";
import type { Photo } from "@/types";

function Lightbox({
  photos,
  initialIndex,
  onClose,
}: {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const photo = photos[index];

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
          <Image
            src={photo.image_url}
            alt={photo.title}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>

        {/* Info */}
        <div className="mt-4 text-center">
          <p className="text-white font-semibold">{photo.title}</p>
          {photo.description && (
            <p className="text-gray-400 text-sm mt-1">{photo.description}</p>
          )}
          {photo.category && (
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30">
              {photo.category}
            </span>
          )}
        </div>

        {/* Controls */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <X size={18} />
        </button>

        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-16 right-3 text-white/60 text-xs">
          {index + 1} / {photos.length}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Photography() {
  const { data: photos, loading } = usePhotography();
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["All", ...Array.from(new Set(photos.map((p) => p.category).filter(Boolean)))];
  const filtered =
    activeCategory === "All" ? photos : photos.filter((p) => p.category === activeCategory);

  return (
    <section id="photography" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-amber-50/10 to-white dark:from-[#0A0A0F] dark:via-[#0A0A0F] dark:to-[#0A0A0F]" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="RG Clicks"
          title={
            <>
              Through My Lens{" "}
              <Camera className="inline-block text-amber-500 mb-1" size={32} />
            </>
          }
          subtitle="Beyond the code, I find stillness behind a camera. These are moments I've captured — frames that tell stories words cannot."
        />

        {/* Category filter */}
        {!loading && categories.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat) => (
              <motion.button
                key={cat as string}
                onClick={() => setActiveCategory(cat as string)}
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

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filtered.map((photo, idx) => (
              <motion.div
                key={photo.id}
                variants={staggerItem}
                layout
                className={photo.is_featured ? "col-span-2 row-span-2" : ""}
              >
                <GlassCard
                  hover={false}
                  padding="none"
                  className="overflow-hidden cursor-pointer group"
                  onClick={() => setLightboxIndex(idx)}
                >
                  <div
                    className={`relative overflow-hidden ${
                      photo.is_featured ? "aspect-square" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={photo.image_url}
                      alt={photo.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                      <ZoomIn size={24} className="text-white" />
                      <p className="text-white text-xs font-semibold text-center px-3">
                        {photo.title}
                      </p>
                      {photo.category && (
                        <span className="text-amber-400 text-[10px] bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                          {photo.category}
                        </span>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </StaggerContainer>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">
            Photos coming soon — stay tuned.
          </p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={filtered}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

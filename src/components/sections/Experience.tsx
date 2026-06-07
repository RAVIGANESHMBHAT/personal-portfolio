"use client";

import { useState } from "react";
import { MapPin, ExternalLink, ChevronRight, ArrowUp } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Skeleton } from "@/components/shared/Skeleton";
import { useExperience } from "@/hooks/useData";
import { formatDateRange, formatDateExact, formatDuration } from "@/lib/utils";
import type { SubRole } from "@/types";

function DateBadge({
  start,
  end,
  isCurrent,
}: Readonly<{ start: string; end: string | null; isCurrent: boolean }>) {
  const exact = isCurrent
    ? `${formatDateExact(start)} — Present`
    : `${formatDateExact(start)}${end ? ` — ${formatDateExact(end)}` : ""}`;
  const duration = formatDuration(start, end, isCurrent);

  return (
    <div className="relative group flex-shrink-0">
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-3 py-1 rounded-full border border-black/5 dark:border-white/5 cursor-default">
        {formatDateRange(start, end, isCurrent)}
      </span>
      <div className="absolute bottom-full right-0 mb-2 z-50 hidden group-hover:flex flex-col items-end gap-0.5 pointer-events-none">
        <div className="bg-gray-900 dark:bg-gray-800 text-white text-[11px] font-medium px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
          {exact}
        </div>
        <div className="bg-amber-500 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap">
          {duration}
        </div>
      </div>
    </div>
  );
}

function CompanyLogo({ url, company }: Readonly<{ url: string; company: string }>) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
        {company.slice(0, 2).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={company}
      className="w-full h-full object-contain p-1"
      onError={() => setFailed(true)}
    />
  );
}

function SubRoleCard({ sub, isLast }: Readonly<{ sub: SubRole; isLast: boolean }>) {
  return (
    <div className={`relative pl-4 ${isLast ? "" : "pb-2 border-l border-dashed border-amber-400/30 dark:border-amber-500/20"}`}>
      <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-amber-400/40 dark:bg-amber-500/30 border-2 border-amber-400 dark:border-amber-500" />
      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <ChevronRight size={14} className="text-amber-500 flex-shrink-0" />
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{sub.title}</span>
          {sub.is_current && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-semibold">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" /><span>Current</span>
            </span>
          )}
        </div>
        <DateBadge start={sub.start_date} end={sub.end_date} isCurrent={sub.is_current ?? false} />
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
        {sub.description}
      </p>
      {sub.skills_used?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {sub.skills_used.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
      {/* Promoted indicator between this role and the one below it */}
      {sub.is_current && !isLast && (
        <div className="flex items-center gap-2 mt-4 mb-1">
          <div className="h-px flex-1 bg-amber-400/20 dark:bg-amber-500/15" />
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-300/40 dark:border-amber-500/30 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">
            <ArrowUp size={10} />
            Promoted
          </span>
          <div className="h-px flex-1 bg-amber-400/20 dark:bg-amber-500/15" />
        </div>
      )}
    </div>
  );
}

const SKELETON_ITEMS = ["a", "b", "c"] as const;

export function Experience() {
  const { data: experience, loading } = useExperience();

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50/20 via-white to-white dark:from-[#0D0D16] dark:via-[#0A0A0F] dark:to-[#0A0A0F]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Experience"
          title="My Professional Journey"
          subtitle="A timeline of the roles, companies, and challenges that have shaped who I am as an engineer."
        />

        {loading ? (
          <div className="space-y-6">
            {SKELETON_ITEMS.map((key) => (
              <div key={key} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
                  <Skeleton className="w-0.5 flex-1 mt-3" />
                </div>
                <div className="flex-1 pb-8 space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/60 via-amber-400/30 to-transparent dark:from-amber-500/40 dark:via-amber-500/20 dark:to-transparent" />

            <div className="space-y-8">
              {experience.map((item, index) => (
                <AnimatedSection key={item.id} delay={index * 0.1} direction="left">
                  <div className="flex gap-6">
                    {/* Timeline dot + logo */}
                    <div className="relative flex-shrink-0 flex flex-col items-center">
                      <div className="relative z-10 w-12 h-12 rounded-xl overflow-hidden bg-white dark:bg-[#1A1A2E] border-2 border-amber-400/40 dark:border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] flex items-center justify-center">
                        {item.company_logo_url ? (
                          <CompanyLogo url={item.company_logo_url} company={item.company} />
                        ) : (
                          <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                            {item.company.slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-8">
                      <GlassCard hover glow>
                        {/* Header */}
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                                {item.role}
                              </h3>
                              {item.is_current && (!item.sub_roles || item.sub_roles.length === 0) && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-[10px] font-semibold">
                                  <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                  Current
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {item.company_url ? (
                                <a
                                  href={item.company_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-sm hover:underline"
                                >
                                  {item.company}
                                  <ExternalLink size={12} />
                                </a>
                              ) : (
                                <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">
                                  {item.company}
                                </span>
                              )}
                              {item.location && (
                                <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                                  <MapPin size={11} />
                                  {item.location}
                                </span>
                              )}
                            </div>
                          </div>
                          <DateBadge start={item.start_date} end={item.end_date} isCurrent={item.is_current} />
                        </div>

                        {item.sub_roles && item.sub_roles.length > 0 ? (
                          <div className="mt-4 space-y-3">
                            {item.sub_roles.map((sub, i) => (
                              <SubRoleCard
                                key={sub.title}
                                sub={sub}
                                isLast={i === item.sub_roles!.length - 1}
                              />
                            ))}
                          </div>
                        ) : (
                          <>
                            {item.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4">
                                {item.description}
                              </p>
                            )}
                            {item.skills_used && item.skills_used.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {item.skills_used.map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                          </>
                        )}
                      </GlassCard>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {!loading && experience.length === 0 && (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">
            Experience coming soon.
          </p>
        )}
      </div>
    </section>
  );
}

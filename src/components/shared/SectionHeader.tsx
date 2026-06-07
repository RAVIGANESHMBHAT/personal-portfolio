import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AnimatedSection } from "./AnimatedSection";

interface SectionHeaderProps {
  tag?: string;
  title: ReactNode;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export function SectionHeader({
  tag,
  title,
  subtitle,
  className,
  align = "center",
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 md:mb-16",
        align === "center" ? "text-center" : "text-left",
        className
      )}
    >
      {tag && (
        <AnimatedSection delay={0}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {tag}
          </span>
        </AnimatedSection>
      )}
      <AnimatedSection delay={0.1}>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
          {title}
        </h2>
      </AnimatedSection>
      {subtitle && (
        <AnimatedSection delay={0.2}>
          <p className="mt-4 text-base md:text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed mx-auto">
            {subtitle}
          </p>
        </AnimatedSection>
      )}
      <AnimatedSection delay={0.25}>
        <div
          className={cn(
            "mt-5 h-1 w-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500",
            align === "center" ? "mx-auto" : ""
          )}
        />
      </AnimatedSection>
    </div>
  );
}

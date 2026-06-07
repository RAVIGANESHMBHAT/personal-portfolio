import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function GlassCard({
  children,
  className,
  hover = true,
  glow = false,
  padding = "md",
  ...rest
}: GlassCardProps) {
  return (
    <div {...rest}
      className={cn(
        "rounded-2xl border",
        "bg-white/60 dark:bg-white/[0.04]",
        "border-black/[0.06] dark:border-white/[0.07]",
        "backdrop-blur-xl",
        hover &&
          "transition-all duration-300 hover:bg-white/80 dark:hover:bg-white/[0.07] hover:border-black/10 dark:hover:border-amber-500/20 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl",
        glow &&
          "hover:shadow-[0_8px_40px_rgba(245,158,11,0.12)] dark:hover:shadow-[0_8px_40px_rgba(245,158,11,0.18)]",
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

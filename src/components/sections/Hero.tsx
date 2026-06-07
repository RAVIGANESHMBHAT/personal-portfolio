"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Download, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useData";

const ROLES = [
  "Full Stack Developer",
  "AI Engineer",
  "Tech Innovator",
  "Developer @ SAP Labs",
];

function IconGithub() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

const SOCIAL_ICONS = [
  { icon: IconGithub, key: "github_url" as const, label: "GitHub" },
  { icon: IconLinkedin, key: "linkedin_url" as const, label: "LinkedIn" },
  { icon: IconInstagram, key: "instagram_url" as const, label: "Instagram" },
];

function TypewriterRole() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = ROLES[index];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(
        () => setDisplayed(target.slice(0, displayed.length + 1)),
        80,
      );
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % ROLES.length);
    }

    return () => clearTimeout(timeout);
  }, [displayed, deleting, index]);

  return (
    <span className="text-amber-500 dark:text-amber-400">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-0.5 h-[1em] bg-amber-500 dark:bg-amber-400 ml-0.5 align-middle"
      />
    </span>
  );
}

function FloatingOrb({
  className,
  delay = 0,
}: Readonly<{ className?: string; delay?: number }>) {
  return (
    <motion.div
      animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
      transition={{
        duration: 6 + delay,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
  );
}

export function Hero() {
  const { data: profile } = useProfile();
  const scrollIndicatorRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = document.getElementById("home");
    if (!section) return;
    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      if (glowRef.current) {
        glowRef.current.style.opacity = "1";
        glowRef.current.style.background = `radial-gradient(500px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(245,158,11,0.13), transparent 55%)`;
      }
    };
    const onLeave = () => {
      if (glowRef.current) glowRef.current.style.opacity = "0";
    };
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => {
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const bio =
    profile?.bio ||
    "Passionate developer at SAP Labs with a relentless drive to explore the frontiers of AI and emerging technology. I transform complex challenges into elegant, production-ready solutions — from intelligent AI-powered applications to scalable enterprise systems.";

  const handleScrollDown = () => {
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-white to-orange-50/40 dark:from-[#0A0A0F] dark:via-[#0D0D16] dark:to-[#0A0A0F]" />

      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-[1]"
      />

      {/* Dot grid */}
      <div className="absolute inset-0 [background-image:radial-gradient(rgba(0,0,0,0.07)_1px,transparent_1px)] dark:[background-image:radial-gradient(rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Floating orbs */}
      <FloatingOrb
        className="w-96 h-96 bg-amber-400/20 dark:bg-amber-500/10 -top-20 -right-10"
        delay={0}
      />
      <FloatingOrb
        className="w-64 h-64 bg-orange-400/15 dark:bg-orange-500/8 bottom-10 -left-6"
        delay={2}
      />
      <FloatingOrb
        className="w-48 h-48 bg-amber-300/20 dark:bg-amber-400/8 top-1/2 left-1/4"
        delay={4}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left — text */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            {/* Available badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 text-xs font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping-slow" />
              <span>Open to opportunities</span>
            </motion.div>

            {/* Greeting */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <p className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-medium mb-2">
                Hi there, I&apos;m 👋
              </p>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-gray-100 dark:to-gray-300 bg-clip-text text-transparent whitespace-nowrap">
                  {profile?.name || "Raviganesh M"}
                </span>
              </h1>
            </motion.div>

            {/* Typewriter role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700 dark:text-gray-200 h-9 md:h-10"
            >
              <TypewriterRole />
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="text-base md:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              {bio}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-wrap gap-3 justify-center lg:justify-start"
            >
              <motion.button
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                whileHover={{
                  scale: 1.04,
                  boxShadow: "0 0 30px rgba(245,158,11,0.4)",
                }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-shadow"
              >
                <Sparkles size={16} />
                View My Work
              </motion.button>

              {profile?.resume_url && (
                <motion.a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-amber-400/50 dark:border-amber-500/40 text-amber-700 dark:text-amber-400 font-semibold text-sm hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                >
                  <Download size={16} />
                  Download CV
                </motion.a>
              )}
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="flex items-center gap-3 justify-center lg:justify-start"
            >
              {SOCIAL_ICONS.map(({ icon: Icon, key, label }) =>
                profile?.[key] ? (
                  <motion.a
                    key={key}
                    href={profile[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -3 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-black/10 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                    aria-label={label}
                  >
                    <Icon />
                  </motion.a>
                ) : null,
              )}
            </motion.div>
          </div>

          {/* Right — profile image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="flex-shrink-0"
          >
            <div className="relative">
              {/* Glow ring */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 blur-2xl opacity-35 dark:opacity-40 scale-110"
              />

              {/* Spinning ring */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/30 animate-spin-slow scale-110" />

              {/* Image container */}
              <div className="relative w-[85vw] h-[85vw] md:w-[32rem] md:h-[32rem] lg:w-[42rem] lg:h-[42rem] rounded-full overflow-hidden border-4 border-amber-200/60 dark:border-white/80 shadow-2xl shadow-amber-100/50 dark:shadow-none">
                <Image
                  src="/ravi_image.png"
                  alt="Raviganesh M"
                  fill
                  sizes="(max-width: 768px) 85vw, (max-width: 1024px) 32rem, 42rem"
                  className="object-cover object-top"
                  priority
                />
              </div>

              {/* Floating badge — bottom right */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-4 -right-4 bg-white dark:bg-[#1A1A2E] border border-amber-200 dark:border-amber-500/30 rounded-2xl px-3 py-2 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      SAP Labs
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Developer
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge — top left */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
                className="absolute -top-4 -left-4 bg-white dark:bg-[#1A1A2E] border border-amber-200 dark:border-amber-500/30 rounded-2xl px-3 py-2 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">
                      AI
                    </p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      Enthusiast
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.button
          ref={scrollIndicatorRef}
          onClick={handleScrollDown}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 hover:text-amber-500 transition-colors group"
          aria-label="Scroll down"
        >
          <span className="text-xs font-medium tracking-widest uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={16} />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}

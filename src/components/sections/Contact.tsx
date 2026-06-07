"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Mail, MapPin, Send, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import { Skeleton } from "@/components/shared/Skeleton";
import { useProfile } from "@/hooks/useData";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_FORM: FormData = { name: "", email: "", subject: "", message: "" };

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
}: Readonly<{
  label: string;
  name: keyof FormData;
  type?: string;
  value: string;
  onChange: (name: keyof FormData, value: string) => void;
  placeholder?: string;
  required?: boolean;
}>) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-amber-500 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        required={required}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-sm",
          "bg-white/60 dark:bg-white/[0.04]",
          "border border-black/[0.08] dark:border-white/[0.08]",
          "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600",
          "focus:outline-none focus:border-amber-400/60 dark:focus:border-amber-500/50 focus:ring-2 focus:ring-amber-400/10 dark:focus:ring-amber-500/10",
          "transition-all backdrop-blur-xl"
        )}
      />
    </div>
  );
}

function IconGithub({ size = 17 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconLinkedin({ size = 17 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function IconInstagram({ size = 17 }: Readonly<{ size?: number }>) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function Contact() {
  const { data: profile, loading: profileLoading } = useProfile();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (name: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send");

      toast.success("Message sent! I'll get back to you soon 🚀", {
        style: {
          background: "#1A1A2E",
          color: "#F9FAFB",
          border: "1px solid rgba(245,158,11,0.3)",
        },
        iconTheme: { primary: "#F59E0B", secondary: "#fff" },
      });
      setForm(INITIAL_FORM);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.", {
        style: { background: "#1A1A2E", color: "#F9FAFB" },
      });
    } finally {
      setSubmitting(false);
    }
  };

  const socials = [
    profile?.github_url    && { icon: IconGithub,    label: "GitHub",    href: profile.github_url },
    profile?.linkedin_url  && { icon: IconLinkedin,  label: "LinkedIn",  href: profile.linkedin_url },
    profile?.instagram_url && { icon: IconInstagram, label: "RG Clicks", href: profile.instagram_url },
  ].filter(Boolean) as { icon: React.ElementType; label: string; href: string }[];

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <Toaster position="bottom-right" />

      <div className="absolute inset-0 bg-gradient-to-b from-white via-amber-50/30 to-white dark:from-[#0A0A0F] dark:via-[#0D0D16] dark:to-[#0A0A0F]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          tag="Contact"
          title="Let's Build Something Together"
          subtitle="Have an idea, an opportunity, or just want to say hi? My inbox is always open."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left — contact info */}
          <AnimatedSection direction="right" className="lg:col-span-2 space-y-5">
            <GlassCard hover={false}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Reach Out
              </p>
              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Email</p>
                    {profileLoading ? (
                      <Skeleton className="h-4 w-40 mt-1" />
                    ) : profile?.email ? (
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-sm font-medium text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        {profile.email}
                      </a>
                    ) : null}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Location</p>
                    {profileLoading ? (
                      <Skeleton className="h-4 w-32 mt-1" />
                    ) : (
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {profile?.location ?? "—"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard hover={false}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Follow Along
              </p>
              {profileLoading ? (
                <div className="flex gap-3">
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="w-10 h-10 rounded-xl" />
                  <Skeleton className="w-10 h-10 rounded-xl" />
                </div>
              ) : (
                <div className="flex gap-3">
                  {socials.map(({ icon: Icon, label, href }) => (
                    <motion.a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15, y: -3 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 rounded-xl border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
                      aria-label={label}
                    >
                      <Icon size={17} />
                    </motion.a>
                  ))}
                </div>
              )}
            </GlassCard>

            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
              <p className="text-sm text-green-700 dark:text-green-400">
                Usually responds within 24 hours
              </p>
            </div>
          </AnimatedSection>

          {/* Right — form */}
          <AnimatedSection direction="left" className="lg:col-span-3">
            <GlassCard hover={false} glow>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InputField
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                  <InputField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <InputField
                  label="Subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Let's collaborate on something great"
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message <span className="text-amber-500">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Tell me about your project, idea, or opportunity..."
                    required
                    rows={5}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl text-sm resize-none",
                      "bg-white/60 dark:bg-white/[0.04]",
                      "border border-black/[0.08] dark:border-white/[0.08]",
                      "text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600",
                      "focus:outline-none focus:border-amber-400/60 dark:focus:border-amber-500/50 focus:ring-2 focus:ring-amber-400/10 dark:focus:ring-amber-500/10",
                      "transition-all backdrop-blur-xl"
                    )}
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileHover={{ scale: submitting ? 1 : 1.02, boxShadow: "0 0 30px rgba(245,158,11,0.3)" }}
                  whileTap={{ scale: submitting ? 1 : 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] disabled:opacity-70 disabled:cursor-not-allowed transition-shadow"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </motion.button>
              </form>
            </GlassCard>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}

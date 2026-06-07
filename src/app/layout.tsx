import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raviganesh M — Developer & AI Engineer",
  description:
    "Personal portfolio of Raviganesh M, a developer at SAP Labs passionate about AI, full-stack engineering, and building intelligent solutions.",
  keywords: ["Raviganesh", "developer", "SAP Labs", "AI", "portfolio", "Next.js", "full-stack"],
  authors: [{ name: "Raviganesh M" }],
  openGraph: {
    type: "website",
    title: "Raviganesh M — Developer & AI Engineer",
    description:
      "Passionate developer at SAP Labs building AI-powered solutions and full-stack applications.",
    siteName: "Raviganesh M",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raviganesh M — Developer & AI Engineer",
    description: "Passionate developer at SAP Labs exploring AI and emerging technologies.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ErrorBoundary>
            <Navbar />
            <main className="overflow-x-hidden">{children}</main>
            <Footer />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}

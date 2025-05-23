import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Footer from "@/components/main/footer";
import ExternalLinkInterceptor from "@/components/externalLinkInterceptor";
import {
  geistSans,
  geistMono,
  menlo,
  consolas,
  jetbrainsMono,
  ubuntu,
  spaceGrotesk,
} from "@/components/fonts";
import LightModeTipAlert from "@/components/lightModeTip";
import Header from "@/components/main/header";
import Head from "next/head";
import LogoDark from "@/public/assets/LogoDark.svg";
import Logo from "@/public/assets/Logo.svg";
import { cn } from "@/lib/utils";
import ThemeSanitizer from "@/hooks/themeSanitizer";

export const metadata: Metadata = {
  title: "Zendo - Intuition",
  description:
    "Welcome to Zendo. This is a private website for covering my work, projects, and portfolio. Let's explore the world of technology together.",
  keywords: [
    "portfolio",
    "productivity",
    "technology",
    "aarush",
    "master",
    "projects",
    "zendo",
    "programming",
    "development",
    "design",
    "management",
  ],
  authors: [
    {
      name: "Aarush Master",
      url: "https://github.com/aarush0101",
    },
    {
      name: "Aarush Master",
      url: "mailto:aarush01111@gmail.com",
    },
  ],
  assets: "https://zendo.pages.dev/assets/",
  category: "Programming and Technology",
  metadataBase: new URL("https://zendo.pages.dev/"),
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: "Zendo",
    description:
      "Welcome to Zendo. This is a private website for covering my work, projects, and portfolio. Let's explore the world of technology together.",
    url: "https://zendo.pages.dev/",
    siteName: "Zendo",
    determiner: "the",
  },
  robots: "/robots.txt",
  twitter: {
    card: "summary_large_image",
    title: "Zendo",
    description:
      "Welcome to Zendo. This is a private website for covering my work, projects, and portfolio. Let's explore the world of technology together.",
    creator: "@aarush01111",
  },
  pinterest: {
    richPin: true,
  },
  verification: {
    google: "-q79a7PlxvBy3gr5cMmDHsT3av2Axtzrq1Vb6dcmSWA",
    yandex: "a16a2e8a4fb0ad33",
    other: {
      "msvalidate.01": "969F0E11BC415787B2C7464A98FBDF02",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="preload" href={Logo.src} as="image" />
        <link rel="preload" href={LogoDark.src} as="image" />
      </Head>
      <body
        className={cn(
          `scroll-smooth w-full p-0 m-0 overflow-x-clip ${geistSans.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${menlo.variable} ${ubuntu.variable} ${jetbrainsMono.variable} ${consolas.variable} antialiased`
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ThemeSanitizer />
          <ExternalLinkInterceptor />
          <Header />
          <main
            tabIndex={-1}
            id="main"
            className={cn(
              "text-base outline-none app-font",
              "pt-[3.5rem]"
            )}
          >
            {children}
          </main>
          <section className="text-base" aria-label="Notifications and Tips">
            <LightModeTipAlert />
            <Toaster position="bottom-right" richColors={true} />
          </section>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}

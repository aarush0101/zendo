"use client";

import { useEffect, useState, useMemo } from "react";
import { ModeToggle } from "@/components/modules/modes";
import { Menu, X, Search } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LogoBlack from "@/public/assets/LogoBlack.svg";
import LogoWhite from "@/public/assets/LogoWhite.svg";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { detectOS, stripOS } from "@/lib/utils";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import SearchSkeleton from "@/components/skeletons/searchSkeleton";
import MobileMenuSkeleton from "@/components/skeletons/mobileMenuSkeleton";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const LazyMobileMenu = dynamic(() => import("@/components/modules/mobileMenu"), {
  loading: () => <MobileMenuSkeleton />,
  ssr: false,
});

const LazySearchBar = dynamic(() => import("@/components/modules/search"), {
  loading: () => <SearchSkeleton />,
  ssr: false,
});

export default function Header() {
  const os = useMemo(() => detectOS(), []);
  const strippedOS = useMemo(() => {
    return stripOS(os);
  }, [os]);

  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [shouldRenderS, setShouldRenderS] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (openS) {
          setOpenS(false);
          return;
        }
        if (open) {
          setOpen(false);
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, openS]);

  useEffect(() => {
    const downS = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (open) {
          setOpen(false);
        } else {
          setOpenS((prev) => !prev);
        }
      }
    };

    document.addEventListener("keydown", downS);
    return () => document.removeEventListener("keydown", downS);
  }, [open, openS]);

  useEffect(() => {
    if (openS) {
      // When opening, immediately render
      setShouldRenderS(true);
    }
    if (open) {
      // When opening, immediately render
      setShouldRender(true);
    }
    // When closing, we'll let the component itself tell us when to unmount
  }, [open, openS]);

  if (!mounted) return null;
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <>
      <header
        aria-label="Primary Header"
        className={cn(
          "sticky top-0 left-0 right-0 z-50 flex items-center border-0 border-b-[0.1rem] gap-y-2 backdrop-blur-md app-font min-h-0",
          "fixed br:w-full",
          "will-change-transform transform-gpu backface-hidden"
        )}
      >
        <div className={cn("py-2.5 px-2.5 w-full flex items-center")}>
          <Button
            aria-label="Skip Navigation"
            variant="ghost"
            asChild
            className={cn(
              "sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-50 nav-btn px-4 py-2.5 rounded-[var(--radius)]"
            )}
          >
            <Link
              aria-label="Skip to main content"
              href="#main"
              onClick={(e) => {
                e.preventDefault();
                const main = document.getElementById("main");
                if (main) {
                  main.scrollIntoView({ behavior: "smooth" });
                  main.focus();
                } else {
                  console.error(
                    "Failed to find the main element on the page. Are you sure there is a main tag with id='main'?"
                  );
                }
              }}
              className={cn("w-full h-full flex items-center justify-center")}
            >
              Skip Navigation
            </Link>
          </Button>

          <Button
            variant="ghost"
            asChild
            className={cn("flex items-center transition-colors bg-transparent duration-400")}
          >
            {/* Preload both logos at once to prevent network requests */}
            <Link key="logo-link" href="/" className="relative w-[140px] aspect-[140/30]">
              {!imageLoaded && <Skeleton className="absolute inset-0 w-full h-full rounded-full" />}

              <Image
                src={LogoBlack}
                alt="Zendo Logo Black"
                fill
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  "absolute inset-0 object-contain transition-opacity duration-300",
                  currentTheme === "light" ? "opacity-100" : "opacity-0"
                )}
              />
              <Image
                src={LogoWhite}
                alt="Zendo Logo Light"
                fill
                loading="lazy"
                onLoad={() => setImageLoaded(true)}
                className={cn(
                  "absolute inset-0 object-contain transition-opacity duration-300",
                  currentTheme === "dark" ? "opacity-100" : "opacity-0"
                )}
              />
            </Link>
          </Button>

          <nav
            aria-label="Primary Navigation and Inter-Links"
            className={cn("hidden br:flex items-center app-gap ml-7")}
          >
            {["About", "Portfolio", "Projects", "Contact"].map((label) => (
              <Button size="lg" key={label} variant="ghost" className={cn("nav-btn")} asChild>
                <Link href={`/${label.toLowerCase()}`}>{label}</Link>
              </Button>
            ))}
          </nav>
          <div className={cn("flex-grow")} />
          <section
            aria-label="Secondary Navigation - Search and themes"
            className={cn(
              "hidden br:flex items-center app-gap br:ml-auto w-full br:w-auto justify-center br:justify-end"
            )}
          >
            <Button
              size="lg"
              variant="ghost"
              onClick={() => setOpenS(true)}
              className={cn("ml-6 group inline-flex items-center justify-center app-gap nav-btn")}
            >
              <Search size="1.2rem" />
              <span className={cn("flex items-center gap-3")}>
                <span className={cn("text-sm")}>Search</span>
                <kbd
                  className={cn(
                    "px-1.5 py-[2px] rounded bg-muted/30 border border-border text-[10px] font-medium font-mono text-muted-foreground backdrop-blur-sm"
                  )}
                >
                  <span className="sr-only">
                    {strippedOS === "mac"
                      ? "Command key plus K"
                      : strippedOS === "windows"
                        ? "Control key plus K"
                        : strippedOS === "phone"
                          ? "Press to search"
                          : "Please Refresh the Page"}
                  </span>
                  {strippedOS === "mac" ? (
                    <>{"\u2318"} K</>
                  ) : strippedOS === "windows" ? (
                    <>CTRL K</>
                  ) : strippedOS === "phone" ? (
                    <>PRESS</>
                  ) : !strippedOS ? (
                    <>REFRESH</>
                  ) : null}
                </kbd>
              </span>
            </Button>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("nav-btn")}
                    asChild
                    key="github-repository"
                  >
                    <Link href="https://github.com/aarush0101/zendo" target="_blank">
                      <span className="flex items-center justify-center">
                        <span className="sr-only">GitHub Repository</span>
                        <SiGithub size="1.2rem" />
                      </span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className={cn("text-balance text-base")}>
                  Visit Website Repository
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <ModeToggle />
          </section>

          <section className={cn("flex flex-col justify-center items-center ml-auto br:hidden")}>
            <Button
              aria-label="Mobile Menu Button"
              key="mobile-menu"
              onClick={() => {
                setOpen(!open);
              }}
              variant="ghost"
              size="icon"
              className={cn("flex justify-center items-center app-gap nav-btn br:hidden")}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 1 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    <X size="1.2rem" aria-label="Close Mobile Menu" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed"
                    initial={{ rotate: -90, opacity: 1 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  >
                    <Menu size="1.2rem" aria-label="Open Mobile Menu" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </section>
        </div>
      </header>

      {shouldRender && (
        <LazyMobileMenu
          open={open}
          setOpenAction={setOpen}
          setOpenSAction={setOpenS}
          strippedOS={strippedOS}
          onCloseComplete={() => {
            if (!open) setShouldRender(false);
          }}
        />
      )}

      {shouldRenderS && (
        <LazySearchBar
          open={open}
          setOpenAction={setOpen}
          openS={openS}
          setOpenSAction={setOpenS}
          onCloseComplete={() => {
            if (!openS) setShouldRender(false);
          }}
        />
      )}
    </>
  );
}

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { gsap } from "./lib/gsap";
import HugeHeader from "./components/HugeHeader";
import HugeHero from "./components/HugeHero";
import EcosystemSection from "./components/EcosystemSection";
import StoryScrollJourney from "./components/StoryScrollJourney";
import EnqoqCashDemo from "./components/EnqoqCashDemo";
import StudioShowcase from "./components/StudioShowcase";
import VisionSection from "./components/VisionSection";
import MediaHub from "./components/MediaHub";
import HugeFooter from "./components/HugeFooter";
import CookieBanner from "./components/CookieBanner";
import { AdminPanel } from "./components/AdminPanel";
import ThreeDScrollWrapper from "./components/ThreeDScrollWrapper";
import ScrollRotatingLogo from "./components/ScrollRotatingLogo";
import { YouTobiaMarkSVG } from "./components/YutobiaLogo";
import { fetchMediaItems, addLikeToItem, fetchSocialAccounts, fetchHeroVideoUrl } from "./lib/supabase";
import { MediaItem, SocialAccount } from "./types";

export default function App() {
  const [activeSection,   setActiveSection]   = useState("home");
  const [gameScore,       setGameScore]        = useState(0);
  const [isBooting,       setIsBooting]        = useState(true);
  const [loadingProgress, setLoadingProgress]  = useState(0);
  const [loadingPhase,    setLoadingPhase]     = useState("INITIALIZING SYSTEM...");

  // ── Theme ──────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  useEffect(() => {
    const root = document.documentElement;
    theme === "dark" ? root.classList.add("dark") : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  // ── Data ───────────────────────────────────────────────────────────────
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [mediaItems,  setMediaItems]  = useState<MediaItem[]>([]);
  const [socials,     setSocials]     = useState<SocialAccount[]>([]);
  const [heroVideoUrl,setHeroVideoUrl]= useState("");

  const refreshUiAll = async () => {
    try {
      setMediaItems(await fetchMediaItems());
      setSocials(await fetchSocialAccounts());
      setHeroVideoUrl(await fetchHeroVideoUrl());
    } catch (e) {
      console.error("Failed to load live configs:", e);
    }
  };
  useEffect(() => { refreshUiAll(); }, []);

  const handleLikeItem = async (id: string) => {
    const updatedLikes = await addLikeToItem(id);
    setMediaItems(prev => prev.map(item => item.id === id ? { ...item, likes: updatedLikes } : item));
  };

  // ── Splash / boot sequence ─────────────────────────────────────────────
  // Splash refs
  const splashRef   = useRef<HTMLDivElement>(null);
  const curtainTopRef    = useRef<HTMLDivElement>(null);
  const curtainBottomRef = useRef<HTMLDivElement>(null);
  const splashLogoRef    = useRef<HTMLDivElement>(null);
  const splashTitleRef   = useRef<HTMLHeadingElement>(null);
  const splashSubRef     = useRef<HTMLParagraphElement>(null);
  const splashTopBarRef  = useRef<HTMLDivElement>(null);
  const splashProgressBarRef  = useRef<HTMLDivElement>(null);
  const splashPhaseRef   = useRef<HTMLSpanElement>(null);
  const splashPctRef     = useRef<HTMLSpanElement>(null);
  const splashBottomRef  = useRef<HTMLDivElement>(null);

  // Run boot counter + GSAP entrance on splash
  useLayoutEffect(() => {
    const el = splashRef.current;
    if (!el) return;

    // Entrance of splash content
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(splashTopBarRef.current, { opacity:0, y:-10, duration:0.6, ease:"power3.out" }, 0)
        .from(splashLogoRef.current,   { opacity:0, scale:0.9, filter:"blur(4px)", duration:0.8, ease:"power3.out" }, 0.1)
        .from(splashTitleRef.current,  { opacity:0, duration:1.0, ease:"power2.out" }, 0.3)
        .from(splashSubRef.current,    { opacity:0, duration:0.5, ease:"power2.out" }, 0.6)
        .from(splashBottomRef.current, { opacity:0, duration:0.5, ease:"power2.out" }, 0.4);

      // Continuous logo spin
      gsap.to(splashLogoRef.current, {
        rotate: 360, duration: 20, ease: "none", repeat: -1,
      });
    }, el);

    // Progress counter
    let startTimestamp: number | null = null;
    const countDuration = 2200;
    let animId: number;

    const animate = (ts: number) => {
      if (!startTimestamp) startTimestamp = ts;
      const elapsed = ts - startTimestamp;
      const ratio   = Math.min(elapsed / countDuration, 1);
      const progress = Math.floor(ratio * 100);
      setLoadingProgress(progress);

      let phase = "INITIALIZING BRAND PORTAL...";
      if (progress >= 20 && progress < 50) phase = "CALIBRATING TRIVIA ENGINE (የዕውቀት ማዕከል)...";
      else if (progress >= 50 && progress < 75) phase = "COMPILING INTERACTIVE GAMESPACES...";
      else if (progress >= 75 && progress < 95) phase = "POLISHING RENDER PIPELINES...";
      else if (progress >= 95) phase = "SYSTEMS READY. WELCOME TO YOUTOBIA.";
      setLoadingPhase(phase);

      if (elapsed < countDuration) animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);

    // Dismiss after 3 s
    const bootTimer = setTimeout(() => {
      // GSAP curtain exit
      const exitTl = gsap.timeline({
        onComplete: () => {
          setIsBooting(false);
          ctx.revert();
        },
      });
      exitTl
        .to(splashLogoRef.current,  { opacity:0, scale:0.93, filter:"blur(12px)", duration:0.4 }, 0)
        .to(splashTitleRef.current, { opacity:0, duration:0.3 }, 0)
        .to(splashBottomRef.current,{ opacity:0, duration:0.3 }, 0)
        .to(curtainTopRef.current,    { y:"-100%", duration:1.1, ease:"yutobia.curtain" }, 0.15)
        .to(curtainBottomRef.current, { y:"100%",  duration:1.1, ease:"yutobia.curtain" }, 0.15);
    }, 3000);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(bootTimer);
      ctx.revert();
    };
  }, []);

  // Animate progress bar & phase text reactively
  useEffect(() => {
    if (splashProgressBarRef.current) {
      gsap.to(splashProgressBarRef.current, { width:`${loadingProgress}%`, duration:0.1, ease:"none" });
    }
    if (splashPhaseRef.current) {
      gsap.fromTo(splashPhaseRef.current,
        { opacity:0, y:5 },
        { opacity:1, y:0, duration:0.3, ease:"power2.out" }
      );
    }
    if (splashPctRef.current) {
      splashPctRef.current.textContent = loadingProgress.toString().padStart(3,"0") + "%";
    }
  }, [loadingProgress, loadingPhase]);

  // High score from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("enqoq_leaderboard");
    if (stored) {
      try {
        const scores = JSON.parse(stored);
        if (scores && scores.length > 0) {
          const top = scores.reduce((acc: number, item: any) => Math.max(acc, item.score), 0);
          setGameScore(top);
        }
      } catch (_) {}
    }
  }, []);

  // ── Scroll spy ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home","ecosystem","enqoq-cash","studio","vision","media-hub","connect"];
      const scrollPos = window.scrollY + 200;
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const { offsetTop, offsetHeight } = el;
          if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
            setActiveSection(sec);
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(sectionId);
    }
  };

  const handleUpdateScore = (score: number) => {
    setGameScore(prev => Math.max(prev, score));
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#060606] text-neutral-900 font-sans" style={{ overflowX: "clip" }}>

      {/* ── Global 3D logo background (scroll-driven rotation) ───────── */}
      <ScrollRotatingLogo />

      {/* ── GSAP Splash Curtain ──────────────────────────────────────────── */}
      {isBooting && (
        <div ref={splashRef} className="fixed inset-0 z-50 pointer-events-none">
          {/* Top curtain */}
          <div ref={curtainTopRef}
            className="absolute left-0 top-0 w-full h-[50.5vh] bg-neutral-950 border-b border-brand/10 pointer-events-auto" />
          {/* Bottom curtain */}
          <div ref={curtainBottomRef}
            className="absolute left-0 bottom-0 w-full h-[50.5vh] bg-neutral-950 border-t border-brand/10 pointer-events-auto" />

          {/* Red radial glow behind center */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,30,39,0.06)_0%,transparent_70%)] pointer-events-none" />

          {/* Centerline */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px w-full bg-[#FF1E27]/20 pointer-events-none z-10" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-between p-8 sm:p-12 text-center pointer-events-none z-20">

            {/* Top bar */}
            <div ref={splashTopBarRef}
              className="w-full flex justify-between items-center max-w-7xl font-mono text-[10px] tracking-widest text-[#FF1E27] select-none">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                <span>YUTOBIA SYSTEM CORE v4.5</span>
              </div>
              <span>LOC_CODE: ETH_ADDIS_ABABA</span>
            </div>

            {/* Central logo + wordmark */}
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FF1E27] rounded-full blur-[45px] opacity-20 scale-110 animate-pulse" />
                <div ref={splashLogoRef} className="relative z-10">
                  <YouTobiaMarkSVG size={95} id="splash" />
                </div>
              </div>
              <div className="space-y-4">
                <h1 ref={splashTitleRef}
                  className="font-serif italic text-6xl text-white select-none leading-none">
                  YouTobia
                </h1>
                <p ref={splashSubRef}
                  className="text-[10px] font-mono tracking-[0.55em] text-white/50 select-none uppercase">
                  The Multimedia Standard
                </p>
              </div>
            </div>

            {/* Bottom progress */}
            <div ref={splashBottomRef} className="w-full max-w-xl space-y-6">
              <div className="space-y-2.5">
                <div className="flex justify-between items-end font-mono text-[10px] select-none">
                  <span ref={splashPhaseRef} className="text-white/45 tracking-wider font-light">
                    {loadingPhase}
                  </span>
                  <span ref={splashPctRef} className="text-[#FF1E27] font-semibold text-sm tracking-tight font-mono">
                    000%
                  </span>
                </div>
                <div className="h-[2px] w-full bg-white/5 relative overflow-hidden rounded-full">
                  <div ref={splashProgressBarRef}
                    className="absolute left-0 top-0 h-full bg-[#FF1E27]"
                    style={{ width: "0%", boxShadow: "0 0 10px #FF1E27, 0 0 4px #FF1E27" }} />
                </div>
              </div>
              <div className="font-mono text-[8px] text-white/40 tracking-[0.25em] flex justify-center gap-6 select-none opacity-30">
                <span>GRID // ACTIVE</span>
                <span>ACCELERATOR // WEBGL_OK</span>
                <span>CULTURE_VAULT // SYNCED</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── Page content ────────────────────────────────────────────────── */}
      <div className="relative flex flex-col" style={{ zIndex: 1 }}>
        <HugeHeader
          onNavigate={handleNavigate}
          activeSection={activeSection}
          gameScore={gameScore}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <ThreeDScrollWrapper id="home">
          <HugeHero onPlayDemo={() => handleNavigate("enqoq-cash")}
            onNavigate={handleNavigate} gameScore={gameScore} heroVideoUrl={heroVideoUrl} />
        </ThreeDScrollWrapper>

        <ThreeDScrollWrapper id="ecosystem">
          <EcosystemSection />
        </ThreeDScrollWrapper>

        <ThreeDScrollWrapper>
          <StoryScrollJourney onPlayDemo={() => handleNavigate("enqoq-cash")} />
        </ThreeDScrollWrapper>

        <ThreeDScrollWrapper id="enqoq-cash">
          <EnqoqCashDemo onUpdateScore={handleUpdateScore} />
        </ThreeDScrollWrapper>

        <ThreeDScrollWrapper id="studio">
          <StudioShowcase onPlayDemo={() => handleNavigate("enqoq-cash")} />
        </ThreeDScrollWrapper>

        <ThreeDScrollWrapper id="vision">
          <VisionSection />
        </ThreeDScrollWrapper>

        <ThreeDScrollWrapper id="media-hub">
          <MediaHub items={mediaItems} onLike={handleLikeItem} />
        </ThreeDScrollWrapper>

        <ThreeDScrollWrapper id="connect">
          <HugeFooter onNavigate={handleNavigate} socials={socials} />
        </ThreeDScrollWrapper>

        <CookieBanner />

        <AdminPanel
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          onSettingsUpdated={refreshUiAll}
        />
      </div>
    </div>
  );
}

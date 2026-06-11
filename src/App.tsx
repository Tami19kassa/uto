import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import HugeHeader from "./components/HugeHeader";
import HugeHero from "./components/HugeHero";
import StoryScrollJourney from "./components/StoryScrollJourney";
import EnqoqCashDemo from "./components/EnqoqCashDemo";
import StudioShowcase from "./components/StudioShowcase";
import MediaHub from "./components/MediaHub";
import HugeFooter from "./components/HugeFooter";
import CookieBanner from "./components/CookieBanner";
import { AdminPanel } from "./components/AdminPanel";
import ThreeDScrollWrapper from "./components/ThreeDScrollWrapper";
import { fetchMediaItems, addLikeToItem, fetchSocialAccounts, fetchHeroVideoUrl } from "./lib/supabase";
import { MediaItem, SocialAccount } from "./types";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [gameScore, setGameScore] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState("INITIALIZING SYSTEM...");
  
  // Theme Toggle Engine
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Control Panel integration state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [socials, setSocials] = useState<SocialAccount[]>([]);
  const [heroVideoUrl, setHeroVideoUrl] = useState("");

  const refreshUiAll = async () => {
    try {
      const media = await fetchMediaItems();
      setMediaItems(media);

      const soc = await fetchSocialAccounts();
      setSocials(soc);

      const video = await fetchHeroVideoUrl();
      setHeroVideoUrl(video);
    } catch (e) {
      console.error("Failed to load live database configs in main UI container:", e);
    }
  };

  useEffect(() => {
    refreshUiAll();
  }, []);

  const handleLikeItem = async (id: string) => {
    const updatedLikes = await addLikeToItem(id);
    setMediaItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, likes: updatedLikes };
      }
      return item;
    }));
  };

  // Trigger high score lookups 
  useEffect(() => {
    // Check if user has already played and stored a high score in this session
    const stored = localStorage.getItem("enqoq_leaderboard");
    if (stored) {
      try {
        const scores = JSON.parse(stored);
        if (scores && scores.length > 0) {
          // If the user name is saved in state we can fetch it, or just show high-score seed
          const totalScores = scores.reduce((acc: number, item: any) => Math.max(acc, item.score), 0);
          setGameScore(totalScores);
        }
      } catch (e) {
        console.error("Failed to load scores for menu context", e);
      }
    }
    
    // Play detailed splash entry animation with ticking up percentage
    let startTimestamp: number | null = null;
    const countDuration = 2200; // Duration for counting up to 100
    let animationFrameId: number;
    
    function animate(timestamp: number) {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progressRatio = Math.min(elapsed / countDuration, 1);
      const currentProgress = Math.floor(progressRatio * 100);
      setLoadingProgress(currentProgress);
      
      if (currentProgress < 20) {
        setLoadingPhase("INITIALIZING BRAND PORTAL...");
      } else if (currentProgress < 50) {
        setLoadingPhase("CALIBRATING TRIVIA ENGINE (የዕውቀት ማዕከል)...");
      } else if (currentProgress < 75) {
        setLoadingPhase("COMPILING INTERACTIVE GAMESPACES...");
      } else if (currentProgress < 95) {
        setLoadingPhase("POLISHING RENDER PIPELINES...");
      } else {
        setLoadingPhase("SYSTEMS READY. WELCOME TO YOUTOBIA.");
      }
      
      if (elapsed < countDuration) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }
    
    animationFrameId = requestAnimationFrame(animate);
    
    // Hold at 100% stable state for a moment before dropping curtain
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 3000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(bootTimer);
    };
  }, []);

  // Sync scroll positions to identify active tabs in desktop header
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "enqoq-cash", "studio", "media-hub", "connect"];
      const scrollPos = window.scrollY + 200;

      for (const sec of sections) {
        const element = document.getElementById(sec);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
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
    setGameScore((prev) => Math.max(prev, score));
  };

  return (
    <div className="relative min-h-screen bg-white text-neutral-900 overflow-x-hidden font-sans">
      
      {/* Huge Agency Splash Curtain Animation Loader */}
      <AnimatePresence>
        {isBooting && (
          <motion.div
            key="splash-wrapper"
            className="fixed inset-0 z-50 pointer-events-none"
            exit={{
              transition: { staggerChildren: 0.1 }
            }}
          >
            {/* Top curtain sliding upwards */}
            <motion.div
              className="absolute left-0 top-0 w-full h-[50.5vh] bg-neutral-950 border-b border-brand/10 pointer-events-auto"
              initial={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ duration: 1.1, ease: [0.85, 0, 0.15, 1], delay: 0.2 }}
            />
            
            {/* Bottom curtain sliding downwards */}
            <motion.div
              className="absolute left-0 bottom-0 w-full h-[50.5vh] bg-neutral-950 border-t border-brand/10 pointer-events-auto"
              initial={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 1.1, ease: [0.85, 0, 0.15, 1], delay: 0.2 }}
            />

            {/* Subtle light pulse background */}
            <motion.div 
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,30,39,0.06)_0%,transparent_70%)] pointer-events-none"
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />

            {/* Glowing lines across the curtain to represent architectural scanning */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] w-full bg-[#FF1E27]/20 pointer-events-none z-10" />

            {/* Content Centered */}
            <div className="absolute inset-0 flex flex-col items-center justify-between p-8 sm:p-12 text-center pointer-events-none z-20">
              
              {/* Top Meta Ticker */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.6 }}
                className="w-full flex justify-between items-center max-w-7xl font-mono text-[10px] tracking-widest text-[#FF1E27] pointer-events-auto select-none"
              >
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
                  <span>YUTOBIA SYSTEM CORE v4.5</span>
                </div>
                <div>
                  <span>LOC_CODE: ETH_ADDIS_ABABA</span>
                </div>
              </motion.div>

              {/* Central Premium Branding and Pulsing Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.93, filter: "blur(12px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center justify-center space-y-8 pointer-events-auto"
              >
                <div className="relative">
                  {/* Outer atmospheric neon pulse blur */}
                  <div className="absolute inset-0 bg-[#FF1E27] rounded-full blur-[45px] opacity-20 scale-110 animate-pulse" />
                  
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="relative z-10"
                  >
                    <svg
                      width="95"
                      height="95"
                      viewBox="0 0 120 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <linearGradient id="splashRedGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#FF5C62" />
                          <stop offset="50%" stopColor="#FF1E27" />
                          <stop offset="100%" stopColor="#A30B11" />
                        </linearGradient>
                        <linearGradient id="splashRibbonGrad" x1="40" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="30%" stopColor="#FFA1A5" />
                          <stop offset="100%" stopColor="#FF1E27" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 60,11 C 30,11 11,32 11,60 C 11,88 28,103 48,107 C 49,90 41,79 34,71 C 26,62 19,53 23,40 C 27,27 39,21 54,23 C 71,25 80,39 82,53 C 84,67 76,80 66,86 C 65,86 52,90 40,84 C 55,94 77,93 89,81 C 102,68 104,45 94,30 C 86,18 73,11 60,11 Z"
                        fill="url(#splashRedGrad)"
                      />
                      <path
                        d="M 42,32 C 40,45 42,55 48,65 C 55,75 66,78 78,74 C 92,70 102,54 96,38 C 94,33 88,40 85,45 C 77,58 64,62 55,54 C 49,49 48,38 46,30 C 45,26 43,26 42,32 Z"
                        fill="url(#splashRibbonGrad)"
                      />
                      <path
                        d="M 48,107 C 42,108 34,103 28,100 C 24,96 16,78 18,65 C 19,64 21,68 22,72 C 26,88 36,98 48,103 C 49,105 49,106 48,107 Z"
                        fill="#FF5C62"
                      />
                    </svg>
                  </motion.div>
                </div>

                <div className="space-y-4">
                  <motion.h1
                    initial={{ tracking: "-0.05em", opacity: 0 }}
                    animate={{ tracking: "0.03em", opacity: 1 }}
                    transition={{ delay: 0.2, duration: 1.0 }}
                    className="font-serif italic text-6xl text-white select-none leading-none"
                  >
                    YouTobia
                  </motion.h1>
                  <p className="text-[10px] font-mono tracking-[0.55em] text-white/50 select-none uppercase">
                    The Multimedia Standard
                  </p>
                </div>
              </motion.div>

              {/* Bottom Tickers & Calibration Progress */}
              <div className="w-full max-w-xl space-y-6 pointer-events-auto">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-end font-mono text-[10px] select-none">
                    <motion.span 
                      key={loadingPhase}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white/45 tracking-wider font-light"
                    >
                      {loadingPhase}
                    </motion.span>
                    <span className="text-[#FF1E27] font-semibold text-sm tracking-tight font-mono">
                      {loadingProgress.toString().padStart(3, '0')}%
                    </span>
                  </div>

                  {/* Horizontal Glowing Tech progress trace bar */}
                  <div className="h-[2px] w-full bg-white/5 relative overflow-hidden rounded-full">
                    <motion.div 
                      className="absolute left-0 top-0 h-full bg-[#FF1E27]"
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ ease: "linear", duration: 0.1 }}
                      style={{
                        boxShadow: "0 0 10px #FF1E27, 0 0 4px #FF1E27"
                      }}
                    />
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-mono text-[8px] text-white/40 tracking-[0.25em] flex justify-center gap-6 select-none"
                >
                  <span>GRID // ACTIVE</span>
                  <span>ACCELERATOR // WEBGL_OK</span>
                  <span>CULTURE_VAULT // SYNCED</span>
                </motion.div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative flex flex-col">
        {/* Core Sticky Header */}
        <HugeHeader
          onNavigate={handleNavigate}
          activeSection={activeSection}
          gameScore={gameScore}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* SECTION 1: HOME */}
        <ThreeDScrollWrapper id="home">
          <HugeHero
            onPlayDemo={() => handleNavigate("enqoq-cash")}
            onNavigate={handleNavigate}
            gameScore={gameScore}
            heroVideoUrl={heroVideoUrl}
          />
        </ThreeDScrollWrapper>

        {/* INTERACTIVE SCROLL STORYTELLING JOURNEY */}
        <ThreeDScrollWrapper>
          <StoryScrollJourney onPlayDemo={() => handleNavigate("enqoq-cash")} />
        </ThreeDScrollWrapper>

        {/* SECTION 2: ENQOQ CASH */}
        <ThreeDScrollWrapper id="enqoq-cash">
          <EnqoqCashDemo onUpdateScore={handleUpdateScore} />
        </ThreeDScrollWrapper>

        {/* SECTION 3: THE STUDIO SHOWCASE */}
        <ThreeDScrollWrapper id="studio">
          <StudioShowcase onPlayDemo={() => handleNavigate("enqoq-cash")} />
        </ThreeDScrollWrapper>

        {/* SECTION 3.5: CULTURAL JOURNAL & RADIAL VLOG STREAMS */}
        <ThreeDScrollWrapper id="media-hub">
          <MediaHub 
            items={mediaItems} 
            onLike={handleLikeItem} 
          />
        </ThreeDScrollWrapper>

        {/* SECTION 4: CONTACT & DETAILS */}
        <ThreeDScrollWrapper id="connect">
          <HugeFooter onNavigate={handleNavigate} socials={socials} />
        </ThreeDScrollWrapper>

        {/* PERSISTENT CUSTOM COOKIE REGULATION */}
        <CookieBanner />

        {/* MASTER ADMIN CONTROL PANEL MODAL OVERLAY */}
        <AdminPanel 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
          onSettingsUpdated={refreshUiAll}
        />
      </div>
    </div>
  );
}

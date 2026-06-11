import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CookiePreferences } from "../types";
import { ShieldAlert, Check, Settings, X, ChevronDown, ChevronUp } from "lucide-react";

export const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    accepted: false,
    essential: true, // locked
    functional: true,
    marketing: false
  });

  useEffect(() => {
    // Check local storage for existing consent
    const consent = localStorage.getItem("youtobia_cookies_consent");
    if (!consent) {
      // Trigger banner with a slight entry delay for dramatic effect
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      accepted: true,
      essential: true,
      functional: true,
      marketing: true
    };
    setPreferences(allAccepted);
    localStorage.setItem("youtobia_cookies_consent", JSON.stringify(allAccepted));
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    const saved = {
      ...preferences,
      accepted: true
    };
    localStorage.setItem("youtobia_cookies_consent", JSON.stringify(saved));
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-0 left-0 w-full z-50 bg-black/95 backdrop-blur-lg border-t-2 border-brand text-white shadow-2xl px-6 md:px-12 py-6 md:py-8"
      >
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left side text descriptor with logo/icon */}
            <div className="flex gap-4 items-start max-w-3xl">
              <div className="bg-brand/10 p-3 rounded-xl border border-brand/20 shrink-0 text-brand">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif italic text-lg text-[#FF1E27] tracking-wide">
                  Cookie Consent & Privacy Architecture
                </h4>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-sans font-light">
                  YouTobia Multimedia uses standard cookies to manage your riddle status, score tracking, ticket verification, and to speed up graphics and asset layouts. Make your selection below.
                </p>
              </div>
            </div>

            {/* Right side primary action buttons */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-end shrink-0">
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-mono text-xs tracking-widest px-5 py-3 rounded-lg transition-all flex items-center gap-2 cursor-pointer"
                id="cookie-options-toggle"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{showConfig ? "HIDE SETTINGS" : "CUSTOMIZE"}</span>
                {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="bg-[#FF1E27] hover:bg-[#C90E16] text-white font-mono text-xs tracking-widest px-6 py-3 rounded-lg transition-all scale-100 hover:scale-105 cursor-pointer shadow-lg shadow-brand/20 font-bold"
                id="cookie-accept-all"
              >
                ACCEPT ALL
              </button>
            </div>
          </div>

          {/* Config choices expansion */}
          <AnimatePresence>
            {showConfig && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                
                {/* Preference Cell 1: Essential (Locked) */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 space-y-3 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic text-sm text-white">1. Core Engine Tracker</span>
                    <span className="bg-brand/10 text-brand text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">REQUIRED</span>
                  </div>
                  <p className="text-[11px] text-white/45 leading-relaxed font-sans font-light">
                    Saves current score state and unique ticket registration IDs inside your browser context. Essential for playing Enqoq Demo.
                  </p>
                </div>

                {/* Preference Cell 2: Functional */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 space-y-3 relative hover:border-brand-orange/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic text-sm text-white">2. Interactive Boosters</span>
                    <input
                      type="checkbox"
                      checked={preferences.functional}
                      onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                      className="accent-[#FF1E27] w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-white/45 leading-relaxed font-sans font-light">
                    Speeds up canvas transitions and caches high-resolution background assets/icons to optimize mobile and desktop scrolling.
                  </p>
                </div>

                {/* Preference Cell 3: Marketing */}
                <div className="bg-neutral-950 p-4 rounded-xl border border-white/5 space-y-3 relative hover:border-brand/20 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-serif italic text-sm text-white">3. Analytics Insights</span>
                    <input
                      type="checkbox"
                      checked={preferences.marketing}
                      onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                      className="accent-brand w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-white/45 leading-relaxed font-sans font-light">
                    Assists YouTobia Multimedia developers in measuring competitive score timings to keep cash-out rates accurate.
                  </p>
                </div>

                {/* Safe Save Trigger */}
                <div className="md:col-span-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    className="bg-white hover:bg-neutral-200 text-black font-mono text-xs tracking-widest px-5 py-2.5 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    SAVE PREFERENCES
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>}
    </AnimatePresence>
  );
};
export default CookieBanner;

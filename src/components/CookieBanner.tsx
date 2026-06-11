import React, { useState, useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";
import { CookiePreferences } from "../types";
import { ShieldAlert, Settings, ChevronDown, ChevronUp } from "lucide-react";

export const CookieBanner: React.FC = () => {
  const [showBanner, setShowBanner]   = useState(false);
  const [showConfig, setShowConfig]   = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    accepted: false, essential: true, functional: true, marketing: false,
  });
  const bannerRef  = useRef<HTMLDivElement>(null);
  const configRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const consent = localStorage.getItem("youtobia_cookies_consent");
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Animate banner in/out
  useEffect(() => {
    const el = bannerRef.current;
    if (!el) return;
    if (showBanner) {
      gsap.set(el, { display: "block" });
      gsap.fromTo(el,
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "yutobia.enter" }
      );
    }
  }, [showBanner]);

  const dismissBanner = () => {
    gsap.to(bannerRef.current, {
      y: 150, opacity: 0, duration: 0.4, ease: "yutobia.exit",
      onComplete: () => setShowBanner(false),
    });
  };

  // Animate config panel open/close
  useEffect(() => {
    const el = configRef.current;
    if (!el) return;
    if (showConfig) {
      gsap.set(el, { display: "grid", height: 0, opacity: 0 });
      gsap.to(el, { height: "auto", opacity: 1, duration: 0.35, ease: "power2.out" });
    } else {
      gsap.to(el, {
        height: 0, opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => gsap.set(el, { display: "none" }),
      });
    }
  }, [showConfig]);

  const handleAcceptAll = () => {
    const all = { accepted:true, essential:true, functional:true, marketing:true };
    setPreferences(all);
    localStorage.setItem("youtobia_cookies_consent", JSON.stringify(all));
    dismissBanner();
  };

  const handleSavePreferences = () => {
    const saved = { ...preferences, accepted: true };
    localStorage.setItem("youtobia_cookies_consent", JSON.stringify(saved));
    dismissBanner();
  };

  if (!showBanner) return null;

  return (
    <div ref={bannerRef}
      className="fixed bottom-0 left-0 w-full z-50 bg-black/95 backdrop-blur-lg border-t-2 border-brand text-white shadow-2xl px-6 md:px-12 py-6 md:py-8"
      style={{ display: "none" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex gap-4 items-start max-w-3xl">
            <div className="bg-brand/10 p-3 rounded-xl border border-brand/20 shrink-0 text-brand">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif italic text-lg text-[#FF1E27] tracking-wide">Cookie Consent & Privacy Architecture</h4>
              <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-sans font-light">
                YouTobia Multimedia uses standard cookies to manage your riddle status, score tracking, ticket verification, and to speed up graphics and asset layouts.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-end shrink-0">
            <button onClick={() => setShowConfig(v => !v)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white font-mono text-xs tracking-widest px-5 py-3 rounded-lg transition-all flex items-center gap-2 cursor-pointer">
              <Settings className="w-3.5 h-3.5" />
              <span>{showConfig ? "HIDE SETTINGS" : "CUSTOMIZE"}</span>
              {showConfig ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button onClick={handleAcceptAll}
              className="bg-[#FF1E27] hover:bg-[#C90E16] text-white font-mono text-xs tracking-widest px-6 py-3 rounded-lg transition-all cursor-pointer shadow-lg shadow-brand/20 font-bold"
              onMouseEnter={e => gsap.to(e.currentTarget, { scale:1.05, duration:0.2 })}
              onMouseLeave={e => gsap.to(e.currentTarget, { scale:1, duration:0.3 })}>
              ACCEPT ALL
            </button>
          </div>
        </div>

        {/* Expandable config */}
        <div ref={configRef}
          className="overflow-hidden border-t border-white/5 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ display: "none" }}>
          {[
            { label:"1. Core Engine Tracker", desc:"Saves current score state and unique ticket registration IDs inside your browser context.", locked:true },
            { label:"2. Interactive Boosters", desc:"Speeds up canvas transitions and caches high-resolution background assets to optimize scrolling.", key:"functional" as const },
            { label:"3. Analytics Insights",  desc:"Assists YouTobia Multimedia developers in measuring competitive score timings.", key:"marketing" as const },
          ].map((cell, i) => (
            <div key={i} className="bg-neutral-950 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-serif italic text-sm text-white">{cell.label}</span>
                {cell.locked
                  ? <span className="bg-brand/10 text-brand text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">REQUIRED</span>
                  : <input type="checkbox"
                      checked={(preferences as any)[cell.key!]}
                      onChange={e => setPreferences({ ...preferences, [cell.key!]: e.target.checked })}
                      className="accent-[#FF1E27] w-4 h-4 cursor-pointer" />
                }
              </div>
              <p className="text-[11px] text-white/45 leading-relaxed font-sans font-light">{cell.desc}</p>
            </div>
          ))}
          <div className="md:col-span-3 flex justify-end">
            <button onClick={handleSavePreferences}
              className="bg-white hover:bg-neutral-200 text-black font-mono text-xs tracking-widest px-5 py-2.5 rounded-lg font-bold transition-colors cursor-pointer">
              SAVE PREFERENCES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CookieBanner;

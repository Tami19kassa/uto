import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "../lib/gsap";
import { Reveal } from "./Reveal";
import YutobiaLogo from "./YutobiaLogo";
import { Globe, Flame, Briefcase, Mail, BookOpen, Sun, Moon, ArrowUpRight } from "lucide-react";

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  gameScore: number;
  theme: string;
  onToggleTheme: () => void;
}

export const HugeHeader: React.FC<HeaderProps> = ({
  onNavigate, activeSection, gameScore, theme, onToggleTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef    = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const bar1Ref     = useRef<HTMLSpanElement>(null);
  const bar2Ref     = useRef<HTMLSpanElement>(null);
  const bar3Ref     = useRef<HTMLSpanElement>(null);
  const pillRef     = useRef<HTMLDivElement>(null);
  const pillEl      = useRef<HTMLDivElement>(null);
  const navRef      = useRef<HTMLElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const themeIconRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    { num:"01", label:"HOME",          desc:"Where digital ambition meets absolute craft.",                                    id:"home",       icon:<Globe className="w-4 h-4" /> },
    { num:"02", label:"ECOSYSTEM",     desc:"Five purpose-built sub-brands united under one bold multimedia vision.",          id:"ecosystem",  icon:<Flame className="w-4 h-4" /> },
    { num:"03", label:"ENQOQ CASH",    desc:"Our flagship playable Amharic riddle experience with real-time prizes.",          id:"enqoq-cash", icon:<Flame className="w-4 h-4" /> },
    { num:"04", label:"STUDIO & WORKS",desc:"Inside our multimedia projects, digital solutions, and creative portfolio.",      id:"studio",     icon:<Briefcase className="w-4 h-4" /> },
    { num:"05", label:"VISION",        desc:"The forward vision — Create, Stream, Educate, Inform.",                           id:"vision",     icon:<BookOpen className="w-4 h-4" /> },
    { num:"06", label:"JOURNAL & VLOGS",desc:"Immersive community log: read ancient storytelling analyses and stream our vlogs.",id:"media-hub", icon:<BookOpen className="w-4 h-4" /> },
    { num:"07", label:"CONNECT",       desc:"Let's build something beautiful. Our team is responsive and ready.",              id:"connect",    icon:<Mail className="w-4 h-4" /> },
  ];

  // ── Animate mobile nav in on mount ────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(mobileNavRef.current, {
        y: 80, opacity: 0, duration: 0.6,
        ease: "yutobia.enter", delay: 0.5,
      });
    });
    return () => ctx.revert();
  }, []);

  // ── Slide panel open/close ─────────────────────────────────────────────
  useEffect(() => {
    const panel    = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    if (isOpen) {
      gsap.set(panel, { display: "flex" });
      gsap.set(backdrop, { display: "block" });
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(panel, { x: "100%" }, { x: "0%", duration: 0.38, ease: "yutobia.enter" });
      // Stagger panel children
      const children = panel.querySelectorAll(".panel-item");
      gsap.from(children, {
        x: 30, opacity: 0, duration: 0.35,
        ease: "power3.out", stagger: 0.06, delay: 0.2,
      });
    } else {
      gsap.to(backdrop, { opacity: 0, duration: 0.25, ease: "power2.in" });
      gsap.to(panel, {
        x: "100%", duration: 0.32, ease: "yutobia.exit",
        onComplete: () => {
          gsap.set(panel, { display: "none" });
          gsap.set(backdrop, { display: "none" });
        },
      });
    }
  }, [isOpen]);

  // ── Hamburger bars animation ───────────────────────────────────────────
  useEffect(() => {
    const b1 = bar1Ref.current, b2 = bar2Ref.current, b3 = bar3Ref.current;
    if (!b1 || !b2 || !b3) return;
    if (isOpen) {
      gsap.to(b1, { rotate: 45,  y: 6.5,  duration: 0.3, ease: "power2.inOut" });
      gsap.to(b2, { opacity: 0, scaleX: 0, duration: 0.2, ease: "power2.in" });
      gsap.to(b3, { rotate: -45, y: -6.5, duration: 0.3, ease: "power2.inOut" });
    } else {
      gsap.to(b1, { rotate: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
      gsap.to(b2, { opacity: 1, scaleX: 1, duration: 0.2, ease: "power2.out" });
      gsap.to(b3, { rotate: 0, y: 0, duration: 0.3, ease: "power2.inOut" });
    }
  }, [isOpen]);

  // ── Theme icon swap ────────────────────────────────────────────────────
  useEffect(() => {
    if (themeIconRef.current) {
      gsap.fromTo(themeIconRef.current,
        { rotate: -90, opacity: 0, scale: 0.6 },
        { rotate: 0,   opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" }
      );
    }
  }, [theme]);

  // ── Desktop hover pill ────────────────────────────────────────────────
  const handleDesktopHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const nav = navRef.current;
    const pill = pillEl.current;
    if (!nav || !pill) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    gsap.to(pill, {
      left: btnRect.left - navRect.left,
      width: btnRect.width,
      opacity: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <>
      {/* ── Header bar ──────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-45 flex items-center justify-between px-4 md:px-8 py-3 bg-white/90 dark:bg-[#060606]/90 backdrop-blur-xl border-b border-neutral-200 dark:border-white/6 transition-all duration-400">

        <div className="cursor-pointer" onClick={() => onNavigate("home")}
          onMouseEnter={e => gsap.to(e.currentTarget, { scale:1.02, duration:0.2 })}
          onMouseLeave={e => gsap.to(e.currentTarget, { scale:1, duration:0.3 })}>
          <YutobiaLogo size={36} />
        </div>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden lg:flex items-center relative"
          onMouseLeave={() => gsap.to(pillEl.current, { opacity: 0, duration: 0.2 })}>
          <div ref={pillEl}
            className="absolute top-0 h-full rounded-full bg-neutral-100 dark:bg-white/10 pointer-events-none"
            style={{ opacity: 0, width: 0, left: 0 }} />
          {menuItems.map(item => (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              onMouseEnter={handleDesktopHover}
              className={`relative px-4 py-2 font-mono text-[11px] tracking-widest font-semibold transition-colors duration-300 cursor-pointer rounded-full ${
                activeSection === item.id
                  ? "text-brand"
                  : "text-neutral-500 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white"
              }`}>
              {item.label}
              {activeSection === item.id && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand" />
              )}
            </button>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button onClick={() => onNavigate("enqoq-cash")}
            className="hidden sm:flex items-center gap-2 bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand px-3 py-1.5 rounded-full text-[11px] font-mono transition-all duration-300 group"
            onMouseEnter={e => gsap.to(e.currentTarget, { scale:1.04, duration:0.2 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { scale:1,    duration:0.3 })}>
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
            <span className="hidden md:inline">Enqoq</span>
            <span className="bg-brand text-white px-2 py-0.5 rounded-full font-bold text-[10px]">{gameScore}</span>
          </button>

          <button onClick={onToggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-white/6 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white/70 transition-colors duration-300 cursor-pointer overflow-hidden"
            title={`Switch to ${theme==="dark"?"light":"dark"} mode`}>
            <div ref={themeIconRef}>
              {theme === "dark"
                ? <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                : <Moon className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />}
            </div>
          </button>

          <button onClick={() => setIsOpen(v => !v)}
            className="flex flex-col justify-center items-center w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-800 border border-neutral-700 dark:border-white/10 gap-[5px] cursor-pointer"
            aria-label={isOpen ? "Close menu" : "Open menu"}>
            <span ref={bar1Ref} className="block w-4 h-[1.5px] bg-white rounded-full origin-center" />
            <span ref={bar2Ref} className="block w-4 h-[1.5px] bg-white rounded-full" />
            <span ref={bar3Ref} className="block w-4 h-[1.5px] bg-white rounded-full origin-center" />
          </button>
        </div>
      </header>

      {/* ── Backdrop ─────────────────────────────────────────────────────── */}
      <div ref={backdropRef}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm cursor-pointer"
        style={{ display: "none" }}
        onClick={() => setIsOpen(false)} />

      {/* ── Side panel ───────────────────────────────────────────────────── */}
      <aside ref={panelRef}
        className="fixed top-0 right-0 h-full w-[300px] sm:w-[340px] z-50 flex-col bg-[#080808] border-l border-white/8 shadow-2xl overflow-hidden"
        style={{ display: "none" }}>
        <div className="absolute bottom-1/3 left-0 w-48 h-48 rounded-full bg-brand/8 blur-[60px] pointer-events-none" />

        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/6 shrink-0 panel-item">
          <YutobiaLogo size={30} />
          <button onClick={() => setIsOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 cursor-pointer transition-colors"
            onMouseEnter={e => gsap.to(e.currentTarget, { rotate:90, duration:0.2 })}
            onMouseLeave={e => gsap.to(e.currentTarget, { rotate:0,  duration:0.3 })}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          <div className="panel-item space-y-3">
            <p className="font-mono text-[9px] tracking-[0.3em] text-brand/70 uppercase">About</p>
            <p className="text-white/50 text-xs leading-relaxed font-sans font-light">
              YouTobia Multimedia is a creative agency, development firm, and content production studio based in Addis Ababa, Ethiopia.
            </p>
          </div>
          <div className="h-px bg-white/6" />
          <div className="panel-item space-y-3">
            <p className="font-mono text-[9px] tracking-[0.3em] text-brand/70 uppercase">Live Game</p>
            <button onClick={() => { setIsOpen(false); setTimeout(() => onNavigate("enqoq-cash"), 400); }}
              className="w-full flex items-center justify-between bg-brand/10 hover:bg-brand/15 border border-brand/25 rounded-xl px-4 py-3 transition-all cursor-pointer group">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                <span className="font-mono text-xs text-brand font-semibold tracking-wider">ENQOQ CASH</span>
              </div>
              <span className="bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">{gameScore} pts</span>
            </button>
          </div>
          <div className="h-px bg-white/6" />
          <div className="panel-item space-y-3">
            <p className="font-mono text-[9px] tracking-[0.3em] text-brand/70 uppercase">Contact</p>
            <div className="space-y-2 font-mono text-[11px] text-white/40">
              <div>hello@youtobiamultimedia.com</div>
              <div>Bole Atlas Road, Addis Ababa</div>
              <div>+251 912 34 5678</div>
            </div>
          </div>
          <div className="h-px bg-white/6" />
          <div className="panel-item space-y-3">
            <p className="font-mono text-[9px] tracking-[0.3em] text-brand/70 uppercase">Find Us</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label:"Telegram",    href:"https://t.me/youtobia" },
                { label:"Instagram",   href:"https://instagram.com/youtobia" },
                { label:"Twitter / X", href:"https://x.com/youtobia" },
                { label:"LinkedIn",    href:"https://linkedin.com/company/youtobia" },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                  className="flex items-center justify-between bg-white/4 hover:bg-white/8 border border-white/8 hover:border-brand/30 rounded-lg px-3 py-2.5 text-[10px] font-mono text-white/50 hover:text-white transition-all group">
                  <span>{s.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 px-6 py-4 border-t border-white/6 panel-item">
          <p className="font-mono text-[9px] text-white/20 tracking-widest">
            © {new Date().getFullYear()} YouTobia Multimedia
          </p>
        </div>
      </aside>

      {/* ── Mobile bottom nav ─────────────────────────────────────────────── */}
      <nav ref={mobileNavRef}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-44 flex lg:hidden items-center gap-1 px-3 py-2 rounded-2xl bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/40">
        {menuItems.map(item => {
          const isActive = activeSection === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl transition-colors duration-200 cursor-pointer min-w-[44px] ${
                isActive ? "text-brand" : "text-neutral-400 dark:text-white/40"
              }`}
              onMouseDown={e => gsap.to(e.currentTarget, { scale:0.88, duration:0.1 })}
              onMouseUp={e => gsap.to(e.currentTarget, { scale:1, duration:0.3, ease:"elastic.out(1,0.5)" })}>
              {isActive && (
                <span className="absolute inset-0 rounded-xl bg-brand/10 border border-brand/20" />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 font-mono text-[8px] tracking-wider leading-none truncate max-w-[52px]">
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
        <div className="w-px h-6 bg-neutral-200 dark:bg-white/10 mx-1" />
        <button onClick={() => setIsOpen(v => !v)}
          className="flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-neutral-400 dark:text-white/40 cursor-pointer min-w-[44px]">
          <div className="flex flex-col gap-[4px] items-center justify-center w-4 h-4">
            <span className="block w-3.5 h-[1.5px] bg-current rounded-full" />
            <span className="block w-3.5 h-[1.5px] bg-current rounded-full" />
            <span className="block w-3.5 h-[1.5px] bg-current rounded-full" />
          </div>
          <span className="font-mono text-[8px] tracking-wider">MORE</span>
        </button>
      </nav>
    </>
  );
};

export default HugeHeader;

import React, { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import YutobiaLogo from "./YutobiaLogo";
import {
  Globe,
  Flame,
  Briefcase,
  Mail,
  BookOpen,
  Sun,
  Moon,
  ArrowUpRight,
} from "lucide-react";

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  gameScore: number;
  theme: string;
  onToggleTheme: () => void;
}



// ─── Main component ──────────────────────────────────────────────────────────
export const HugeHeader: React.FC<HeaderProps> = ({
  onNavigate,
  activeSection,
  gameScore,
  theme,
  onToggleTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Magnetic pill indicator for desktop nav
  const pillRef = useRef<HTMLDivElement>(null);
  const pillX = useMotionValue(0);
  const pillW = useMotionValue(0);
  const smoothX = useSpring(pillX, { stiffness: 300, damping: 30 });
  const smoothW = useSpring(pillW, { stiffness: 300, damping: 30 });
  const [desktopHovered, setDesktopHovered] = useState(false);

  const menuItems = [
    {
      num: "01",
      label: "HOME",
      desc: "Where digital ambition meets absolute craft.",
      id: "home",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      num: "02",
      label: "ENQOQ CASH",
      desc: "Our flagship playable Amharic riddle experience with real-time prizes.",
      id: "enqoq-cash",
      icon: <Flame className="w-4 h-4" />,
    },
    {
      num: "03",
      label: "STUDIO & WORKS",
      desc: "Inside our multimedia projects, digital solutions, and creative portfolio.",
      id: "studio",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      num: "04",
      label: "JOURNAL & VLOGS",
      desc: "Immersive community log: read ancient storytelling analyses and stream our vlogs.",
      id: "media-hub",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      num: "05",
      label: "CONNECT",
      desc: "Let's build something beautiful. Our team is responsive and ready.",
      id: "connect",
      icon: <Mail className="w-4 h-4" />,
    },
  ];


  const handleDesktopHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const nav = pillRef.current;
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    pillX.set(btnRect.left - navRect.left);
    pillW.set(btnRect.width);
    setDesktopHovered(true);
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════════
          HEADER BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 w-full z-45 flex items-center justify-between px-4 md:px-8 py-3 bg-white/90 dark:bg-[#060606]/90 backdrop-blur-xl border-b border-neutral-200 dark:border-white/6 transition-all duration-400">

        {/* Logo */}
        <motion.div
          className="cursor-pointer"
          onClick={() => onNavigate("home")}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <YutobiaLogo size={36} />
        </motion.div>

        {/* ── Desktop pill nav ──────────────────────────────────────────── */}
        <nav
          ref={pillRef}
          className="hidden lg:flex items-center relative"
          onMouseLeave={() => setDesktopHovered(false)}
        >
          {/* Sliding hover pill */}
          <motion.div
            className="absolute top-0 h-full rounded-full bg-neutral-100 dark:bg-white/10 pointer-events-none"
            style={{ left: smoothX, width: smoothW }}
            animate={{ opacity: desktopHovered ? 1 : 0 }}
            transition={{ opacity: { duration: 0.15 } }}
          />

          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onMouseEnter={handleDesktopHover}
              className={`relative px-4 py-2 font-mono text-[11px] tracking-widest font-semibold transition-colors duration-300 cursor-pointer rounded-full ${
                activeSection === item.id
                  ? "text-brand"
                  : "text-neutral-500 dark:text-white/50 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              {item.label}
              {/* Active underline dot */}
              {activeSection === item.id && (
                <motion.span
                  layoutId="deskActiveBar"
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* ── Right-side controls ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Score pill */}
          <motion.button
            onClick={() => onNavigate("enqoq-cash")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="hidden sm:flex items-center gap-2 bg-brand/10 hover:bg-brand/20 border border-brand/20 text-brand px-3 py-1.5 rounded-full text-[11px] font-mono transition-all duration-300 group"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-ping" />
            <span className="hidden md:inline">Enqoq</span>
            <span className="bg-brand text-white px-2 py-0.5 rounded-full font-bold text-[10px] group-hover:scale-110 transition-transform">
              {gameScore}
            </span>
          </motion.button>

          {/* Theme toggle */}
          <motion.button
            onClick={onToggleTheme}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-neutral-100 dark:bg-white/6 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-white/70 transition-colors duration-300 cursor-pointer"
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-3.5 h-3.5 text-indigo-500 fill-indigo-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Hamburger — custom animated bars */}
          <motion.button
            onClick={() => setIsOpen((v) => !v)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            className="flex flex-col justify-center items-center w-10 h-10 rounded-full bg-neutral-900 dark:bg-neutral-800 border border-neutral-700 dark:border-white/10 gap-[5px] cursor-pointer group"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            id="hdr-menu-toggle"
          >
            <motion.span
              className="block w-4 h-[1.5px] bg-white rounded-full origin-center"
              animate={isOpen ? { rotate: 45, y: 6.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.span
              className="block w-4 h-[1.5px] bg-white rounded-full"
              animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-4 h-[1.5px] bg-white rounded-full origin-center"
              animate={isOpen ? { rotate: -45, y: -6.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.3, ease: [0.76, 0, 0.24, 1] }}
            />
          </motion.button>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════════
          SIDE PANEL — brand info, quick actions, socials (no nav duplication)
      ══════════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="panel-backdrop"
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.aside
              key="panel-body"
              className="fixed top-0 right-0 h-full w-[300px] sm:w-[340px] z-50 flex flex-col bg-[#080808] border-l border-white/8 shadow-2xl overflow-hidden"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Red ambient glow */}
              <div className="absolute bottom-1/3 left-0 w-48 h-48 rounded-full bg-brand/8 blur-[60px] pointer-events-none" />

              {/* Header row */}
              <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/6 shrink-0">
                <YutobiaLogo size={30} />
                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center justify-center w-8 h-8 rounded-full border border-white/15 text-white/50 hover:text-white hover:border-white/30 cursor-pointer transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </motion.button>
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

                {/* About blurb */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.35 }}
                  className="space-y-3"
                >
                  <p className="font-mono text-[9px] tracking-[0.3em] text-brand/70 uppercase">About</p>
                  <p className="text-white/50 text-xs leading-relaxed font-sans font-light">
                    YouTobia Multimedia is a creative agency, development firm, and content production studio based in Addis Ababa, Ethiopia.
                  </p>
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-white/6" />

                {/* Score & Enqoq CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.35 }}
                  className="space-y-3"
                >
                  <p className="font-mono text-[9px] tracking-[0.3em] text-brand/70 uppercase">Live Game</p>
                  <button
                    onClick={() => { setIsOpen(false); setTimeout(() => onNavigate("enqoq-cash"), 400); }}
                    className="w-full flex items-center justify-between bg-brand/10 hover:bg-brand/15 border border-brand/25 rounded-xl px-4 py-3 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-brand animate-ping" />
                      <span className="font-mono text-xs text-brand font-semibold tracking-wider">ENQOQ CASH</span>
                    </div>
                    <span className="bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-mono group-hover:scale-110 transition-transform">
                      {gameScore} pts
                    </span>
                  </button>
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-white/6" />

                {/* Contact details */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.35 }}
                  className="space-y-3"
                >
                  <p className="font-mono text-[9px] tracking-[0.3em] text-brand/70 uppercase">Contact</p>
                  <div className="space-y-2 font-mono text-[11px] text-white/40">
                    <div>hello@youtobiamultimedia.com</div>
                    <div>Bole Atlas Road, Addis Ababa</div>
                    <div>+251 912 34 5678</div>
                  </div>
                </motion.div>

                {/* Divider */}
                <div className="h-px bg-white/6" />

                {/* Social links */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.35 }}
                  className="space-y-3"
                >
                  <p className="font-mono text-[9px] tracking-[0.3em] text-brand/70 uppercase">Find Us</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Telegram", href: "https://t.me/youtobia" },
                      { label: "Instagram", href: "https://instagram.com/youtobia" },
                      { label: "Twitter / X", href: "https://x.com/youtobia" },
                      { label: "LinkedIn", href: "https://linkedin.com/company/youtobia" },
                    ].map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between bg-white/4 hover:bg-white/8 border border-white/8 hover:border-brand/30 rounded-lg px-3 py-2.5 text-[10px] font-mono text-white/50 hover:text-white transition-all duration-200 group"
                      >
                        <span>{s.label}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </div>
                </motion.div>

              </div>

              {/* Footer */}
              <div className="shrink-0 px-6 py-4 border-t border-white/6">
                <p className="font-mono text-[9px] text-white/20 tracking-widest">
                  © {new Date().getFullYear()} YouTobia Multimedia
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════════════
          MOBILE BOTTOM NAV BAR (xs → md)
          A persistent floating tab bar sits at the bottom on mobile so
          users can navigate without opening the full overlay every time.
      ══════════════════════════════════════════════════════════════════════ */}
      <motion.nav
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-44 flex lg:hidden items-center gap-1 px-3 py-2 rounded-2xl bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border border-neutral-200 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/40"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {menuItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileTap={{ scale: 0.88 }}
              className={`relative flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl transition-colors duration-200 cursor-pointer min-w-[44px] ${
                isActive
                  ? "text-brand"
                  : "text-neutral-400 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white/70"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobileActivePill"
                  className="absolute inset-0 rounded-xl bg-brand/10 border border-brand/20"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{item.icon}</span>
              <span className="relative z-10 font-mono text-[8px] tracking-wider leading-none truncate max-w-[52px]">
                {item.label.split(" ")[0]}
              </span>
            </motion.button>
          );
        })}

        {/* Divider + menu trigger */}
        <div className="w-px h-6 bg-neutral-200 dark:bg-white/10 mx-1" />
        <motion.button
          onClick={() => setIsOpen((v) => !v)}
          whileTap={{ scale: 0.88 }}
          className="flex flex-col items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-neutral-400 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white/70 cursor-pointer min-w-[44px]"
        >
          <div className="flex flex-col gap-[4px] items-center justify-center w-4 h-4">
            <motion.span
              className="block w-3.5 h-[1.5px] bg-current rounded-full"
              animate={isOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.span
              className="block w-3.5 h-[1.5px] bg-current rounded-full"
              animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.15 }}
            />
            <motion.span
              className="block w-3.5 h-[1.5px] bg-current rounded-full"
              animate={isOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.25 }}
            />
          </div>
          <span className="font-mono text-[8px] tracking-wider">MORE</span>
        </motion.button>
      </motion.nav>
    </>
  );
};

export default HugeHeader;

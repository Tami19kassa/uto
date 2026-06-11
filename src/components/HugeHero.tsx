import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, ArrowDown, ArrowUpRight } from "lucide-react";
import { InteractiveYutobiaStage } from "./InteractiveYutobiaStage";

interface HeroProps {
  onPlayDemo: () => void;
  onNavigate: (sectionId: string) => void;
  gameScore: number;
  heroVideoUrl?: string;
}

export const HugeHero: React.FC<HeroProps> = ({
  onPlayDemo,
  onNavigate,
  gameScore,
  heroVideoUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);

  const mottos = [
    "CREATIVITY · TECHNOLOGY · ENTERTAINMENT · EDUCATION",
    "FIVE PURPOSE-BUILT BRANDS · ONE BOLD VISION",
    "STREAMING · PRODUCTION · EDUCATION · INFORMATION · TRIVIA",
    "A HOLDING COMPANY UNITING THE MULTIMEDIA LANDSCAPE"
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMottoIndex((prev) => (prev + 1) % mottos.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // Split-text letter triggers
  const titleLine1 = "YOUTOBIA";
  const titleLine2 = "MULTIMEDIA";

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-white dark:bg-[#060606] overflow-hidden flex flex-col justify-center pt-28 pb-16 px-6 md:px-12 transition-colors duration-500"
      style={{
        "--x": `${mousePosition.x}%`,
        "--y": `${mousePosition.y}%`,
      } as React.CSSProperties}
    >
      {/* Background Video Layer with Professional Blending */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          key={heroVideoUrl || "default-video"}
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-[0.06] dark:opacity-[0.14] filter pointer-events-none transition-all duration-[1500ms] hue-rotate-[340deg] contrast-125 saturate-150"
          src={heroVideoUrl || "https://cdn.pixabay.com/video/2021/04/12/70860-537333552_large.mp4"}
        />
        {/* Editorial overlay filtering */}
        <div className="absolute inset-0 bg-white/20 dark:bg-[#060606]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-white/95 dark:from-[#060606] dark:via-transparent dark:to-[#060606]" />
      </div>

      {/* Dynamic Cursor Gradient Blob - Pure Designer Lighting */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-1 opacity-60 dark:opacity-40"
        animate={{
          background: `radial-gradient(1000px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255,30,39,0.04) 0%, rgba(255,94,30,0.01) 50%, transparent 100%)`
        }}
        transition={{ type: "tween", ease: "linear" }}
      />

      {/* Luxury Secondary Floating Light Orb */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full filter blur-[120px] pointer-events-none bg-[#FF1E27]/[0.03] dark:bg-[#FF1E27]/[0.06] z-1"
        animate={{
          x: (mousePosition.x - 50) * 1.8,
          y: (mousePosition.y - 50) * 1.8,
        }}
        transition={{ type: "spring", stiffness: 35, damping: 25 }}
        style={{ top: "15%", left: "20%" }}
      />

      {/* Huge Background Grid */}
      <div className="absolute inset-0 huge-grid-pattern opacity-40 pointer-events-none z-1" />

      {/* Parallax Graphic backdrop: Y */}
      <motion.div
        animate={{
          x: (mousePosition.x - 50) * 0.22,
          y: (mousePosition.y - 50) * 0.22,
        }}
        transition={{ type: "spring", stiffness: 45, damping: 20 }}
        className="absolute left-[3%] bottom-[5%] text-[#FF1E27]/[0.015] dark:text-[#FF1E27]/[0.025] font-display font-black text-[12rem] md:text-[24rem] leading-none select-none pointer-events-none z-1"
      >
        Y
      </motion.div>

      {/* Interactive Floating Micro Cosmic Elements */}
      <motion.div
        animate={{
          x: (mousePosition.x - 50) * 0.4,
          y: (mousePosition.y - 50) * -0.4,
          rotate: 360,
        }}
        transition={{ rotate: { repeat: Infinity, duration: 20, ease: "linear" }, default: { type: "spring", stiffness: 30, damping: 15 } }}
        className="absolute right-[22%] bottom-[28%] w-16 h-16 border border-dashed border-[#FF1E27]/20 dark:border-[#FF1E27]/10 rounded-full pointer-events-none z-1 hidden sm:block"
      />
      
      <motion.div
        animate={{
          x: (mousePosition.x - 50) * -0.3,
          y: (mousePosition.y - 50) * 0.3,
          rotate: -360,
        }}
        transition={{ rotate: { repeat: Infinity, duration: 30, ease: "linear" }, default: { type: "spring", stiffness: 25, damping: 15 } }}
        className="absolute left-[18%] top-[20%] w-8 h-8 bg-[#FF1E27]/[0.02] dark:bg-[#FF1E27]/5 border border-[#FF1E27]/20 dark:border-white/10 rotate-45 pointer-events-none z-1 hidden sm:block"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-between flex-1 py-4 md:py-8">
        <div className="space-y-6 md:space-y-8">
          
          {/* Subheader Badge layout combining fixed category and sliding high-tech mission */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 px-4 py-2 rounded-full font-mono text-xs tracking-widest text-[#FF1E27] font-semibold shadow-xs shrink-0 self-start transition-colors duration-500"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              <span>YOUTOBIA MULTIMEDIA P.L.C.</span>
            </motion.div>

            <div className="h-6 overflow-hidden relative min-w-[320px] self-start md:self-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentMottoIndex}
                  initial={{ y: 12, opacity: 0, filter: "blur(2px)" }}
                  animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: -12, opacity: 0, filter: "blur(2px)" }}
                  transition={{ duration: 0.4 }}
                  className="absolute left-0 top-0 text-[10px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 font-bold uppercase py-0.5"
                >
                  // {mottos[currentMottoIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Huge Brand Headline with custom kinetic spring physics & 3D character lifting */}
          <div className="space-y-2">
            <h1 className="font-display font-black text-5xl sm:text-7xl md:text-[8.5rem] lg:text-[10rem] tracking-tighter leading-[0.82] text-neutral-900 dark:text-white select-none transition-colors duration-500">
              {titleLine1.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.82, y: 35, rotateZ: -3 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateZ: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.04,
                    type: "spring",
                    stiffness: 70,
                    damping: 12,
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    y: -12,
                    color: "#FF1E27",
                    textShadow: "0 10px 25px rgba(255,30,39,0.3)",
                    transition: { type: "spring", stiffness: 350, damping: 10 }
                  }}
                  className="inline-block transition-colors duration-200 cursor-default"
                >
                  {char}
                </motion.span>
              ))}
            </h1>

            <h1 className="font-display font-black text-5xl sm:text-7xl md:text-[8.5rem] lg:text-[10rem] tracking-tighter leading-[0.82] text-neutral-900 dark:text-white select-none relative transition-colors duration-500">
              {titleLine2.split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.82, y: 35, rotateZ: 3 }}
                  animate={{ opacity: 1, scale: 1, y: 0, rotateZ: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.2 + index * 0.03,
                    type: "spring",
                    stiffness: 70,
                    damping: 12,
                  }}
                  whileHover={{ 
                    scale: 1.15,
                    y: -12,
                    color: "#FF1E27",
                    textShadow: "0 10px 25px rgba(255,30,39,0.3)",
                    transition: { type: "spring", stiffness: 350, damping: 10 }
                  }}
                  className="inline-block transition-colors duration-200 cursor-default"
                >
                  {char}
                </motion.span>
              ))}
              {/* Highlight Dot */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 1, stiffness: 200, damping: 10 }}
                className="inline-block text-brand ml-1"
              >
                .
              </motion.span>
            </h1>
          </div>

          {/* Intro Description Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="font-serif italic text-2xl md:text-4xl text-neutral-800 dark:text-neutral-200 leading-snug tracking-tight max-w-xl transition-colors duration-500">
                A bold vision uniting creativity, technology, entertainment,
                information, and education — delivered through a powerful
                ecosystem of purpose-built brands.
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed font-sans font-light max-w-xl transition-colors duration-500">
                YouTobia Multimedia P.l.C. is a holding company that unites five specialized sub-brands — <span className="text-[#FF1E27] font-semibold">EnqoqCash</span>, <span className="text-neutral-700 dark:text-neutral-300 font-semibold">QenaView</span>, <span className="text-neutral-700 dark:text-neutral-300 font-semibold">eTop Production</span>, <span className="text-neutral-700 dark:text-neutral-300 font-semibold">YentaBarsiisaa</span>, and <span className="text-neutral-700 dark:text-neutral-300 font-semibold">MirXog</span> — each designed to lead in its domain of the multimedia landscape.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onPlayDemo}
                  className="flex items-center gap-2 bg-[#FF1E27] hover:bg-brand-dark text-white font-display font-semibold select-none px-6 py-4 rounded-xl transition-all duration-300 scale-100 hover:scale-[1.03] active:scale-95 shadow-lg shadow-brand/20 cursor-pointer group"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>PLAY ENQOQ CASH DEMO</span>
                </button>
                <button
                  onClick={() => onNavigate("studio")}
                  className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 font-mono text-xs tracking-widest px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer"
                >
                  <span>EXPLORE THE ECOSYSTEM</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                </button>
              </div>
            </motion.div>

            {/* Interactive Stage — right column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:col-span-5 flex flex-col justify-center select-none"
            >
              <InteractiveYutobiaStage />
            </motion.div>
          </div>
        </div>

        {/* Design-forward Scroll cues & Meta details with live sound-like pulses */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-neutral-200 dark:border-white/10 pt-8 mt-12 font-mono text-[11px] text-neutral-400 dark:text-neutral-500 transition-colors duration-500">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1E27]"></span>
            </span>
            <span className="tracking-widest uppercase">ADDIS ABABA STUDIO // ACTIVE ACCREDITATIONS</span>
            {gameScore > 0 && (
              <span className="bg-rose-50 border border-brand/20 dark:bg-[#FF1E27]/10 dark:border-[#FF1E27]/20 text-brand px-2.5 py-1 rounded-full text-[10px] font-bold">
                Your Demo Score: {gameScore} ETH / Coins
              </span>
            )}
          </div>
          <button
            onClick={() => onNavigate("enqoq-cash")}
            className="flex items-center gap-2 hover:text-[#FF1E27] cursor-pointer group transition-colors font-semibold tracking-wide text-neutral-600 dark:text-neutral-400"
          >
            <span>EXPLORE STUDIO HIGHLIGHTS</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5 transition-transform text-[#FF1E27]" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default HugeHero;

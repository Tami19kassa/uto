import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "../lib/gsap";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

// ─── Shared SVG mark ─────────────────────────────────────────────────────────
export const YouTobiaMarkSVG = ({
  size = 48, fill = "url(#logoRedGrad)", ribbonFill = "url(#ribbonGrad)",
  baseFill = "#FF5C62", className = "", id = "logo",
}: {
  size?: number; fill?: string; ribbonFill?: string;
  baseFill?: string; className?: string; id?: string;
}) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none"
    xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id={`${id}RedGrad`} x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#FF5C62" />
        <stop offset="50%"  stopColor="#FF1E27" />
        <stop offset="100%" stopColor="#A30B11" />
      </linearGradient>
      <linearGradient id={`${id}RibbonGrad`} x1="40" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%"   stopColor="#FFFFFF" />
        <stop offset="30%"  stopColor="#FFA1A5" />
        <stop offset="100%" stopColor="#FF1E27" />
      </linearGradient>
      <filter id={`${id}Shadow`} x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#FF1E27" floodOpacity="0.2" />
      </filter>
    </defs>
    <path
      d="M 60,11 C 30,11 11,32 11,60 C 11,88 28,103 48,107 C 49,90 41,79 34,71 C 26,62 19,53 23,40 C 27,27 39,21 54,23 C 71,25 80,39 82,53 C 84,67 76,80 66,86 C 65,86 52,90 40,84 C 55,94 77,93 89,81 C 102,68 104,45 94,30 C 86,18 73,11 60,11 Z"
      fill={`url(#${id}RedGrad)`} filter={`url(#${id}Shadow)`} />
    <path
      d="M 42,32 C 40,45 42,55 48,65 C 55,75 66,78 78,74 C 92,70 102,54 96,38 C 94,33 88,40 85,45 C 77,58 64,62 55,54 C 49,49 48,38 46,30 C 45,26 43,26 42,32 Z"
      fill={`url(#${id}RibbonGrad)`} />
    <path
      d="M 48,107 C 42,108 34,103 28,100 C 24,96 16,78 18,65 C 19,64 21,68 22,72 C 26,88 36,98 48,103 C 49,105 49,106 48,107 Z"
      fill="#FF5C62" />
  </svg>
);

// ─── Full logo with GSAP animations ──────────────────────────────────────────
export const YutobiaLogo: React.FC<LogoProps> = ({
  className = "", size = 40, showText = true,
}) => {
  const glowRef    = useRef<HTMLDivElement>(null);
  const spinRef    = useRef<HTMLDivElement>(null);
  const shimRef1   = useRef<HTMLSpanElement>(null);
  const shimRef2   = useRef<HTMLSpanElement>(null);
  const wordARef   = useRef<HTMLSpanElement>(null);
  const wordBRef   = useRef<HTMLSpanElement>(null);

  const wordA = "Youtopia".split("");
  const wordB = "Multimedia".split("");

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Glow pulse
      gsap.to(glowRef.current, {
        opacity: 0.85, scale: 1.1, duration: 3.2,
        ease: "sine.inOut", yoyo: true, repeat: -1,
      });

      // Logo slow spin
      gsap.to(spinRef.current, {
        rotate: 360, duration: 22, ease: "none", repeat: -1,
      });

      // Shimmer sweeps
      gsap.to(shimRef1.current, {
        left: "110%", duration: 2.4, ease: "sine.inOut",
        repeat: -1, repeatDelay: 1.8,
      });
      gsap.to(shimRef2.current, {
        left: "110%", duration: 2.4, ease: "sine.inOut",
        repeat: -1, repeatDelay: 1.8, delay: 0.6,
      });

      // Word chars fade in
      const charsA = wordARef.current?.querySelectorAll("span") ?? [];
      const charsB = wordBRef.current?.querySelectorAll("span") ?? [];
      gsap.from(charsA, { opacity: 0, y: 6, duration: 0.4, stagger: 0.055, ease: "power2.out" });
      gsap.from(charsB, { opacity: 0,  duration: 0.35, stagger: 0.04, ease: "power2.out", delay: 0.45 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div ref={glowRef} className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle,rgba(255,30,39,0.35) 0%,transparent 70%)", opacity: 0.4 }} />
        <div ref={spinRef} className="relative z-10">
          <YouTobiaMarkSVG size={size} id="nav" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none gap-[3px]">
          <div className="relative overflow-hidden flex items-baseline">
            <span ref={wordARef}
              className="font-display font-black text-[1.35rem] tracking-tight text-[#FF1E27] leading-none">
              {wordA.map((c, i) => <span key={i} className="inline-block">{c}</span>)}
            </span>
            <span ref={shimRef1} aria-hidden
              className="pointer-events-none absolute inset-y-0 w-8"
              style={{
                left: "-2rem",
                background: "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.55) 50%,transparent 100%)",
                mixBlendMode: "screen",
              }} />
          </div>
          <div className="relative overflow-hidden flex items-baseline">
            <span ref={wordBRef}
              className="font-mono text-[0.62rem] tracking-[0.32em] text-neutral-500 dark:text-white/50 leading-none uppercase">
              {wordB.map((c, i) => <span key={i} className="inline-block">{c}</span>)}
            </span>
            <span ref={shimRef2} aria-hidden
              className="pointer-events-none absolute inset-y-0 w-6"
              style={{
                left: "-1.5rem",
                background: "linear-gradient(90deg,transparent 0%,rgba(255,30,39,0.3) 50%,transparent 100%)",
                mixBlendMode: "screen",
              }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default YutobiaLogo;

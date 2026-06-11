import React from "react";
import { motion } from "motion/react";

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

// ─── Shared SVG mark ────────────────────────────────────────────────────────
// The original YouTobia globe/ribbon mark: an outer circular flow path,
// an inner 3D ribbon representing the 'Y' core, and a bottom sweep.
export const YouTobiaMarkSVG = ({
  size = 48,
  fill = "url(#logoRedGrad)",
  ribbonFill = "url(#ribbonGrad)",
  baseFill = "#FF5C62",
  className = "",
  id = "logo",
}: {
  size?: number;
  fill?: string;
  ribbonFill?: string;
  baseFill?: string;
  className?: string;
  id?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id={`${id}RedGrad`} x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FF5C62" />
        <stop offset="50%" stopColor="#FF1E27" />
        <stop offset="100%" stopColor="#A30B11" />
      </linearGradient>
      <linearGradient id={`${id}RibbonGrad`} x1="40" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#FFA1A5" />
        <stop offset="100%" stopColor="#FF1E27" />
      </linearGradient>
      <filter id={`${id}Shadow`} x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="2" dy="4" stdDeviation="4" floodColor="#FF1E27" floodOpacity="0.2" />
      </filter>
    </defs>

    {/* Outer circular flow / globe crest */}
    <path
      d="M 60,11 C 30,11 11,32 11,60 C 11,88 28,103 48,107 C 49,90 41,79 34,71 C 26,62 19,53 23,40 C 27,27 39,21 54,23 C 71,25 80,39 82,53 C 84,67 76,80 66,86 C 65,86 52,90 40,84 C 55,94 77,93 89,81 C 102,68 104,45 94,30 C 86,18 73,11 60,11 Z"
      fill={`url(#${id}RedGrad)`}
      filter={`url(#${id}Shadow)`}
    />

    {/* 3D ribbon wrap representing the 'Y' core */}
    <path
      d="M 42,32 C 40,45 42,55 48,65 C 55,75 66,78 78,74 C 92,70 102,54 96,38 C 94,33 88,40 85,45 C 77,58 64,62 55,54 C 49,49 48,38 46,30 C 45,26 43,26 42,32 Z"
      fill={`url(#${id}RibbonGrad)`}
    />

    {/* Red base stand sweep */}
    <path
      d="M 48,107 C 42,108 34,103 28,100 C 24,96 16,78 18,65 C 19,64 21,68 22,72 C 26,88 36,98 48,103 C 49,105 49,106 48,107 Z"
      fill="#FF5C62"
    />
  </svg>
);

// ─── Full logo component ─────────────────────────────────────────────────────
export const YutobiaLogo: React.FC<LogoProps> = ({
  className = "",
  size = 40,
  showText = true,
}) => {
  const wordA = "Youtopia".split("");
  const wordB = "Multimedia".split("");

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Emblem with glow pulse + slow spin */}
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,30,39,0.35) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="relative z-10"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          <YouTobiaMarkSVG size={size} id="nav" />
        </motion.div>
      </div>

      {/* Wordmark */}
      {showText && (
        <div className="flex flex-col leading-none gap-[3px]">
          {/* "Youtopia" with shimmer sweep */}
          <div className="relative overflow-hidden flex items-baseline">
            <span className="font-display font-black text-[1.35rem] tracking-tight text-[#FF1E27] leading-none">
              {wordA.map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.055, duration: 0.4, ease: "easeOut" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-8"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)",
                mixBlendMode: "screen",
              }}
              animate={{ left: ["-2rem", "110%"] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.8, ease: "easeInOut" }}
            />
          </div>

          {/* "Multimedia" with offset shimmer */}
          <div className="relative overflow-hidden flex items-baseline">
            <span className="font-mono text-[0.62rem] tracking-[0.32em] text-neutral-500 dark:text-white/50 leading-none uppercase">
              {wordB.map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 + i * 0.04, duration: 0.35, ease: "easeOut" }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 w-6"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,30,39,0.3) 50%, transparent 100%)",
                mixBlendMode: "screen",
              }}
              animate={{ left: ["-1.5rem", "110%"] }}
              transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 1.8, delay: 0.6, ease: "easeInOut" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default YutobiaLogo;

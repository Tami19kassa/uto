import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface ThreeDScrollWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  /** Optional background image URL for the parallax 3D layer */
  bgImage?: string;
}

// Section background images keyed by id — sourced from curated Unsplash topics
// matching each YouTobia section's mood
const SECTION_BG: Record<string, string> = {
  home: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1800&q=80",
  "enqoq-cash": "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1800&q=80",
  studio: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1800&q=80",
  "media-hub": "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1800&q=80",
  connect: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1800&q=80",
};

export const ThreeDScrollWrapper: React.FC<ThreeDScrollWrapperProps> = ({
  children,
  id,
  className = "",
  bgImage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // ── Content 3D transforms ──────────────────────────────────────────────────
  const rotateXRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [14, 4, 0, -4, -14]
  );
  const yRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [70, 18, 0, -18, -50]
  );
  const scaleRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0.9, 0.97, 1, 0.97, 0.93]
  );
  const opacityRaw = useTransform(
    scrollYProgress,
    [0, 0.18, 0.38, 0.62, 0.82, 1],
    [0, 0.55, 1, 1, 0.55, 0]
  );
  const zRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [-100, -30, 0, -30, -80]
  );

  // ── Background parallax transforms (counter-rotate for depth contrast) ────
  // The BG rotates the OPPOSITE direction and further, so it feels like a
  // separate depth plane flying through space behind the content.
  const bgRotateXRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [-22, -8, 0, 8, 22]        // opposite sign to content
  );
  const bgScaleRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.18, 1.05, 1.18]         // always slightly zoomed so edges never show
  );
  const bgYRaw = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["-8%", "0%", "8%"]        // slow vertical parallax drift
  );

  const SPRING = { stiffness: 52, damping: 20, mass: 0.85 };
  const rotateX  = useSpring(rotateXRaw,  SPRING);
  const y        = useSpring(yRaw,        SPRING);
  const scale    = useSpring(scaleRaw,    SPRING);
  const opacity  = useSpring(opacityRaw,  { stiffness: 68, damping: 24 });
  const z        = useSpring(zRaw,        SPRING);
  const bgRotateX = useSpring(bgRotateXRaw, { stiffness: 38, damping: 18 });
  const bgScale   = useSpring(bgScaleRaw,   { stiffness: 38, damping: 18 });

  const resolvedBg = bgImage ?? (id ? SECTION_BG[id] : undefined);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full ${className}`}
      // Perspective wraps both the BG and content layers
      style={{ perspective: "1100px", perspectiveOrigin: "50% 42%" }}
    >
      {/* ── 3D rotating background image layer ──────────────────────────── */}
      {resolvedBg && (
        <motion.div
          aria-hidden
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            rotateX: bgRotateX,
            scale: bgScale,
            y: bgYRaw,
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
            zIndex: 0,
          }}
        >
          {/* The actual image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${resolvedBg})` }}
          />
          {/* Dark vignette so it never fights the content */}
          <div className="absolute inset-0 bg-white/82 dark:bg-[#060606]/88" />
          {/* Subtle red tint at centre for brand warmth */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,30,39,0.04) 0%, transparent 70%)",
            }}
          />
        </motion.div>
      )}

      {/* ── Main content 3D plane — glass panel sliding over the sphere ── */}
      <motion.div
        style={{
          rotateX,
          y,
          scale,
          opacity,
          z,
          transformStyle: "preserve-3d",
          transformOrigin: "center center",
          willChange: "transform, opacity",
          position: "relative",
          zIndex: 1,
          backdropFilter: "blur(0px)",
          WebkitBackdropFilter: "blur(0px)",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ThreeDScrollWrapper;

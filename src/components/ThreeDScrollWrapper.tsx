import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "motion/react";

interface ThreeDScrollWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

export const ThreeDScrollWrapper: React.FC<ThreeDScrollWrapperProps> = ({
  children,
  id,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // ── rotateX: tilts forward when entering, flat in center, tilts back when leaving
  const rotateXRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [18, 6, 0, -6, -18]
  );

  // ── Y translate: rises up into view, drifts up slightly when leaving
  const yRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [80, 20, 0, -20, -60]
  );

  // ── Scale: zooms in slightly as it enters center
  const scaleRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [0.88, 0.96, 1, 0.96, 0.92]
  );

  // ── Opacity: fades in on entry, fades out on exit
  const opacityRaw = useTransform(
    scrollYProgress,
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [0, 0.6, 1, 1, 0.6, 0]
  );

  // ── Subtle Z depth push — reinforces the 3D feel
  const zRaw = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.7, 1],
    [-120, -40, 0, -40, -100]
  );

  // Spring-smooth everything so it never feels mechanical
  const SPRING = { stiffness: 55, damping: 20, mass: 0.9 };
  const rotateX = useSpring(rotateXRaw, SPRING);
  const y       = useSpring(yRaw,       SPRING);
  const scale   = useSpring(scaleRaw,   SPRING);
  const opacity = useSpring(opacityRaw, { stiffness: 70, damping: 24 });
  const z       = useSpring(zRaw,       SPRING);

  return (
    // Perspective container — must NOT have overflow:hidden or it kills the 3D
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full ${className}`}
      style={{ perspective: "1200px", perspectiveOrigin: "50% 40%" }}
    >
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
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ThreeDScrollWrapper;

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

  const rotateXRaw = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [14, 4, 0, -4, -14]);
  const yRaw       = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [70, 18, 0, -18, -50]);
  const scaleRaw   = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [0.9, 0.97, 1, 0.97, 0.93]);
  const opacityRaw = useTransform(scrollYProgress, [0, 0.18, 0.38, 0.62, 0.82, 1], [0, 0.55, 1, 1, 0.55, 0]);
  const zRaw       = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.7, 1], [-100, -30, 0, -30, -80]);

  const SPRING = { stiffness: 52, damping: 20, mass: 0.85 };
  const rotateX = useSpring(rotateXRaw, SPRING);
  const y       = useSpring(yRaw,       SPRING);
  const scale   = useSpring(scaleRaw,   SPRING);
  const opacity = useSpring(opacityRaw, { stiffness: 68, damping: 24 });
  const z       = useSpring(zRaw,       SPRING);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full ${className}`}
      style={{ perspective: "1100px", perspectiveOrigin: "50% 42%" }}
    >
      {/* ── Main content 3D plane — glass panel sliding over the GlobalBackground ── */}
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
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ThreeDScrollWrapper;

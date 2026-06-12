import React, { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

interface ThreeDScrollWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/**
 * ThreeDScrollWrapper — GSAP 3D section entrance.
 *
 * Each section enters with:
 *   — rotateX(18deg) → 0  (flips up from the floor)
 *   — scale(0.92) → 1
 *   — opacity 0 → 1
 *   — y(50px) → 0
 *
 * All driven by expo.out — snappy and physical.
 * One-shot (once: true) so sections stay visible once entered.
 */
export const ThreeDScrollWrapper: React.FC<ThreeDScrollWrapperProps> = ({
  children,
  id,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef     = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const el = innerRef.current;
      if (!el) return;

      gsap.set(el, {
        rotateX: 18,
        scale: 0.92,
        opacity: 0,
        y: 50,
        transformOrigin: "center top",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            rotateX: 0,
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: "expo.out",
            clearProps: "rotateX,scale,y,willChange,transformStyle",
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id={id}
      className={`relative w-full ${className}`}
      style={{ perspective: "1200px", perspectiveOrigin: "50% 0%" }}
    >
      <div ref={innerRef} style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default ThreeDScrollWrapper;

import React, { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

interface ThreeDScrollWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/**
 * ThreeDScrollWrapper — GSAP ScrollTrigger section entrance.
 *
 * Strategy: the wrapper itself does NOT hide or fade the section during reading.
 * It only fires a ONE-SHOT entrance when the section scrolls into view.
 * Content inside the section handles its own per-element scroll animations.
 *
 * Entrance: section slides up + rotates in from below, settles at rest.
 * That's it — no opacity-to-zero exits so the user can always read content.
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

      // Start invisible, tilted back, slightly scaled
      gsap.set(el, {
        rotateX: 14,
        scale: 0.96,
        opacity: 0,
        y: 40,
        transformOrigin: "center top",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      });

      // Fire once when section enters viewport — snap to final state
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 88%",   // fires when the section top is 88% down the viewport
        once: true,
        onEnter: () => {
          gsap.to(el, {
            rotateX: 0,
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "expo.out",
            clearProps: "rotateX,scale,y,willChange",
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

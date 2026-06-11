import React, { useRef, useLayoutEffect, ElementType } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

/**
 * Reveal — GSAP ScrollTrigger powered entrance animation wrapper.
 * Drop-in replacement for the motion/react version.
 *
 * effect options (same names as before for backward compat):
 *  fade-up | fade-down | fade-left | fade-right
 *  fade-up-right | fade-up-left | fade-down-right | fade-down-left
 *  zoom-in | zoom-out | zoom-in-up | zoom-in-down
 *  flip-left | flip-right | flip-up | flip-down
 *  slide-up | slide-down | slide-left | slide-right
 */

type RevealEffect =
  | "fade-up" | "fade-down" | "fade-left" | "fade-right"
  | "fade-up-right" | "fade-up-left" | "fade-down-right" | "fade-down-left"
  | "zoom-in" | "zoom-out" | "zoom-in-up" | "zoom-in-down"
  | "zoom-out-left" | "zoom-out-right"
  | "flip-left" | "flip-right" | "flip-up" | "flip-down"
  | "slide-up" | "slide-down" | "slide-left" | "slide-right";

interface RevealProps {
  children: React.ReactNode;
  effect?: RevealEffect;
  delay?: number;
  duration?: number;
  easing?: string;
  distance?: number;
  once?: boolean;
  margin?: string;
  className?: string;
  as?: ElementType;
  style?: React.CSSProperties;
}

function getFromVars(effect: RevealEffect, distance: number): gsap.TweenVars {
  const d = distance;
  const map: Record<RevealEffect, gsap.TweenVars> = {
    "fade-up":           { y: d,  opacity: 0 },
    "fade-down":         { y: -d, opacity: 0 },
    "fade-left":         { x: d,  opacity: 0 },
    "fade-right":        { x: -d, opacity: 0 },
    "fade-up-right":     { y: d,  x: -d, opacity: 0 },
    "fade-up-left":      { y: d,  x: d,  opacity: 0 },
    "fade-down-right":   { y: -d, x: -d, opacity: 0 },
    "fade-down-left":    { y: -d, x: d,  opacity: 0 },
    "zoom-in":           { scale: 0.6, opacity: 0 },
    "zoom-out":          { scale: 1.4, opacity: 0 },
    "zoom-in-up":        { scale: 0.6, y: d,  opacity: 0 },
    "zoom-in-down":      { scale: 0.6, y: -d, opacity: 0 },
    "zoom-out-left":     { scale: 1.3, x: -d, opacity: 0 },
    "zoom-out-right":    { scale: 1.3, x: d,  opacity: 0 },
    "flip-left":         { rotateY: -90, x: d,  opacity: 0 },
    "flip-right":        { rotateY: 90,  x: -d, opacity: 0 },
    "flip-up":           { rotateX: 90,  y: d,  opacity: 0 },
    "flip-down":         { rotateX: -90, y: -d, opacity: 0 },
    "slide-up":          { y: d * 1.5,  opacity: 0.3 },
    "slide-down":        { y: -d * 1.5, opacity: 0.3 },
    "slide-left":        { x: d * 1.5,  opacity: 0.3 },
    "slide-right":       { x: -d * 1.5, opacity: 0.3 },
  };
  return map[effect] ?? map["fade-up"];
}

// Map our old easing names to GSAP ease strings
const EASE_MAP: Record<string, string> = {
  "ease":               "power1.inOut",
  "ease-in":            "power2.in",
  "ease-out":           "power2.out",
  "ease-in-out":        "power2.inOut",
  "ease-out-cubic":     "power3.out",
  "ease-in-cubic":      "power3.in",
  "ease-out-quart":     "power4.out",
  "ease-in-quart":      "power4.in",
  "ease-out-sine":      "sine.out",
  "ease-in-sine":       "sine.in",
  "ease-out-back":      "back.out(1.7)",
  "ease-in-back":       "back.in(1.7)",
  "linear":             "none",
};

export const Reveal: React.FC<RevealProps> = ({
  children,
  effect = "fade-up",
  delay = 0,
  duration = 0.75,
  easing = "ease-out-cubic",
  distance = 50,
  once = true,
  margin = "-80px",
  className = "",
  as: Tag = "div",
  style,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fromVars = getFromVars(effect as RevealEffect, distance);
    const ease = EASE_MAP[easing] ?? "power3.out";

    const needs3d = effect.startsWith("flip") || effect.startsWith("zoom");
    if (needs3d) {
      gsap.set(el, { transformStyle: "preserve-3d", perspective: 800 });
    }

    gsap.set(el, fromVars);

    const tween = gsap.to(el, {
      y: 0, x: 0, opacity: 1, scale: 1,
      rotateX: 0, rotateY: 0,
      duration,
      delay,
      ease,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: `top bottom${margin ? `+=${margin.replace("-", "")}` : "+=80px"}`,
      once,
      onEnter: () => tween.play(),
      onEnterBack: once ? undefined : () => tween.restart(),
    });

    return () => {
      tween.kill();
      trigger.kill();
    };
  }, [effect, delay, duration, easing, distance, once, margin]);

  const TagAny = Tag as any;
  return (
    <TagAny ref={ref} className={className} style={style}>
      {children}
    </TagAny>
  );
};

export default Reveal;

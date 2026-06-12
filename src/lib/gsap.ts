/**
 * gsap.ts — Central GSAP setup & shared animation utilities
 * Import from this file instead of directly from "gsap" to ensure
 * plugins are always registered before use.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { CustomEase } from "gsap/CustomEase";

// ─── Environment & Plugin Registration ───────────────────────────────────────
if (typeof window !== "undefined") {
  // Register all plugins once, safely guarded for isomorphic/SSR environments
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, CustomEase);

  // Custom brand easings
  CustomEase.create("yutobia.enter",   "M0,0 C0.16,1 0.3,1 1,1");          // fast-in, settle
  CustomEase.create("yutobia.exit",    "M0,0 C0.7,0 0.84,0 1,1");          // slow start, fast exit
  CustomEase.create("yutobia.reveal",  "M0,0 C0.22,0.44 0.36,1 1,1");      // editorial slide-up
  CustomEase.create("yutobia.spring",  "M0,0 C0.18,1.4 0.44,1 1,1");       // overshooting spring
  CustomEase.create("yutobia.curtain", "M0,0 C0.85,0 0.15,1 1,1");         // cinematic curtain

  // ScrollTrigger defaults
  ScrollTrigger.defaults({
    toggleActions: "play none none reverse",
    markers: false,
  });
}

// Helper using indexed access types to match GSAP's exact internal stagger definitions
function mergeStagger(
  defaults: gsap.StaggerVars,
  custom?: gsap.TweenVars["stagger"]
): gsap.TweenVars["stagger"] {
  if (custom === undefined) {
    return defaults;
  }
  // If the user passed a primitive value (like a number) or a function, return it directly
  if (typeof custom === "number" || typeof custom === "string" || typeof custom === "function") {
    return custom;
  }
  // Otherwise, safely spread the configuration objects
  return { ...defaults, ...custom };
}

// ─── Shared animation presets ────────────────────────────────────────────────

/** Fade + slide up, used for most text reveals */
export function animFadeUp(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    y: 45,
    opacity: 0,
    filter: "blur(6px)",
    duration: 0.95,
    ease: "yutobia.reveal",
    force3D: true,
    ...vars,
  });
}

/** Stagger children fade-up (pass a parent selector or NodeList) */
export function animStagger(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  const { stagger, ...restVars } = vars;

  return gsap.from(targets, {
    y: 35,
    opacity: 0,
    filter: "blur(4px)",
    duration: 0.85,
    ease: "yutobia.reveal",
    stagger: mergeStagger(
      {
        each: 0.1,
        ease: "power1.out",
      },
      stagger
    ),
    force3D: true,
    ...restVars,
  });
}

/** Character split-text spring entrance */
export function animCharsSpring(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  const { stagger, ...restVars } = vars;

  return gsap.from(targets, {
    y: "115%",
    opacity: 0,
    rotateZ: -4,
    transformOrigin: "center bottom",
    duration: 0.75,
    ease: "yutobia.spring",
    stagger: mergeStagger(
      {
        each: 0.03,
        from: "start",
      },
      stagger
    ),
    force3D: true,
    ...restVars,
  });
}

/** Clip-path reveal (bottom-to-top wipe) */
export function animClipReveal(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    clipPath: "inset(100% 0% 0% 0%)",
    duration: 1.25,
    ease: "yutobia.curtain",
    force3D: true,
    ...vars,
  });
}

/** Scale + fade card entrance */
export function animCardIn(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  const { stagger, ...restVars } = vars;

  return gsap.from(targets, {
    scale: 0.91,
    opacity: 0,
    y: 40,
    rotateX: 8,
    transformOrigin: "center bottom",
    duration: 0.85,
    ease: "yutobia.enter",
    stagger: mergeStagger(
      {
        each: 0.08,
        ease: "power1.out",
      },
      stagger
    ),
    force3D: true,
    ...restVars,
  });
}

/** Horizontal line draw (scaleX from 0) */
export function animLineDraw(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 1.35,
    ease: "yutobia.reveal",
    force3D: true,
    ...vars,
  });
}

export { gsap, ScrollTrigger };
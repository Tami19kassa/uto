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

// Register all plugins once
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, TextPlugin, CustomEase);

// ─── Custom brand easings ────────────────────────────────────────────────────
CustomEase.create("yutobia.enter",   "M0,0 C0.16,1 0.3,1 1,1");          // fast-in, settle
CustomEase.create("yutobia.exit",    "M0,0 C0.7,0 0.84,0 1,1");          // slow start, fast exit
CustomEase.create("yutobia.reveal",  "M0,0 C0.22,0.44 0.36,1 1,1");      // editorial slide-up
CustomEase.create("yutobia.spring",  "M0,0 C0.18,1.4 0.44,1 1,1");       // overshooting spring
CustomEase.create("yutobia.curtain", "M0,0 C0.85,0 0.15,1 1,1");         // cinematic curtain

// ─── ScrollTrigger defaults ──────────────────────────────────────────────────
ScrollTrigger.defaults({
  toggleActions: "play none none reverse",
  markers: false,
});

// ─── Shared animation presets ────────────────────────────────────────────────

/** Fade + slide up, used for most text reveals */
export function animFadeUp(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    y: 60,
    opacity: 0,
    duration: 0.9,
    ease: "yutobia.reveal",
    ...vars,
  });
}

/** Stagger children fade-up (pass a parent selector or NodeList) */
export function animStagger(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    y: 40,
    opacity: 0,
    duration: 0.7,
    ease: "yutobia.reveal",
    stagger: 0.12,
    ...vars,
  });
}

/** Character split-text spring entrance */
export function animCharsSpring(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    y: "110%",
    opacity: 0,
    rotateZ: -4,
    duration: 0.65,
    ease: "yutobia.spring",
    stagger: 0.035,
    ...vars,
  });
}

/** Clip-path reveal (bottom-to-top wipe) */
export function animClipReveal(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    clipPath: "inset(100% 0% 0% 0%)",
    duration: 1.0,
    ease: "yutobia.curtain",
    ...vars,
  });
}

/** Scale + fade card entrance */
export function animCardIn(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    scale: 0.88,
    opacity: 0,
    y: 30,
    duration: 0.75,
    ease: "yutobia.enter",
    stagger: 0.1,
    ...vars,
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
    duration: 1.2,
    ease: "yutobia.reveal",
    ...vars,
  });
}

export { gsap, ScrollTrigger };

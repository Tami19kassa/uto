/**
 * scrollAnimations.ts
 * Advanced GSAP ScrollTrigger animation patterns for YouTobia.
 * Every animation here is designed to be visible and cinematic.
 */
import { gsap, ScrollTrigger } from "./gsap";

// Safe helper to normalize and merge ScrollTrigger configurations
function getScrollTriggerConfig(
  defaultTrigger: Element,
  customTrigger?: gsap.DOMTarget | ScrollTrigger.Vars,
  overrides?: Partial<ScrollTrigger.Vars>
): ScrollTrigger.Vars {
  const base: ScrollTrigger.Vars = {
    trigger: defaultTrigger,
    ...overrides,
  };

  if (!customTrigger) {
    return base;
  }

  // If customTrigger is an element or a string selector, assign it as the trigger
  if (typeof customTrigger === "string" || (typeof Element !== "undefined" && customTrigger instanceof Element)) {
    return { ...base, trigger: customTrigger };
  }

  // If it's an object, merge it safely
  return { ...base, ...customTrigger };
}

// ─── Horizontal marquee / text ticker ────────────────────────────────────────
export function createMarquee(track: HTMLElement, speed = 40) {
  if (typeof window === "undefined" || !track) return;

  const items = Array.from(track.children) as HTMLElement[];
  if (!items.length) return;

  let totalW = items.reduce((acc, el) => acc + el.offsetWidth, 0);

  gsap.set(track, { 
    display: "flex", 
    width: totalW * 2,
    willChange: "transform",
    force3D: true 
  });

  items.forEach(item => {
    const clone = item.cloneNode(true) as HTMLElement;
    track.appendChild(clone);
  });

  const tween = gsap.to(track, {
    x: -totalW,
    duration: speed,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalW),
    },
  });

  // Accurate layout adjustments using ResizeObserver
  let resizeObserver: ResizeObserver | null = null;
  if (typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(() => {
      totalW = items.reduce((acc, el) => acc + el.offsetWidth, 0);
      gsap.set(track, { width: totalW * 2 });
      tween.invalidate();
    });
    resizeObserver.observe(track);
  }

  return Object.assign(tween, {
    killMarquee: () => {
      tween.kill();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    }
  });
}

// ─── Staggered word reveal (split by word) ────────────────────────────────────
export function revealWords(el: HTMLElement, trigger: Element, vars: gsap.TweenVars = {}) {
  if (!el) return;
  const text = el.textContent || "";
  
  el.innerHTML = text
    .split(/\s+/)
    .map(w => {
      if (!w) return "";
      return `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;padding-bottom:0.1em;margin-right:0.25em;">
                 <span class="word-inner" style="display:inline-block;will-change:transform">${w}</span>
               </span>`;
    })
    .join("");

  const inners = el.querySelectorAll(".word-inner");
  gsap.set(inners, { force3D: true });

  const { scrollTrigger, ...restVars } = vars;

  return gsap.from(inners, {
    y: "110%",
    rotateX: -15,
    transformOrigin: "bottom center",
    duration: 0.85,
    ease: "power4.out",
    stagger: 0.04,
    scrollTrigger: getScrollTriggerConfig(trigger, scrollTrigger, {
      start: "top 85%",
      toggleActions: "play none none reverse",
    }),
    ...restVars,
  });
}

// ─── Clip-path wipe reveal (cinematic curtain) ────────────────────────────────
export function clipReveal(
  targets: gsap.TweenTarget,
  trigger: Element,
  direction: "up" | "down" | "left" | "right" = "up",
  vars: gsap.TweenVars = {}
) {
  const fromMap = {
    up:    "inset(100% 0% 0% 0%)",
    down:  "inset(0% 0% 100% 0%)",
    left:  "inset(0% 100% 0% 0%)",
    right: "inset(0% 0% 0% 100%)",
  };

  const { scrollTrigger, ...restVars } = vars;

  gsap.set(targets, { willChange: "clip-path" });

  return gsap.from(targets, {
    clipPath: fromMap[direction],
    duration: 1.25,
    ease: "power4.inOut",
    stagger: 0.1,
    scrollTrigger: getScrollTriggerConfig(trigger, scrollTrigger, {
      start: "top 80%",
      toggleActions: "play none none reverse",
    }),
    ...restVars,
  });
}

// ─── Counter animate (number ticking up) ─────────────────────────────────────
export function animateCounter(el: HTMLElement, target: number, trigger: Element) {
  if (!el) return;
  const obj = { val: 0 };
  const formatter = new Intl.NumberFormat(
    typeof navigator !== "undefined" ? navigator.language : "en-US"
  );

  return gsap.to(obj, {
    val: target,
    duration: 1.8,
    ease: "power3.out",
    onUpdate: () => { 
      el.textContent = formatter.format(Math.round(obj.val)); 
    },
    scrollTrigger: {
      trigger,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
  });
}

// ─── Parallax layer (scroll speed offset) ────────────────────────────────────
export function parallaxLayer(el: HTMLElement, speed = 0.3) {
  if (!el) return;
  const targetPercent = speed * -100;

  return gsap.to(el, {
    yPercent: targetPercent,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 0.5,
    },
  });
}

// ─── Horizontal scroll-driven slide (for text lines) ─────────────────────────
export function slideOnScroll(
  el: HTMLElement,
  fromX: number,
  trigger: Element,
  vars: gsap.TweenVars = {}
) {
  const { scrollTrigger, ...restVars } = vars;

  return gsap.from(el, {
    x: fromX,
    opacity: 0,
    filter: "blur(8px)",
    duration: 1.2,
    ease: "power4.out",
    force3D: true,
    scrollTrigger: getScrollTriggerConfig(trigger, scrollTrigger, {
      start: "top 85%",
      toggleActions: "play none none reverse",
    }),
    ...restVars,
  });
}

// ─── Scale burst (cards pop into view) ───────────────────────────────────────
export function scaleBurst(
  targets: gsap.TweenTarget,
  trigger: Element,
  vars: gsap.TweenVars = {}
) {
  const { scrollTrigger, ...restVars } = vars;

  return gsap.from(targets, {
    scale: 0.82,
    opacity: 0,
    y: 35,
    filter: "blur(4px)",
    duration: 0.95,
    ease: "back.out(1.2)",
    stagger: { 
      amount: 0.4, 
      from: "start",
      ease: "power2.out"
    },
    force3D: true,
    scrollTrigger: getScrollTriggerConfig(trigger, scrollTrigger, {
      start: "top 85%",
      toggleActions: "play none none reverse",
    }),
    ...restVars,
  });
}

// ─── Magnetic hover (GSAP-powered, no motion/react) ──────────────────────────
export function magneticHover(el: HTMLElement, strength = 0.35): () => void {
  if (typeof window === "undefined" || !el) return () => {};

  const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power2.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });

  const handleMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    
    xTo((e.clientX - cx) * strength);
    yTo((e.clientY - cy) * strength);
  };

  const handleLeave = () => {
    gsap.to(el, { 
      x: 0, 
      y: 0, 
      duration: 0.8, 
      ease: "elastic.out(1, 0.45)" 
    });
  };

  el.addEventListener("mousemove", handleMove, { passive: true });
  el.addEventListener("mouseleave", handleLeave, { passive: true });

  return () => {
    el.removeEventListener("mousemove", handleMove);
    el.removeEventListener("mouseleave", handleLeave);
  };
}

// ─── Scrub-driven horizontal text drift ──────────────────────────────────────
export function scrubDrift(el: HTMLElement, distance = 80, reverse = false) {
  if (!el) return;
  return gsap.to(el, {
    x: reverse ? -distance : distance,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.2,
    },
  });
}

// ─── Line draw (SVG path or div border) ──────────────────────────────────────
export function drawLine(el: HTMLElement, trigger: Element, vars: gsap.TweenVars = {}) {
  const { scrollTrigger, ...restVars } = vars;
  
  // Safe detection of vector elements that support path measurements
  const isSVGPath = typeof (el as any).getTotalLength === "function";

  if (isSVGPath) {
    const length = (el as any).getTotalLength();
    gsap.set(el, { 
      strokeDasharray: length, 
      strokeDashoffset: length 
    });

    return gsap.to(el, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: "power3.inOut",
      scrollTrigger: getScrollTriggerConfig(trigger, scrollTrigger, {
        start: "top 88%",
        toggleActions: "play none none reverse",
      }),
      ...restVars,
    });
  }

  return gsap.from(el, {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 1.5,
    ease: "power4.out",
    scrollTrigger: getScrollTriggerConfig(trigger, scrollTrigger, {
      start: "top 88%",
      toggleActions: "play none none reverse",
    }),
    ...restVars,
  });
}
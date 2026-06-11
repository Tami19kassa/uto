/**
 * scrollAnimations.ts
 * Advanced GSAP ScrollTrigger animation patterns for YouTobia.
 * Every animation here is designed to be visible and cinematic.
 */
import { gsap, ScrollTrigger } from "./gsap";

// ─── Horizontal marquee / text ticker ────────────────────────────────────────
export function createMarquee(track: HTMLElement, speed = 40) {
  const items = Array.from(track.children) as HTMLElement[];
  if (!items.length) return;
  const totalW = items.reduce((acc, el) => acc + el.offsetWidth, 0);

  gsap.set(track, { width: totalW * 2 });
  // Duplicate for seamless loop
  items.forEach(item => {
    const clone = item.cloneNode(true) as HTMLElement;
    track.appendChild(clone);
  });

  return gsap.to(track, {
    x: -totalW,
    duration: speed,
    ease: "none",
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => parseFloat(x) % totalW),
    },
  });
}

// ─── Staggered word reveal (split by word) ────────────────────────────────────
export function revealWords(el: HTMLElement, trigger: Element, vars: gsap.TweenVars = {}) {
  const text = el.textContent || "";
  el.innerHTML = text
    .split(" ")
    .map(w => `<span style="display:inline-block;overflow:hidden;vertical-align:bottom">
                 <span class="word-inner" style="display:inline-block">${w}&nbsp;</span>
               </span>`)
    .join("");

  const inners = el.querySelectorAll(".word-inner");
  return gsap.from(inners, {
    y: "105%",
    rotateZ: 2,
    duration: 0.7,
    ease: "expo.out",
    stagger: 0.06,
    scrollTrigger: {
      trigger,
      start: "top 82%",
      toggleActions: "play none none reverse",
    },
    ...vars,
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

  return gsap.from(targets, {
    clipPath: fromMap[direction],
    duration: 1.1,
    ease: "expo.inOut",
    stagger: 0.12,
    scrollTrigger: {
      trigger,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
    ...vars,
  });
}

// ─── Counter animate (number ticking up) ─────────────────────────────────────
export function animateCounter(el: HTMLElement, target: number, trigger: Element) {
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: target,
    duration: 2,
    ease: "power2.out",
    onUpdate: () => { el.textContent = Math.round(obj.val).toString(); },
    scrollTrigger: {
      trigger,
      start: "top 80%",
      toggleActions: "play none none reverse",
    },
  });
}

// ─── Parallax layer (scroll speed offset) ────────────────────────────────────
export function parallaxLayer(el: HTMLElement, speed = 0.3) {
  return gsap.to(el, {
    y: () => el.offsetHeight * speed * -1,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
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
  return gsap.from(el, {
    x: fromX,
    opacity: 0,
    duration: 1.0,
    ease: "expo.out",
    scrollTrigger: {
      trigger,
      start: "top 82%",
      toggleActions: "play none none reverse",
    },
    ...vars,
  });
}

// ─── Scale burst (cards pop into view) ───────────────────────────────────────
export function scaleBurst(
  targets: gsap.TweenTarget,
  trigger: Element,
  vars: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    scale: 0.75,
    opacity: 0,
    y: 50,
    duration: 0.85,
    ease: "back.out(1.4)",
    stagger: { amount: 0.5, from: "start" },
    scrollTrigger: {
      trigger,
      start: "top 82%",
      toggleActions: "play none none reverse",
    },
    ...vars,
  });
}

// ─── Magnetic hover (GSAP-powered, no motion/react) ──────────────────────────
export function magneticHover(el: HTMLElement, strength = 0.35) {
  const handleMove = (e: MouseEvent) => {
    const rect = el.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    gsap.to(el, {
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
      duration: 0.4,
      ease: "power2.out",
    });
  };
  const handleLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
  };
  el.addEventListener("mousemove", handleMove);
  el.addEventListener("mouseleave", handleLeave);
  return () => {
    el.removeEventListener("mousemove", handleMove);
    el.removeEventListener("mouseleave", handleLeave);
  };
}

// ─── Scrub-driven horizontal text drift ──────────────────────────────────────
export function scrubDrift(el: HTMLElement, distance = 80, reverse = false) {
  return gsap.to(el, {
    x: reverse ? -distance : distance,
    ease: "none",
    scrollTrigger: {
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: 1.5,
    },
  });
}

// ─── Line draw (SVG path or div border) ──────────────────────────────────────
export function drawLine(el: HTMLElement, trigger: Element, vars: gsap.TweenVars = {}) {
  return gsap.from(el, {
    scaleX: 0,
    transformOrigin: "left center",
    duration: 1.4,
    ease: "expo.out",
    scrollTrigger: {
      trigger,
      start: "top 85%",
      toggleActions: "play none none reverse",
    },
    ...vars,
  });
}

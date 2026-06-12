import React, { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

/**
 * PageTransition — 4 rotating variants
 *
 * Variant 0 — CURTAIN   : top + bottom panels slam shut, split open
 * Variant 1 — BLADE     : 6 vertical strips zip closed staggered, then open
 * Variant 2 — REVEAL    : solid fill sweeps from left, then wipes right
 * Variant 3 — IRIS      : circle expands from center, then shrinks away
 *
 * Each section gets the next variant in rotation.
 */

const SECTIONS = [
  { id: "ecosystem",  label: "THE ECOSYSTEM", num: "02" },
  { id: "enqoq-cash", label: "ENQOQ CASH",    num: "03" },
  { id: "studio",     label: "STUDIO",         num: "04" },
  { id: "vision",     label: "VISION",         num: "05" },
  { id: "media-hub",  label: "JOURNAL",        num: "06" },
  { id: "connect",    label: "CONNECT",        num: "07" },
];

const BLADE_COUNT = 6;

export const PageTransition: React.FC = () => {
  // ── Curtain refs ──────────────────────────────────────────────────────
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBotRef = useRef<HTMLDivElement>(null);

  // ── Blade refs ────────────────────────────────────────────────────────
  const bladeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Reveal ref ────────────────────────────────────────────────────────
  const revealRef = useRef<HTMLDivElement>(null);

  // ── Iris ref ──────────────────────────────────────────────────────────
  const irisRef = useRef<HTMLDivElement>(null);

  // ── Shared label refs ─────────────────────────────────────────────────
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const cTop   = curtainTopRef.current;
    const cBot   = curtainBotRef.current;
    const reveal = revealRef.current;
    const iris   = irisRef.current;
    if (!cTop || !cBot || !reveal || !iris) return;

    // Park everything off-screen / hidden
    gsap.set(cTop,  { yPercent: -100 });
    gsap.set(cBot,  { yPercent:  100 });
    gsap.set(reveal, { xPercent: -100 });
    gsap.set(iris,  { scale: 0, opacity: 1 });
    bladeRefs.current.forEach(b => b && gsap.set(b, { yPercent: -100 }));
    labelRefs.current.forEach(l => l && gsap.set(l, { opacity: 0 }));

    // ── Helpers ───────────────────────────────────────────────────────────
    const showLabel = (idx: number, text: string, num: string, direction: number) => {
      const el = labelRefs.current[idx];
      if (!el) return;
      el.innerHTML = `<span class="block font-mono text-[11px] tracking-[0.4em] text-brand/70 mb-2">${num}</span>
                      <span class="block font-display font-black text-[clamp(2rem,7vw,5.5rem)] tracking-tighter text-white">${text}</span>`;
      gsap.fromTo(el,
        { opacity: 0, y: direction * 20 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power3.out" }
      );
    };

    const hideLabel = (idx: number) => {
      const el = labelRefs.current[idx];
      if (!el) return;
      gsap.to(el, { opacity: 0, duration: 0.15, ease: "power2.in" });
    };

    // ── Variant 0: CURTAIN ────────────────────────────────────────────────
    const runCurtain = (label: string, num: string, dir: number) => {
      const tl = gsap.timeline();
      tl.to([cTop, cBot], { yPercent: 0, duration: 0.38, ease: "power4.inOut" }, 0);
      tl.add(() => showLabel(0, label, num, dir), 0.35);
      tl.to({}, { duration: 0.12 });
      tl.add(() => hideLabel(0));
      tl.to(cTop, { yPercent: -100, duration: 0.45, ease: "power4.inOut" });
      tl.to(cBot, { yPercent:  100, duration: 0.45, ease: "power4.inOut" }, "<");
    };

    // ── Variant 1: BLADE ──────────────────────────────────────────────────
    const runBlade = (label: string, num: string, dir: number) => {
      const blades = bladeRefs.current.filter(Boolean) as HTMLDivElement[];
      const tl = gsap.timeline();
      // Close: blades drop down from top, staggered left→right
      tl.to(blades, {
        yPercent: 0,
        duration: 0.32,
        ease: "power4.inOut",
        stagger: { each: 0.045, from: "start" },
      });
      tl.add(() => showLabel(1, label, num, dir), 0.32);
      tl.to({}, { duration: 0.1 });
      tl.add(() => hideLabel(1));
      // Open: blades fly back up staggered right→left
      tl.to(blades, {
        yPercent: -100,
        duration: 0.38,
        ease: "power4.inOut",
        stagger: { each: 0.04, from: "end" },
      });
    };

    // ── Variant 2: REVEAL ─────────────────────────────────────────────────
    const runReveal = (label: string, num: string, dir: number) => {
      const tl = gsap.timeline();
      // Fill from left
      tl.to(reveal, {
        xPercent: 0,
        duration: 0.42,
        ease: "expo.inOut",
      });
      tl.add(() => showLabel(2, label, num, dir));
      tl.to({}, { duration: 0.1 });
      tl.add(() => hideLabel(2));
      // Wipe out to right
      tl.to(reveal, {
        xPercent: 100,
        duration: 0.42,
        ease: "expo.inOut",
        onComplete: () => gsap.set(reveal, { xPercent: -100 }),
      });
    };

    // ── Variant 3: IRIS ───────────────────────────────────────────────────
    const runIris = (label: string, num: string, dir: number) => {
      const tl = gsap.timeline();
      gsap.set(iris, { scale: 0, opacity: 1 });
      tl.to(iris, {
        scale: 2.2,
        duration: 0.5,
        ease: "power3.inOut",
      });
      tl.add(() => showLabel(3, label, num, dir), 0.3);
      tl.to({}, { duration: 0.08 });
      tl.add(() => hideLabel(3));
      tl.to(iris, {
        scale: 0,
        duration: 0.45,
        ease: "power3.inOut",
        onComplete: () => gsap.set(iris, { scale: 0 }),
      });
    };

    // ── Route to variant by section index ─────────────────────────────────
    const RUNNERS = [runCurtain, runBlade, runReveal, runIris, runCurtain, runBlade];

    const triggers: ScrollTrigger[] = [];

    const setup = setTimeout(() => {
      SECTIONS.forEach((sec, i) => {
        const el = document.getElementById(sec.id);
        if (!el) return;
        const run = RUNNERS[i % RUNNERS.length];
        const t = ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          onEnter:     () => run(sec.label, sec.num,  1),
          onLeaveBack: () => run(sec.label, sec.num, -1),
        });
        triggers.push(t);
      });
    }, 800);

    return () => {
      clearTimeout(setup);
      triggers.forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none select-none" style={{ zIndex: 9999 }}>

      {/* ── CURTAIN — top panel ──────────────────────────────────────────── */}
      <div
        ref={curtainTopRef}
        className="absolute left-0 top-0 w-full h-1/2 bg-neutral-950 flex items-end justify-center"
        style={{ borderBottom: "1px solid rgba(255,30,39,0.35)" }}
      >
        <span ref={el => { labelRefs.current[0] = el; }} className="pb-6 text-center" />
      </div>

      {/* ── CURTAIN — bottom panel ───────────────────────────────────────── */}
      <div
        ref={curtainBotRef}
        className="absolute left-0 bottom-0 w-full h-1/2 bg-neutral-950 flex items-start justify-center"
        style={{ borderTop: "1px solid rgba(255,30,39,0.35)" }}
      >
        <span className="pt-6" />
      </div>

      {/* ── BLADE — vertical strips ──────────────────────────────────────── */}
      {Array.from({ length: BLADE_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={el => { bladeRefs.current[i] = el; }}
          className="absolute top-0 h-full bg-neutral-950"
          style={{
            left:  `${(i / BLADE_COUNT) * 100}%`,
            width: `${100 / BLADE_COUNT + 0.5}%`, // +0.5% to avoid pixel gaps
            borderRight: i < BLADE_COUNT - 1 ? "1px solid rgba(255,30,39,0.2)" : "none",
          }}
        >
          {/* Label only in center blade */}
          {i === Math.floor(BLADE_COUNT / 2) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span ref={el => { labelRefs.current[1] = el; }} className="text-center px-4" />
            </div>
          )}
        </div>
      ))}

      {/* ── REVEAL — horizontal wipe ─────────────────────────────────────── */}
      <div
        ref={revealRef}
        className="absolute inset-0 bg-[#FF1E27] flex items-center justify-center"
      >
        <span ref={el => { labelRefs.current[2] = el; }} className="text-center px-8" />
      </div>

      {/* ── IRIS — radial circle from center ─────────────────────────────── */}
      <div
        ref={irisRef}
        className="absolute rounded-full bg-neutral-950 flex items-center justify-center"
        style={{
          /* size = diagonal of viewport so when scale=2.2 it covers all corners */
          width:  "100vmax",
          height: "100vmax",
          left:   "50%",
          top:    "50%",
          transform: "translate(-50%, -50%) scale(0)",
          border: "2px solid rgba(255,30,39,0.5)",
        }}
      >
        <span ref={el => { labelRefs.current[3] = el; }} className="text-center px-8" />
      </div>

    </div>
  );
};

export default PageTransition;

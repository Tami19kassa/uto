import React, { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { revealWords, scaleBurst, scrubDrift, drawLine, clipReveal } from "../lib/scrollAnimations";
import { SectionBackground } from "./SectionBackground";

const PILLARS = [
  { word: "CREATE",  desc: "Original, high-quality multimedia content.",        num: "01" },
  { word: "STREAM",  desc: "Accessible, immersive viewing experiences.",         num: "02" },
  { word: "EDUCATE", desc: "Empower learners at every level.",                   num: "03" },
  { word: "INFORM",  desc: "Trusted insights for the multimedia world.",         num: "04" },
];

export const VisionSection: React.FC = () => {
  const sectionRef  = useRef<HTMLElement>(null);
  const headerRef   = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef     = useRef<HTMLParagraphElement>(null);
  const pillarsRef  = useRef<(HTMLDivElement | null)[]>([]);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const driftRef    = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current!;

      // Badge/label clip wipe
      if (headerRef.current) {
        clipReveal(headerRef.current.querySelector("span"), headerRef.current, "left");
      }

      // Word-by-word headline reveal
      if (headlineRef.current) revealWords(headlineRef.current, section, { duration: 0.9 });

      // Desc fade from right
      if (descRef.current) {
        gsap.from(descRef.current, {
          x: 60, opacity: 0, duration: 0.9, ease: "expo.out", delay: 0.2,
          scrollTrigger: { trigger: section, start: "top 72%", toggleActions: "play none none reverse" },
        });
      }

      // Scrub ghost text drift
      if (driftRef.current) scrubDrift(driftRef.current, 120, false);

      // Pillar cards stagger in
      pillarsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          opacity: 0, rotateX: 90, y: 40,
          transformOrigin: "center bottom",
          transformStyle: "preserve-3d",
          duration: 0.75, ease: "expo.out",
          delay: i * 0.14,
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
        });
        const handleEnter = () => gsap.to(card, { y:-6, duration:0.3, ease:"power2.out" });
        const handleLeave = () => gsap.to(card, { y:0,  duration:0.5, ease:"elastic.out(1,0.5)" });
        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mouseleave", handleLeave);
      });

      // Line draw
      if (lineRef.current) drawLine(lineRef.current, bottomRef.current!);

      // Bottom bar fade
      if (bottomRef.current) {
        gsap.from(bottomRef.current, {
          opacity: 0, duration: 0.8,
          scrollTrigger: { trigger: bottomRef.current, start: "top 85%", toggleActions: "play none none reverse" },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="vision"
      className="relative bg-neutral-950 overflow-hidden py-28 md:py-40 border-t border-white/8"
    >
      <SectionBackground variant="vision" />

      {/* Scrub drifting ghost text */}
      <div ref={driftRef}
        className="absolute top-1/2 -translate-y-1/2 left-0 font-display font-black text-[22vw] leading-none text-white/[0.02] whitespace-nowrap select-none pointer-events-none">
        VISION
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 55% at 50% 55%,rgba(255,30,39,0.05) 0%,transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-20">

        {/* Header */}
        <div ref={headerRef} className="max-w-3xl space-y-6">
          <span className="font-mono text-[10px] tracking-widest text-brand/70 font-semibold uppercase">
            THE VISION FORWARD
          </span>
          <h2 ref={headlineRef}
            className="font-serif italic text-4xl sm:text-6xl text-white tracking-tight leading-[1.05]">
            To become a{" "}
            <span className="text-brand font-display font-black tracking-tighter uppercase not-italic">
              leading force
            </span>{" "}
            in the multimedia industry.
          </h2>
          <p ref={descRef}
            className="text-white/70 text-base leading-relaxed font-sans font-light max-w-2xl">
            By bringing together creativity, technology, Entertainment, Information, and education
            to deliver exceptional content, innovative tools, and trusted information.
          </p>
        </div>

        {/* Four pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, i) => (
            <div
              key={i}
              ref={el => { pillarsRef.current[i] = el; }}
              className="relative bg-white/4 border border-white/10 rounded-2xl p-8 space-y-4 overflow-hidden group hover:border-brand/40 hover:bg-white/6 transition-all duration-300 cursor-default"
            >
              {/* Ghost number */}
              <div className="absolute -right-3 -bottom-4 font-display font-black text-[6rem] leading-none text-white/3 select-none pointer-events-none group-hover:text-brand/5 transition-colors">
                {p.num}
              </div>
              {/* Top accent line — animated via CSS hover, no JS needed here */}
              <div className="absolute top-0 left-0 right-0 h-px bg-brand/0 group-hover:bg-brand/60 transition-all duration-500" />
              <span className="font-mono text-[10px] tracking-widest text-brand/80 font-semibold">{`PILLAR ${p.num}`}</span>
              <h3 className="font-display font-black text-3xl text-white tracking-tight group-hover:text-brand transition-colors duration-300">
                {p.word}
              </h3>
              <p className="text-white/65 text-sm leading-relaxed font-sans font-light">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom brand statement */}
        <div ref={bottomRef} className="border-t border-white/8 pt-12">
          {/* Animated rule */}
          <div ref={lineRef} className="h-px w-full bg-white/8 mb-12" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="font-mono text-[10px] tracking-[0.3em] text-white/25 uppercase">
              © {new Date().getFullYear()} YouTobia Multimedia P.l.C. · Addis Ababa, Ethiopia
            </p>
            <div className="flex items-center gap-6">
              {["QenaView","eTop","YentaBarsiisaa","MirXog","EnqoqCash"].map(b => (
                <span key={b} className="font-mono text-[9px] tracking-widest text-white/20 hover:text-brand/60 transition-colors cursor-default">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default VisionSection;

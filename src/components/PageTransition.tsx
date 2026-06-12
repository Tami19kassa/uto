import React, { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

/**
 * PageTransition
 *
 * A full-screen GSAP curtain that fires between every section.
 * Two panels (top + bottom) slam shut from both edges, hold for 80ms,
 * then split open revealing the new section.
 *
 * The curtain contains the brand mark + section name so the transition
 * itself is content — not just a flash.
 */

const SECTIONS = [
  { id: "ecosystem",  label: "THE ECOSYSTEM",  num: "02" },
  { id: "enqoq-cash", label: "ENQOQ CASH",     num: "03" },
  { id: "studio",     label: "STUDIO",          num: "04" },
  { id: "vision",     label: "VISION",          num: "05" },
  { id: "media-hub",  label: "JOURNAL",         num: "06" },
  { id: "connect",    label: "CONNECT",         num: "07" },
];

export const PageTransition: React.FC = () => {
  const topRef    = useRef<HTMLDivElement>(null);
  const botRef    = useRef<HTMLDivElement>(null);
  const labelRef  = useRef<HTMLDivElement>(null);
  const numRef    = useRef<HTMLSpanElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const top   = topRef.current;
    const bot   = botRef.current;
    const label = labelRef.current;
    const num   = numRef.current;
    const line  = lineRef.current;
    if (!top || !bot || !label || !num || !line) return;

    // Park curtains off-screen
    gsap.set(top, { yPercent: -100 });
    gsap.set(bot, { yPercent:  100 });
    gsap.set([label, num, line], { opacity: 0 });

    const triggers: ScrollTrigger[] = [];

    const fire = (sectionLabel: string, sectionNum: string, direction: 1 | -1) => {
      // Update label text before curtain opens
      if (label) label.textContent = sectionLabel;
      if (num)   num.textContent   = sectionNum;

      const tl = gsap.timeline();

      // Curtain CLOSES (panels slam in from top+bottom)
      tl.to(top, {
        yPercent: 0,
        duration: 0.42,
        ease: "power4.inOut",
      }, 0);
      tl.to(bot, {
        yPercent: 0,
        duration: 0.42,
        ease: "power4.inOut",
      }, 0);

      // Label animates in once curtain is closed
      tl.fromTo(label, { y: direction * 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.22, ease: "power2.out",
      }, 0.38);
      tl.fromTo(num, { y: direction * -20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.2, ease: "power2.out",
      }, 0.4);
      tl.fromTo(line, { scaleX: 0, opacity: 1 }, {
        scaleX: 1, duration: 0.28, ease: "expo.out",
      }, 0.44);

      // Hold
      tl.to({}, { duration: 0.08 });

      // Curtain OPENS (panels split outward)
      tl.to([label, num, line], {
        opacity: 0, duration: 0.12, ease: "power2.in",
      });
      tl.to(top, {
        yPercent: -100,
        duration: 0.5,
        ease: "power4.inOut",
      });
      tl.to(bot, {
        yPercent:  100,
        duration: 0.5,
        ease: "power4.inOut",
      }, "<");
    };

    const setupTimeout = setTimeout(() => {
      SECTIONS.forEach((sec, i) => {
        const el = document.getElementById(sec.id);
        if (!el) return;

        const t = ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          onEnter:     () => fire(sec.label, sec.num,  1),
          onLeaveBack: () => fire(sec.label, sec.num, -1),
        });
        triggers.push(t);
      });
    }, 800);

    return () => {
      clearTimeout(setupTimeout);
      triggers.forEach(t => t.kill());
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 9999 }}>
      {/* Top panel */}
      <div
        ref={topRef}
        className="absolute left-0 top-0 w-full h-1/2 bg-neutral-950 flex items-end justify-center pb-6"
        style={{ borderBottom: "1px solid rgba(255,30,39,0.3)" }}
      >
        {/* Content inside top panel */}
        <div className="flex flex-col items-center gap-3 pb-4">
          <span ref={numRef} className="font-mono text-[11px] tracking-[0.4em] text-brand/70">01</span>
          <div ref={lineRef} className="h-px w-32 bg-brand origin-left" />
        </div>
      </div>

      {/* Bottom panel */}
      <div
        ref={botRef}
        className="absolute left-0 bottom-0 w-full h-1/2 bg-neutral-950 flex items-start justify-center pt-6"
        style={{ borderTop: "1px solid rgba(255,30,39,0.3)" }}
      >
        <div className="pt-4">
          <span
            ref={labelRef}
            className="font-display font-black text-[clamp(2rem,8vw,6rem)] tracking-tighter text-white select-none"
          >
            YOUTOBIA
          </span>
        </div>
      </div>
    </div>
  );
};

export default PageTransition;

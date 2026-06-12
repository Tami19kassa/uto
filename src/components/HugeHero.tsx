import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "../lib/gsap";
import { Play, ArrowUpRight, ArrowDown } from "lucide-react";

interface HeroProps {
  onPlayDemo: () => void;
  onNavigate: (sectionId: string) => void;
  gameScore: number;
  heroVideoUrl?: string;
}

export const HugeHero: React.FC<HeroProps> = ({ onPlayDemo, onNavigate, gameScore }) => {
  const heroRef        = useRef<HTMLDivElement>(null);
  const lineTopRef     = useRef<HTMLDivElement>(null);
  const lineBotRef     = useRef<HTMLDivElement>(null);
  const eyebrowRef     = useRef<HTMLDivElement>(null);
  const titleLine1Ref  = useRef<HTMLDivElement>(null);
  const titleLine2Ref  = useRef<HTMLDivElement>(null);
  const subtagRef      = useRef<HTMLDivElement>(null);
  const descRef        = useRef<HTMLDivElement>(null);
  const ctaRef         = useRef<HTMLDivElement>(null);
  const statsRef       = useRef<HTMLDivElement>(null);
  const marqueeRef     = useRef<HTMLDivElement>(null);
  const accentNumRef   = useRef<HTMLDivElement>(null);
  const vertTextRef    = useRef<HTMLDivElement>(null);
  const redBarRef      = useRef<HTMLDivElement>(null);
  const circleRef      = useRef<HTMLDivElement>(null);
  const mouse          = useRef({ x: 0, y: 0 });

  const [mottoIndex, setMottoIndex] = useState(0);
  const mottos = [
    "CREATIVITY · TECHNOLOGY · ENTERTAINMENT · EDUCATION",
    "FIVE BRANDS · ONE VISION · ADDIS ABABA",
    "STREAMING · PRODUCTION · INFORMATION · TRIVIA",
  ];

  // ── Mouse parallax ─────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
      if (accentNumRef.current) {
        gsap.to(accentNumRef.current, {
          x: mouse.current.x * 18,
          y: mouse.current.y * 12,
          duration: 1.8, ease: "power2.out",
        });
      }
      if (circleRef.current) {
        gsap.to(circleRef.current, {
          x: mouse.current.x * -28,
          y: mouse.current.y * -20,
          duration: 2.2, ease: "power2.out",
        });
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // ── Motto cycling ──────────────────────────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => setMottoIndex(p => (p + 1) % mottos.length), 3600);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!marqueeRef.current) return;
    gsap.fromTo(marqueeRef.current,
      { opacity: 0, y: 6 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
    );
  }, [mottoIndex]);

  // ── Marquee scroll ─────────────────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const track = marqueeRef.current?.querySelector(".marquee-track") as HTMLElement;
      if (track) {
        const w = track.scrollWidth / 2;
        gsap.to(track, { x: -w, duration: 22, ease: "none", repeat: -1 });
      }
    });
    return () => ctx.revert();
  }, [mottoIndex]);

  // ── Entrance timeline ──────────────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Split title chars
      const splitChars = (el: HTMLElement | null): Element[] => {
        if (!el) return [];
        const text = el.textContent || "";
        el.innerHTML = text.split("").map(c =>
          c === " "
            ? `<span style="display:inline-block;width:0.25em"> </span>`
            : `<span style="display:inline-block;overflow:hidden;line-height:1;vertical-align:bottom">` +
              `<span class="ch" style="display:inline-block">${c}</span></span>`
        ).join("");
        return Array.from(el.querySelectorAll(".ch"));
      };

      const c1 = splitChars(titleLine1Ref.current);
      const c2 = splitChars(titleLine2Ref.current);

      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // Red bar slides in
      tl.from(redBarRef.current,   { scaleX: 0, transformOrigin: "left", duration: 0.6 }, 0);
      // Top rule line
      tl.from(lineTopRef.current,  { scaleX: 0, transformOrigin: "left", duration: 0.55 }, 0.05);
      // Eyebrow
      tl.from(eyebrowRef.current,  { x: -40, opacity: 0, duration: 0.5 }, 0.15);
      // Giant accent number
      tl.from(accentNumRef.current,{ y: 60, opacity: 0, duration: 0.9, ease: "power4.out" }, 0.1);
      // Vertical side text
      tl.from(vertTextRef.current, { opacity: 0, y: 20, duration: 0.5 }, 0.3);
      // Decorative circle
      tl.from(circleRef.current,   { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(1.4)" }, 0.2);

      // Line 1 chars
      tl.from(c1, {
        y: "110%", rotateZ: -8, skewX: -5,
        duration: 0.7, stagger: { each: 0.038, from: "start" },
      }, 0.22);
      // Line 2 chars
      tl.from(c2, {
        y: "110%", rotateZ: 6, skewX: 4,
        duration: 0.68, stagger: { each: 0.034, from: "start" },
      }, 0.44);

      // Subtag
      tl.from(subtagRef.current,   { y: 20, opacity: 0, duration: 0.45 }, 0.7);
      // Bottom line
      tl.from(lineBotRef.current,  { scaleX: 0, transformOrigin: "left", duration: 0.6 }, 0.75);
      // Description block
      tl.from(descRef.current,     { y: 30, opacity: 0, duration: 0.55 }, 0.82);
      // CTA buttons
      tl.from(ctaRef.current?.children ?? [], {
        y: 24, opacity: 0, duration: 0.5, stagger: 0.1,
      }, 0.9);
      // Stats strip
      tl.from(statsRef.current,    { y: 16, opacity: 0, duration: 0.4 }, 1.0);

      // After settle — chars float idle
      tl.to([c1, c2], {
        y: -4, duration: 2.0, ease: "sine.inOut",
        stagger: { each: 0.05, from: "random", yoyo: true, repeat: -1 },
      }, ">");
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen bg-[#0a0a0a] overflow-hidden flex flex-col"
    >
      {/* ── Noise texture overlay ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      {/* ── Left red accent bar ───────────────────────────────────────────── */}
      <div
        ref={redBarRef}
        className="absolute left-0 top-0 bottom-0 w-1 bg-brand"
        style={{ zIndex: 2 }}
      />

      {/* ── Giant background accent number ───────────────────────────────── */}
      <div
        ref={accentNumRef}
        className="absolute right-[-2%] top-1/2 -translate-y-1/2 font-display font-black select-none pointer-events-none"
        style={{
          fontSize: "clamp(18rem, 30vw, 42rem)",
          lineHeight: 0.85,
          color: "rgba(255,30,39,0.04)",
          zIndex: 1,
          letterSpacing: "-0.06em",
        }}
      >
        01
      </div>

      {/* ── Decorative ring ───────────────────────────────────────────────── */}
      <div
        ref={circleRef}
        className="absolute pointer-events-none"
        style={{
          width: 480, height: 480,
          border: "1px solid rgba(255,30,39,0.10)",
          borderRadius: "50%",
          right: "8%", top: "12%",
          zIndex: 1,
        }}
      >
        {/* Inner ring */}
        <div
          className="absolute inset-8 rounded-full"
          style={{ border: "1px solid rgba(255,30,39,0.07)" }}
        />
        {/* Dot on ring */}
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-brand"
          style={{ top: -5, left: "50%", marginLeft: -5 }}
        />
      </div>

      {/* ── Vertical side text ────────────────────────────────────────────── */}
      <div
        ref={vertTextRef}
        className="absolute left-8 top-1/2 -translate-y-1/2 pointer-events-none hidden xl:block"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transform: "translateY(-50%) rotate(180deg)",
          zIndex: 2,
        }}
      >
        <span className="font-mono text-[10px] tracking-[0.35em] text-white/20 uppercase">
          ADDIS ABABA · ETHIOPIA · 2026
        </span>
      </div>

      {/* ── Top rule ──────────────────────────────────────────────────────── */}
      <div
        ref={lineTopRef}
        className="absolute top-[72px] left-6 right-6 h-px bg-white/8"
        style={{ zIndex: 2 }}
      />

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="relative flex flex-col flex-1 max-w-[1400px] mx-auto w-full px-8 md:px-16 lg:px-20" style={{ zIndex: 3 }}>

        {/* Eyebrow */}
        <div
          ref={eyebrowRef}
          className="flex items-center gap-4 mt-28 mb-10"
        >
          <div className="flex items-center gap-2.5 bg-brand/10 border border-brand/20 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="font-mono text-[11px] tracking-[0.3em] text-brand font-semibold uppercase">
              YouTobia Multimedia P.L.C.
            </span>
          </div>
          <div className="h-px flex-1 bg-white/8 hidden md:block" />
          <span className="font-mono text-[10px] tracking-widest text-white/30 hidden md:block">EST. 2024 · ADDIS ABABA</span>
        </div>

        {/* Main headline */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="space-y-0 mb-8">
            {/* Line 1 */}
            <h1 className="font-display font-black tracking-[-0.04em] leading-[0.88] text-white select-none"
              style={{ fontSize: "clamp(4rem, 11vw, 13rem)" }}>
              <span ref={titleLine1Ref}>YOUTOBIA</span>
            </h1>

            {/* Line 2 — with red accent on last letters */}
            <h1 className="font-display font-black tracking-[-0.04em] leading-[0.88] select-none"
              style={{ fontSize: "clamp(4rem, 11vw, 13rem)" }}>
              <span ref={titleLine2Ref} className="text-white">MULTIMEDIA</span>
              <span className="text-brand ml-2" style={{ fontSize: "0.6em", verticalAlign: "super", lineHeight: 1 }}>™</span>
            </h1>

            {/* Subtag line */}
            <div ref={subtagRef} className="flex items-center gap-4 mt-4">
              <div className="h-px w-12 bg-brand" />
              <span className="font-mono text-[11px] tracking-[0.4em] text-white/40 uppercase">
                The Multimedia Standard
              </span>
            </div>
          </div>

          {/* Bottom rule */}
          <div ref={lineBotRef} className="w-full h-px bg-white/8 mb-10" />

          {/* Description + CTA grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">

            {/* Description */}
            <div ref={descRef} className="space-y-6">
              <p className="font-serif italic text-xl md:text-2xl text-white/70 leading-relaxed max-w-lg">
                Five purpose-built brands united under one bold vision —
                bringing creativity, technology, and entertainment to
                the multimedia landscape.
              </p>

              {/* Sub-brand pills */}
              <div className="flex flex-wrap gap-2">
                {["EnqoqCash", "QenaView", "eTop", "YentaBarsiisaa", "MirXog"].map((brand, i) => (
                  <span key={brand}
                    className={`font-mono text-[10px] tracking-widest px-3 py-1.5 rounded-full border transition-colors ${
                      i === 0
                        ? "bg-brand/15 border-brand/30 text-brand"
                        : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/60"
                    }`}>
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA + stats */}
            <div className="space-y-6">
              <div ref={ctaRef} className="flex flex-wrap gap-4">
                {/* Primary CTA */}
                <button
                  onClick={onPlayDemo}
                  className="group relative flex items-center gap-3 bg-brand text-white font-display font-bold px-7 py-4 overflow-hidden cursor-pointer"
                  style={{ clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))" }}
                  onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1.0, duration: 0.3, ease: "elastic.out(1,0.5)" })}
                >
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
                  <Play className="w-4 h-4 fill-white relative z-10" />
                  <span className="relative z-10 text-sm tracking-wider">PLAY ENQOQ CASH</span>
                </button>

                {/* Secondary CTA */}
                <button
                  onClick={() => onNavigate("ecosystem")}
                  className="flex items-center gap-2 border border-white/15 text-white/70 hover:text-white hover:border-white/30 font-mono text-xs tracking-widest px-6 py-4 transition-all duration-300 cursor-pointer"
                  onMouseEnter={e => gsap.to(e.currentTarget, { x: 4, duration: 0.2 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { x: 0, duration: 0.4, ease: "elastic.out(1,0.5)" })}
                >
                  <span>EXPLORE</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stats row */}
              <div ref={statsRef} className="flex gap-8 pt-4 border-t border-white/8">
                {[
                  { value: "5", label: "Sub-Brands" },
                  { value: "3+", label: "Products Live" },
                  { value: "ETH", label: "Based In" },
                ].map(stat => (
                  <div key={stat.label} className="space-y-1">
                    <div className="font-display font-black text-2xl text-white">{stat.value}</div>
                    <div className="font-mono text-[10px] tracking-widest text-white/35 uppercase">{stat.label}</div>
                  </div>
                ))}
                {gameScore > 0 && (
                  <div className="space-y-1 ml-auto">
                    <div className="font-display font-black text-2xl text-brand">{gameScore}</div>
                    <div className="font-mono text-[10px] tracking-widest text-brand/60 uppercase">Your Score</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom status bar ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pb-8 font-mono text-[10px] tracking-widest text-white/25">
          <div className="flex items-center gap-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-brand" />
            </span>
            <span className="uppercase">LIVE · STUDIO ACTIVE</span>
          </div>

          <button
            onClick={() => onNavigate("ecosystem")}
            className="flex items-center gap-2 hover:text-white/50 cursor-pointer transition-colors group uppercase"
          >
            <span>Scroll to explore</span>
            <ArrowDown className="w-3 h-3 animate-bounce text-brand" />
          </button>
        </div>
      </div>

      {/* ── Marquee ticker ────────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/6 bg-black/40 overflow-hidden py-2.5" style={{ zIndex: 4 }}>
        <div className="overflow-hidden">
          <div ref={marqueeRef} className="whitespace-nowrap">
            <div className="marquee-track inline-flex gap-12">
              {/* Duplicated for seamless loop */}
              {[...Array(2)].map((_, di) => (
                <React.Fragment key={di}>
                  {mottos.map((m, mi) => (
                    <span key={mi} className="inline-flex items-center gap-4 font-mono text-[10px] tracking-[0.3em] text-white/25 uppercase">
                      <span className="text-brand/50">◆</span>
                      {m}
                    </span>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HugeHero;

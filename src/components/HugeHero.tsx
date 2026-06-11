import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import { gsap } from "../lib/gsap";
import { Reveal } from "./Reveal";
import { Play, ArrowDown, ArrowUpRight } from "lucide-react";
import { InteractiveYutobiaStage } from "./InteractiveYutobiaStage";

interface HeroProps {
  onPlayDemo: () => void;
  onNavigate: (sectionId: string) => void;
  gameScore: number;
  heroVideoUrl?: string;
}

export const HugeHero: React.FC<HeroProps> = ({
  onPlayDemo,
  onNavigate,
  gameScore,
  heroVideoUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobRef      = useRef<HTMLDivElement>(null);
  const ghostYRef    = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLDivElement>(null);
  const subtitleRef  = useRef<HTMLDivElement>(null);
  const badgeRef     = useRef<HTMLDivElement>(null);
  const mottoRef     = useRef<HTMLDivElement>(null);

  const [mousePosition, setMousePosition]     = useState({ x: 50, y: 50 });
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);

  const mottos = [
    "CREATIVITY · TECHNOLOGY · ENTERTAINMENT · EDUCATION",
    "FIVE PURPOSE-BUILT BRANDS · ONE BOLD VISION",
    "STREAMING · PRODUCTION · EDUCATION · INFORMATION · TRIVIA",
    "A HOLDING COMPANY UNITING THE MULTIMEDIA LANDSCAPE",
  ];

  // ── Mouse tracking for parallax blob ──────────────────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top)  / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ── GSAP parallax: blob + ghost Y follow mouse ─────────────────────────
  useEffect(() => {
    if (blobRef.current) {
      gsap.to(blobRef.current, {
        x: (mousePosition.x - 50) * 2.2,
        y: (mousePosition.y - 50) * 2.2,
        duration: 1.2,
        ease: "power2.out",
      });
    }
    if (ghostYRef.current) {
      gsap.to(ghostYRef.current, {
        x: (mousePosition.x - 50) * 0.3,
        y: (mousePosition.y - 50) * 0.3,
        duration: 1.8,
        ease: "power2.out",
      });
    }
  }, [mousePosition]);

  // ── Entrance animation ─────────────────────────────────────────────────
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Split title chars into spans
      const titleEl = titleRef.current;
      const subtitleEl = subtitleRef.current;
      if (!titleEl || !subtitleEl) return;

      const splitChars = (el: HTMLElement) => {
        const text = el.textContent || "";
        el.innerHTML = text
          .split("")
          .map(c => c === " "
            ? '<span style="display:inline-block">&nbsp;</span>'
            : `<span class="char" style="display:inline-block;overflow:hidden"><span style="display:inline-block">${c}</span></span>`)
          .join("");
        return el.querySelectorAll(".char > span");
      };

      const chars1 = splitChars(titleEl);
      const chars2 = splitChars(subtitleEl);

      const tl = gsap.timeline({ delay: 0.3 });

      // Badge
      tl.from(badgeRef.current, {
        y: -20, opacity: 0, duration: 0.5, ease: "power3.out",
      }, 0);

      // Motto
      tl.from(mottoRef.current, {
        y: 10, opacity: 0, duration: 0.5, ease: "power3.out",
      }, 0.1);

      // Line 1 chars
      tl.from(chars1, {
        y: "110%",
        rotateZ: -4,
        duration: 0.7,
        ease: "yutobia.spring",
        stagger: 0.035,
      }, 0.15);

      // Line 2 chars
      tl.from(chars2, {
        y: "110%",
        rotateZ: 3,
        duration: 0.65,
        ease: "yutobia.spring",
        stagger: 0.03,
      }, 0.35);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // ── Motto cycling ──────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMottoIndex(prev => (prev + 1) % mottos.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  // Animate motto swap
  useEffect(() => {
    if (mottoRef.current) {
      gsap.fromTo(mottoRef.current,
        { opacity: 0, y: 8, filter: "blur(3px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.35, ease: "power2.out" }
      );
    }
  }, [currentMottoIndex]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-white dark:bg-[#060606] overflow-hidden flex flex-col justify-center pt-28 pb-16 px-6 md:px-12 transition-colors duration-500"
    >
      {/* ── Background video ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <video
          key={heroVideoUrl || "default-video"}
          autoPlay loop muted playsInline
          className="absolute min-w-full min-h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover opacity-[0.06] dark:opacity-[0.14] filter pointer-events-none transition-all duration-[1500ms] hue-rotate-[340deg] contrast-125 saturate-150"
          src={heroVideoUrl || "https://cdn.pixabay.com/video/2021/04/12/70860-537333552_large.mp4"}
        />
        <div className="absolute inset-0 bg-white/20 dark:bg-[#060606]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/30 to-white/95 dark:from-[#060606] dark:via-transparent dark:to-[#060606]" />
      </div>

      {/* ── Mouse-follow blob ─────────────────────────────────────────────── */}
      <div
        ref={blobRef}
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none z-[1]"
        style={{
          top: "10%", left: "15%",
          background: `radial-gradient(1000px circle,rgba(255,30,39,0.04) 0%,transparent 100%)`,
          filter: "blur(40px)",
        }}
      />

      {/* ── Grid ──────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 huge-grid-pattern opacity-40 pointer-events-none z-[1]" />

      {/* ── Ghost Y ───────────────────────────────────────────────────────── */}
      <div
        ref={ghostYRef}
        className="absolute left-[3%] bottom-[5%] text-[#FF1E27]/[0.015] dark:text-[#FF1E27]/[0.025] font-display font-black text-[12rem] md:text-[24rem] leading-none select-none pointer-events-none z-[1]"
      >
        Y
      </div>

      {/* ── Decorative orbiting elements ─────────────────────────────────── */}
      <OrbitDeco mouseX={mousePosition.x} mouseY={mousePosition.y} />

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-between flex-1 py-4 md:py-8">
        <div className="space-y-6 md:space-y-8">

          {/* Badge + motto row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div ref={badgeRef}
              className="inline-flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-white/10 px-4 py-2 rounded-full font-mono text-xs tracking-widest text-[#FF1E27] font-semibold shadow-xs shrink-0 self-start transition-colors duration-500">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              <span>YOUTOBIA MULTIMEDIA P.L.C.</span>
            </div>

            <div className="h-6 overflow-hidden relative min-w-[320px] self-start md:self-center">
              <span
                ref={mottoRef}
                className="absolute left-0 top-0 text-[10px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 font-bold uppercase py-0.5"
              >
                // {mottos[currentMottoIndex]}
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-2">
            <h1 className="font-display font-black text-5xl sm:text-7xl md:text-[8.5rem] lg:text-[10rem] tracking-tighter leading-[0.82] text-neutral-900 dark:text-white select-none transition-colors duration-500 overflow-hidden">
              <span ref={titleRef}>YOUTOBIA</span>
            </h1>
            <h1 className="font-display font-black text-5xl sm:text-7xl md:text-[8.5rem] lg:text-[10rem] tracking-tighter leading-[0.82] text-neutral-900 dark:text-white select-none relative transition-colors duration-500 overflow-hidden">
              <span ref={subtitleRef}>MULTIMEDIA</span>
              <HoverDot />
            </h1>
          </div>

          {/* Description + CTA */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
            <Reveal effect="fade-up-right" delay={0.4} duration={0.7} easing="ease-out-cubic"
              once={false} className="lg:col-span-7 space-y-6">
              <div className="font-serif italic text-2xl md:text-4xl text-neutral-800 dark:text-neutral-200 leading-snug tracking-tight max-w-xl transition-colors duration-500">
                A bold vision uniting creativity, technology, entertainment,
                information, and education — delivered through a powerful
                ecosystem of purpose-built brands.
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed font-sans font-light max-w-xl transition-colors duration-500">
                YouTobia Multimedia P.l.C. is a holding company that unites five specialized sub-brands —{" "}
                <span className="text-[#FF1E27] font-semibold">EnqoqCash</span>,{" "}
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">QenaView</span>,{" "}
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">eTop Production</span>,{" "}
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">YentaBarsiisaa</span>, and{" "}
                <span className="text-neutral-700 dark:text-neutral-300 font-semibold">MirXog</span> — each designed to lead in its domain of the multimedia landscape.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button onClick={onPlayDemo}
                  className="flex items-center gap-2 bg-[#FF1E27] hover:bg-brand-dark text-white font-display font-semibold select-none px-6 py-4 rounded-xl transition-all duration-300 scale-100 hover:scale-[1.03] active:scale-95 shadow-lg shadow-brand/20 cursor-pointer group">
                  <Play className="w-5 h-5 fill-white" />
                  <span>PLAY ENQOQ CASH DEMO</span>
                </button>
                <button onClick={() => onNavigate("studio")}
                  className="flex items-center gap-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 border border-neutral-200 dark:border-white/10 text-neutral-800 dark:text-neutral-200 font-mono text-xs tracking-widest px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer">
                  <span>EXPLORE THE ECOSYSTEM</span>
                  <ArrowUpRight className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                </button>
              </div>
            </Reveal>

            <Reveal effect="zoom-in-up" delay={0.5} duration={0.7} easing="ease-out-cubic"
              once={false} className="lg:col-span-5 flex flex-col justify-center select-none">
              <InteractiveYutobiaStage />
            </Reveal>
          </div>
        </div>

        {/* Footer bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-neutral-200 dark:border-white/10 pt-8 mt-12 font-mono text-[11px] text-neutral-400 dark:text-neutral-500 transition-colors duration-500">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF1E27]"></span>
            </span>
            <span className="tracking-widest uppercase">ADDIS ABABA STUDIO // ACTIVE ACCREDITATIONS</span>
            {gameScore > 0 && (
              <span className="bg-rose-50 border border-brand/20 dark:bg-[#FF1E27]/10 dark:border-[#FF1E27]/20 text-brand px-2.5 py-1 rounded-full text-[10px] font-bold">
                Your Demo Score: {gameScore} ETH / Coins
              </span>
            )}
          </div>
          <button onClick={() => onNavigate("enqoq-cash")}
            className="flex items-center gap-2 hover:text-[#FF1E27] cursor-pointer group transition-colors font-semibold tracking-wide text-neutral-600 dark:text-neutral-400">
            <span>EXPLORE STUDIO HIGHLIGHTS</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce group-hover:translate-y-0.5 transition-transform text-[#FF1E27]" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Small animated highlight dot after MULTIMEDIA ──────────────────────────
function HoverDot() {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(ref.current, {
        scale: 0,
        duration: 0.5,
        ease: "back.out(2)",
        delay: 1.0,
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <span ref={ref} className="inline-block text-brand ml-1">.</span>
  );
}

// ── Rotating + parallax decorative elements ────────────────────────────────
function OrbitDeco({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const circleRef = useRef<HTMLDivElement>(null);
  const squareRef = useRef<HTMLDivElement>(null);
  const circleAngle = useRef(0);
  const squareAngle = useRef(0);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to({}, {
        duration: 99999,
        onUpdate: () => {
          circleAngle.current += 0.3;
          squareAngle.current -= 0.2;
          if (circleRef.current) gsap.set(circleRef.current, { rotate: circleAngle.current });
          if (squareRef.current) gsap.set(squareRef.current, { rotate: squareAngle.current });
        },
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (circleRef.current) {
      gsap.to(circleRef.current, {
        x: (mouseX - 50) * 0.5,
        y: (mouseY - 50) * -0.5,
        duration: 1.5, ease: "power2.out",
      });
    }
    if (squareRef.current) {
      gsap.to(squareRef.current, {
        x: (mouseX - 50) * -0.4,
        y: (mouseY - 50) * 0.4,
        duration: 1.8, ease: "power2.out",
      });
    }
  }, [mouseX, mouseY]);

  return (
    <>
      <div ref={circleRef}
        className="absolute right-[22%] bottom-[28%] w-16 h-16 border border-dashed border-[#FF1E27]/20 dark:border-[#FF1E27]/10 rounded-full pointer-events-none z-[1] hidden sm:block" />
      <div ref={squareRef}
        className="absolute left-[18%] top-[20%] w-8 h-8 bg-[#FF1E27]/[0.02] dark:bg-[#FF1E27]/5 border border-[#FF1E27]/20 dark:border-white/10 pointer-events-none z-[1] hidden sm:block" />
    </>
  );
}

export default HugeHero;

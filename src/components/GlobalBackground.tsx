import React, { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "../lib/gsap";
import { YouTobiaMarkSVG } from "./YutobiaLogo";

const MANTRAS = [
  "Form demands absolute focus.",
  "Five purpose-built brands. One bold vision.",
  "Digital architecture built for immersive discovery.",
  "Creativity · Technology · Entertainment · Education.",
  "Harnessing distributed speed with local fidelity.",
  "YouTobia Multimedia — The Standard.",
];

// ─── Radar sweep canvas ──────────────────────────────────────────────────────
function RadarSweep({ size }: { size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angleRef  = useRef(0);
  const rafRef    = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const cx = size / 2, cy = size / 2, r = size / 2;
      ctx.clearRect(0, 0, size, size);
      angleRef.current = (angleRef.current + 0.010) % (Math.PI * 2);
      const sweep = angleRef.current;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, sweep - 1.1, sweep, false);
      ctx.closePath();
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
      g.addColorStop(0,   "rgba(255,30,39,0.0)");
      g.addColorStop(0.5, "rgba(255,30,39,0.06)");
      g.addColorStop(1,   "rgba(255,30,39,0.22)");
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(sweep) * r, Math.sin(sweep) * r);
      ctx.strokeStyle = "rgba(255,30,39,0.65)";
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "#FF1E27";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      for (let i = 0; i < 4; i++) {
        const bA = sweep - 0.15 - i * 0.18;
        const bR = r * (0.35 + ((i * 0.17 + angleRef.current * 0.3) % 0.6));
        ctx.beginPath();
        ctx.arc(cx + Math.cos(bA) * bR, cy + Math.sin(bA) * bR, Math.max(0.5, 2.5 - i * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,30,39,${Math.max(0, 0.9 - i * 0.22)})`;
        ctx.shadowColor = "#FF1E27";
        ctx.shadowBlur = 6;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (document.hidden) cancelAnimationFrame(rafRef.current);
      else rafRef.current = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [size]);

  return (
    <canvas ref={canvasRef} width={size} height={size}
      className="absolute inset-0 pointer-events-none" style={{ borderRadius: "50%" }} />
  );
}

// ─── Orbit ring (CSS animated, no motion/react) ───────────────────────────────
function OrbitRing({ radius, speed, tiltX, tiltZ, color, dashed = false, dotCount = 0 }: {
  radius: number; speed: number; tiltX: number; tiltZ: number;
  color: string; dashed?: boolean; dotCount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const angleRef = useRef(tiltZ);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to({}, {
        duration: 99999,
        onUpdate: () => {
          angleRef.current += (360 / speed) * (1/60);
          if (ref.current) {
            gsap.set(ref.current, {
              rotateX: tiltX,
              rotateZ: angleRef.current,
            });
          }
        },
        repeat: -1,
      });
    });
    return () => ctx.revert();
  }, [speed, tiltX]);

  return (
    <div ref={ref}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: radius * 2, height: radius * 2,
        left: "50%", top: "50%",
        marginLeft: -radius, marginTop: -radius,
        border: `1px ${dashed ? "dashed" : "solid"} ${color}`,
        transformStyle: "preserve-3d",
      }}>
      {dotCount > 0 && [...Array(dotCount)].map((_, i) => {
        const a = (i / dotCount) * Math.PI * 2;
        return (
          <div key={i} className="absolute rounded-full" style={{
            width: 5, height: 5, background: color,
            boxShadow: `0 0 8px 2px ${color}`,
            left: "50%", top: "50%",
            transform: `translate(-50%,-50%) translate(${Math.cos(a)*radius}px,${Math.sin(a)*radius}px)`,
          }} />
        );
      })}
    </div>
  );
}

// ─── Floating particle ───────────────────────────────────────────────────────
function Particle({ index, tiltX, tiltY }: { index: number; tiltX: number; tiltY: number; key?: React.Key }) {
  const ref   = useRef<HTMLDivElement>(null);
  const angle = (index / 12) * Math.PI * 2;
  const baseR = 80 + (index % 3) * 28;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        x: Math.cos(angle + 0.4) * (baseR + 18) + tiltY * 0.6,
        y: Math.sin(angle + 0.4) * (baseR + 12) - tiltX * 0.6,
        opacity: 0.9, scale: 1.4,
        duration: 3.5 + index * 0.4,
        ease: "sine.inOut", yoyo: true, repeat: -1,
        delay: index * 0.2,
      });
    });
    return () => ctx.revert();
  }, [tiltX, tiltY]);

  return (
    <div ref={ref}
      className="absolute rounded-full pointer-events-none"
      style={{
        width: index%3===0 ? 3 : 2, height: index%3===0 ? 3 : 2,
        background: index%4===0 ? "#FF1E27" : "rgba(255,255,255,0.6)",
        boxShadow: index%4===0 ? "0 0 8px #FF1E27" : "0 0 4px rgba(255,255,255,0.4)",
        left: "50%", top: "50%",
        transform: `translate(${Math.cos(angle)*baseR+tiltY*0.6}px,${Math.sin(angle)*baseR-tiltX*0.6}px)`,
        opacity: 0.3,
      }}
    />
  );
}

// ─── Pulse ring on click ──────────────────────────────────────────────────────
function PulseRing({ onDone }: { onDone: () => void; key?: React.Key }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { scale: 0.6, opacity: 0.8 },
        { scale: 2.8, opacity: 0, duration: 1.2, ease: "power2.out", onComplete: onDone }
      );
    });
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref}
      className="absolute rounded-full border border-brand pointer-events-none"
      style={{ left:"50%", top:"50%", marginLeft:-75, marginTop:-75, width:150, height:150 }} />
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export const GlobalBackground: React.FC = () => {
  const stageRef   = useRef<HTMLDivElement>(null);
  const logoRef    = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const mantraRef  = useRef<HTMLParagraphElement>(null);
  const statusRef  = useRef<HTMLSpanElement>(null);
  const [tilt, setTilt]             = useState({ x: 0, y: 0 });
  const [pulses, setPulses]         = useState<number[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [currentMantra, setCurrentMantra] = useState(MANTRAS[0]);
  const pulseId = useRef(0);

  // Scroll-driven logo rotation (GSAP ticker reading scrollY)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to({}, {
        duration: 99999,
        onUpdate: () => {
          if (logoRef.current) {
            const progress = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            gsap.set(logoRef.current, { rotateX: progress * 360 });
          }
        },
        repeat: -1,
      });

      // Ambient glow pulse
      gsap.to(glowRef.current, {
        scale: 1.1, opacity: 0.8, duration: 4,
        ease: "sine.inOut", yoyo: true, repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);

  // Mouse tilt
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    setTilt({
      x: -((e.clientY - cy) / cy) * 20,
      y:  ((e.clientX - cx) / cx) * 20,
    });
  }, []);
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // Tilt logo
  useEffect(() => {
    if (logoRef.current) {
      gsap.to(logoRef.current, {
        rotateY: tilt.y, duration: 0.8,
        ease: "power2.out", overwrite: "auto",
      });
    }
  }, [tilt]);

  // Click handler
  const handleClick = () => {
    const id = pulseId.current++;
    setPulses(p => [...p.slice(-4), id]);
    const newCount = clickCount + 1;
    setClickCount(newCount);
    const newMantra = MANTRAS[newCount % MANTRAS.length];
    setCurrentMantra(newMantra);
    // Animate mantra swap
    if (mantraRef.current) {
      gsap.fromTo(mantraRef.current,
        { opacity: 0, y: -6, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.3, ease: "power2.out" }
      );
    }
  };

  const radarSize = Math.min(
    typeof window !== "undefined" ? Math.min(window.innerWidth, window.innerHeight) * 0.55 : 400,
    520
  );

  return (
    <div ref={stageRef} aria-hidden onClick={handleClick}
      className="fixed inset-0 z-0 pointer-events-auto overflow-hidden flex items-center justify-center select-none"
      style={{ background: "radial-gradient(ellipse 90% 80% at 50% 52%,#0c0101 0%,#070707 50%,#020202 100%)" }}>

      {/* Dot grid */}
      <div className="absolute inset-0 opacity-25 pointer-events-none">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="bgDots" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.9" fill="rgba(255,255,255,0.3)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bgDots)" />
        </svg>
      </div>

      {/* Ambient glow */}
      <div ref={glowRef} className="absolute rounded-full pointer-events-none" style={{
        width: radarSize*1.1, height: radarSize*1.1,
        background: "radial-gradient(circle,rgba(255,30,39,0.14) 0%,transparent 70%)",
        filter: "blur(50px)", opacity: 0.5,
      }} />

      {/* Radar */}
      <div className="absolute pointer-events-none" style={{
        width: radarSize, height: radarSize,
        left:"50%", top:"50%", marginLeft:-radarSize/2, marginTop:-radarSize/2,
        borderRadius:"50%", overflow:"hidden",
      }}>
        <RadarSweep size={radarSize} />
      </div>

      {/* Static rings */}
      {[0.5,0.38,0.27].map((frac,i) => {
        const r = radarSize * frac;
        return (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            width:r*2, height:r*2, left:"50%", top:"50%",
            marginLeft:-r, marginTop:-r,
            border:`1px solid rgba(255,255,255,${0.05+i*0.025})`,
          }} />
        );
      })}

      {/* Orbit rings */}
      <div className="absolute inset-0 pointer-events-none" style={{ perspective:"900px", perspectiveOrigin:"50% 50%" }}>
        <OrbitRing radius={radarSize*0.48} speed={18} tiltX={tilt.x*0.6} tiltZ={0}   color="rgba(255,30,39,0.22)" dashed dotCount={2} />
        <OrbitRing radius={radarSize*0.38} speed={28} tiltX={-tilt.x*0.4} tiltZ={60} color="rgba(255,255,255,0.07)" />
        <OrbitRing radius={radarSize*0.28} speed={12} tiltX={tilt.x*0.8} tiltZ={120} color="rgba(255,30,39,0.15)" dashed />
      </div>

      {/* Particles */}
      <div className="absolute pointer-events-none" style={{ left:"50%",top:"50%",transform:"translate(-50%,-50%)" }}>
        {[...Array(12)].map((_,i) => <Particle key={i} index={i} tiltX={tilt.x} tiltY={tilt.y} />)}
      </div>

      {/* Corner brackets */}
      {[
        { top:"8%",  left:"6%",   rotate:"0deg"   },
        { top:"8%",  right:"6%",  rotate:"90deg"  },
        { bottom:"8%",left:"6%",  rotate:"-90deg" },
        { bottom:"8%",right:"6%", rotate:"180deg" },
      ].map((style: any, i) => (
        <CornerBracket key={i} style={style} delay={i*0.4} />
      ))}

      {/* 3D logo */}
      <div style={{ transformStyle:"preserve-3d", perspective:"900px" }}
        className="relative z-20 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {pulses.map(id => (
            <PulseRing key={id} onDone={() => setPulses(p => p.filter(x => x !== id))} />
          ))}
        </div>
        <div className="absolute rounded-full pointer-events-none" style={{
          width:180, height:180,
          background:"radial-gradient(circle,rgba(255,30,39,0.35) 0%,rgba(255,30,39,0.08) 50%,transparent 75%)",
          filter:"blur(20px)",
        }} />
        <div ref={logoRef} style={{
          transformStyle:"preserve-3d",
          filter:"drop-shadow(0 0 32px rgba(255,30,39,0.8)) drop-shadow(0 8px 24px rgba(255,30,39,0.5))",
        }}>
          <YouTobiaMarkSVG size={Math.min(radarSize*0.52, 220)} id="bg" />
        </div>
        <div className="absolute rounded-full pointer-events-none" style={{
          width:110, height:110,
          background:"linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 60%)",
          transform:"translateZ(85px)",
        }} />
      </div>

      {/* Mantra */}
      <div className="absolute top-6 right-6 z-30 max-w-[220px] text-right pointer-events-none">
        <div className="text-[8px] font-mono tracking-widest text-brand/80 uppercase font-black mb-1">
          CREATIVE DIRECTIVE // LIVE
        </div>
        <p ref={mantraRef} className="text-[10px] text-white/40 font-sans italic leading-snug tracking-tight">
          "{currentMantra}"
        </p>
      </div>

      {/* Status bar */}
      <div className="absolute bottom-5 inset-x-6 flex justify-between items-center text-[8px] font-mono tracking-widest text-brand/35 z-20 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <StatusDot />
          <span>YOUTOBIA MULTIMEDIA // LIVE</span>
        </div>
        <span className="hidden sm:block">ADDIS ABABA // 2026</span>
        <span>YOUTOBIA_STUDIOS</span>
      </div>
    </div>
  );
};

function CornerBracket({ style, delay }: { style: React.CSSProperties; delay: number; key?: React.Key }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        opacity: 0.6, duration: 2.5, ease: "sine.inOut",
        yoyo: true, repeat: -1, delay,
      });
    });
    return () => ctx.revert();
  }, [delay]);
  return (
    <div ref={ref} className="absolute pointer-events-none" style={{ ...style, width:24, height:24, opacity:0.2 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M0 10V0H10" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function StatusDot() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        opacity: 0.2, duration: 1.2, ease: "sine.inOut",
        yoyo: true, repeat: -1,
      });
    });
    return () => ctx.revert();
  }, []);
  return <span ref={ref} className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />;
}

export default GlobalBackground;

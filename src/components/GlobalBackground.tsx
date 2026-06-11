import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationFrame, useScroll, useTransform, useSpring } from "motion/react";
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
  const angle = useRef(0);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cx = size / 2, cy = size / 2, r = size / 2;
    ctx.clearRect(0, 0, size, size);
    angle.current = (angle.current + 0.010) % (Math.PI * 2);
    const sweep = angle.current;

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
      const bR = r * (0.35 + ((i * 0.17 + angle.current * 0.3) % 0.6));
      ctx.beginPath();
      ctx.arc(cx + Math.cos(bA) * bR, cy + Math.sin(bA) * bR, Math.max(0.5, 2.5 - i * 0.4), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,30,39,${Math.max(0, 0.9 - i * 0.22)})`;
      ctx.shadowColor = "#FF1E27";
      ctx.shadowBlur = 6;
      ctx.fill();
    }
  });

  return (
    <canvas ref={canvasRef} width={size} height={size}
      className="absolute inset-0 pointer-events-none"
      style={{ borderRadius: "50%" }}
    />
  );
}

// ─── Orbit ring ──────────────────────────────────────────────────────────────
function OrbitRing({ radius, speed, tiltX, tiltZ, color, dashed = false, dotCount = 0 }: {
  radius: number; speed: number; tiltX: number; tiltZ: number;
  color: string; dashed?: boolean; dotCount?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: radius * 2, height: radius * 2,
        left: "50%", top: "50%",
        marginLeft: -radius, marginTop: -radius,
        border: `1px ${dashed ? "dashed" : "solid"} ${color}`,
        transformStyle: "preserve-3d",
        transform: `rotateX(${tiltX}deg) rotateZ(${tiltZ}deg)`,
      }}
      animate={{ rotateZ: [tiltZ, tiltZ + 360] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
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
    </motion.div>
  );
}

// ─── Particle ────────────────────────────────────────────────────────────────
function Particle({ index, tiltX, tiltY }: { index: number; tiltX: number; tiltY: number }) {
  const angle = (index / 12) * Math.PI * 2;
  const baseR = 80 + (index % 3) * 28;
  return (
    <motion.div className="absolute rounded-full pointer-events-none" style={{
      width: index % 3 === 0 ? 3 : 2, height: index % 3 === 0 ? 3 : 2,
      background: index % 4 === 0 ? "#FF1E27" : "rgba(255,255,255,0.6)",
      boxShadow: index % 4 === 0 ? "0 0 8px #FF1E27" : "0 0 4px rgba(255,255,255,0.4)",
      left: "50%", top: "50%",
    }}
      animate={{
        x: [Math.cos(angle)*baseR+tiltY*0.6, Math.cos(angle+0.4)*(baseR+18)+tiltY*0.6, Math.cos(angle)*baseR+tiltY*0.6],
        y: [Math.sin(angle)*baseR-tiltX*0.6, Math.sin(angle+0.4)*(baseR+12)-tiltX*0.6, Math.sin(angle)*baseR-tiltX*0.6],
        opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.4, 0.8],
      }}
      transition={{ duration: 3.5+index*0.4, repeat: Infinity, ease: "easeInOut", delay: index*0.2 }}
    />
  );
}

// ─── Pulse ring ──────────────────────────────────────────────────────────────
function PulseRing({ id }: { id: number }) {
  return (
    <motion.div key={id} className="absolute rounded-full pointer-events-none border border-brand"
      style={{ left:"50%",top:"50%",marginLeft:-75,marginTop:-75,width:150,height:150 }}
      initial={{ scale: 0.6, opacity: 0.8 }}
      animate={{ scale: 2.8, opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
}

// ─── Main GlobalBackground component ────────────────────────────────────────
export const GlobalBackground: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [pulses, setPulses] = useState<number[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [currentMantra, setCurrentMantra] = useState(MANTRAS[0]);
  const [zoomLevel] = useState(1);
  const pulseId = useRef(0);

  // ── Scroll-driven tilt — the logo tilts as you scroll through the page ──
  const { scrollYProgress } = useScroll();
  const scrollRotateX = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const scrollSpring = useSpring(scrollRotateX, { stiffness: 28, damping: 12 });

  // ── Mouse tilt for depth feel ────────────────────────────────────────────
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    setTilt({
      x: -((e.clientY - cy) / cy) * 20,
      y:  ((e.clientX - cx) / cx) * 20,
    });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // ── Click anywhere — pulse + mantra cycle ───────────────────────────────
  const handleClick = () => {
    const id = pulseId.current++;
    setPulses(p => [...p.slice(-4), id]);
    setClickCount(c => c + 1);
    setCurrentMantra(MANTRAS[(clickCount + 1) % MANTRAS.length]);
  };

  // Radar size = 55% of shortest viewport side, capped
  const radarSize = Math.min(
    typeof window !== "undefined" ? Math.min(window.innerWidth, window.innerHeight) * 0.55 : 400,
    520
  );

  return (
    <div
      ref={stageRef}
      aria-hidden
      onClick={handleClick}
      className="fixed inset-0 z-0 pointer-events-auto overflow-hidden flex items-center justify-center select-none"
      style={{
        background: "radial-gradient(ellipse 90% 80% at 50% 52%, #0c0101 0%, #070707 50%, #020202 100%)",
      }}
    >
      {/* ── Dot grid ──────────────────────────────────────────────────────── */}
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

      {/* ── Ambient glow ──────────────────────────────────────────────────── */}
      <motion.div className="absolute rounded-full pointer-events-none" style={{
        width: radarSize * 1.1, height: radarSize * 1.1,
        background: "radial-gradient(circle, rgba(255,30,39,0.14) 0%, transparent 70%)",
        filter: "blur(50px)",
      }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Radar sweep ───────────────────────────────────────────────────── */}
      <div className="absolute pointer-events-none" style={{
        width: radarSize, height: radarSize,
        left: "50%", top: "50%",
        marginLeft: -radarSize/2, marginTop: -radarSize/2,
        borderRadius: "50%", overflow: "hidden",
      }}>
        <RadarSweep size={radarSize} />
      </div>

      {/* ── Static rings ──────────────────────────────────────────────────── */}
      {[0.5, 0.38, 0.27].map((frac, i) => {
        const r = radarSize * frac;
        return (
          <div key={i} className="absolute rounded-full pointer-events-none" style={{
            width: r*2, height: r*2, left:"50%", top:"50%",
            marginLeft: -r, marginTop: -r,
            border: `1px solid rgba(255,255,255,${0.05 + i*0.025})`,
          }} />
        );
      })}

      {/* ── Orbit rings ───────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" style={{ perspective:"900px", perspectiveOrigin:"50% 50%" }}>
        <OrbitRing radius={radarSize*0.48} speed={18} tiltX={tilt.x*0.6} tiltZ={0}   color="rgba(255,30,39,0.22)" dashed dotCount={2} />
        <OrbitRing radius={radarSize*0.38} speed={28} tiltX={-tilt.x*0.4} tiltZ={60} color="rgba(255,255,255,0.07)" />
        <OrbitRing radius={radarSize*0.28} speed={12} tiltX={tilt.x*0.8} tiltZ={120} color="rgba(255,30,39,0.15)" dashed />
      </div>

      {/* ── Particles ─────────────────────────────────────────────────────── */}
      <div className="absolute pointer-events-none" style={{ left:"50%",top:"50%",transform:"translate(-50%,-50%)" }}>
        {[...Array(12)].map((_, i) => (
          <Particle key={i} index={i} tiltX={tilt.x} tiltY={tilt.y} />
        ))}
      </div>

      {/* ── Corner brackets ───────────────────────────────────────────────── */}
      {[
        { top:"8%",  left:"6%",   rotate:"0deg"   },
        { top:"8%",  right:"6%",  rotate:"90deg"  },
        { bottom:"8%",left:"6%",  rotate:"-90deg" },
        { bottom:"8%",right:"6%", rotate:"180deg" },
      ].map((style: any, i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ ...style, width:24, height:24 }}
          animate={{ opacity:[0.2,0.6,0.2] }}
          transition={{ duration:2.5, repeat:Infinity, delay:i*0.4 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M0 10V0H10" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          </svg>
        </motion.div>
      ))}

      {/* ── 3D logo — scroll rotates it on X axis ─────────────────────────── */}
      <motion.div
        style={{ transformStyle:"preserve-3d", perspective:"900px" }}
        animate={{ rotateY: tilt.y, rotateX: tilt.x }}
        transition={{ type:"spring", stiffness:80, damping:18, mass:0.7 }}
        className="relative z-20 flex items-center justify-center"
      >
        {/* Pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence>
            {pulses.map(id => <PulseRing key={id} id={id} />)}
          </AnimatePresence>
        </div>

        {/* Inner glow */}
        <motion.div className="absolute rounded-full pointer-events-none" style={{
          width:180, height:180,
          background:"radial-gradient(circle, rgba(255,30,39,0.35) 0%, rgba(255,30,39,0.08) 50%, transparent 75%)",
          filter:"blur(20px)",
        }}
          animate={{ scale:[1,1.18,1], opacity:[0.6,1,0.6] }}
          transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut" }}
        />

        {/* Logo — rotates on X driven by scroll */}
        <motion.div style={{
          translateZ:"60px",
          rotateX: scrollSpring,
          filter:"drop-shadow(0 0 32px rgba(255,30,39,0.8)) drop-shadow(0 8px 24px rgba(255,30,39,0.5))",
        }}
          animate={{ scale: zoomLevel }}
          transition={{ type:"spring", stiffness:200, damping:16 }}
        >
          <YouTobiaMarkSVG size={Math.min(radarSize * 0.52, 220)} id="bg" />
        </motion.div>

        <div className="absolute rounded-full pointer-events-none" style={{
          width:110, height:110,
          background:"linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)",
          transform:"translateZ(85px)",
        }} />
      </motion.div>

      {/* ── Mantra — top right ─────────────────────────────────────────────── */}
      <div className="absolute top-6 right-6 z-30 max-w-[220px] text-right pointer-events-none">
        <div className="text-[8px] font-mono tracking-widest text-brand/80 uppercase font-black mb-1">
          CREATIVE DIRECTIVE // LIVE
        </div>
        <AnimatePresence mode="wait">
          <motion.p key={currentMantra}
            initial={{ opacity:0, y:-6, filter:"blur(4px)" }}
            animate={{ opacity:1, y:0, filter:"blur(0px)" }}
            exit={{ opacity:0, y:6, filter:"blur(4px)" }}
            transition={{ duration:0.3 }}
            className="text-[10px] text-white/40 font-sans italic leading-snug tracking-tight"
          >
            "{currentMantra}"
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── Studio bar — bottom ────────────────────────────────────────────── */}
      <div className="absolute bottom-5 inset-x-6 flex justify-between items-center text-[8px] font-mono tracking-widest text-brand/35 z-20 pointer-events-none select-none">
        <div className="flex items-center gap-1.5">
          <motion.span className="w-1.5 h-1.5 rounded-full bg-brand"
            animate={{ opacity:[1,0.2,1] }} transition={{ duration:1.2, repeat:Infinity }}
          />
          <span>YOUTOBIA MULTIMEDIA // LIVE</span>
        </div>
        <span className="hidden sm:block">ADDIS ABABA // 2026</span>
        <span>YOUTOBIA_STUDIOS</span>
      </div>
    </div>
  );
};

export default GlobalBackground;

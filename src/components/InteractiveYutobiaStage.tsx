import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimationFrame } from "motion/react";
import { Maximize2 } from "lucide-react";

type ViewportMode = "FREEFORM" | "ISOMETRIC";

const MANTRAS = [
  "Form demands absolute focus.",
  "Merge rich cultural myths with web interactions.",
  "Digital architecture built for immersive discovery.",
  "Rigor in execution, absolute design clarity.",
  "Harnessing distributed speed with local fidelity.",
  "Crafting high-contrast tactile ecosystems.",
];

// ─── Radar sweep line ────────────────────────────────────────────────────────
function RadarSweep({ size }: { size: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const angle = useRef(0);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2;

    ctx.clearRect(0, 0, size, size);

    // Sweeping gradient wedge
    angle.current = (angle.current + 0.012) % (Math.PI * 2);
    const sweep = angle.current;

    const grad = ctx.createConicalGradient
      ? null // not universally supported — fallback below
      : null;

    // Draw sweep using arc fill
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, sweep - 1.1, sweep, false);
    ctx.closePath();
    const sweepGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    sweepGrad.addColorStop(0, "rgba(255,30,39,0.0)");
    sweepGrad.addColorStop(0.5, "rgba(255,30,39,0.08)");
    sweepGrad.addColorStop(1, "rgba(255,30,39,0.28)");
    ctx.fillStyle = sweepGrad;
    ctx.fill();
    ctx.restore();

    // Sweep leading edge line
    ctx.save();
    ctx.translate(cx, cy);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(sweep) * r, Math.sin(sweep) * r);
    ctx.strokeStyle = "rgba(255,30,39,0.7)";
    ctx.lineWidth = 1.2;
    ctx.shadowColor = "#FF1E27";
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.restore();

    // Blip dots that appear near the sweep line
    for (let i = 0; i < 4; i++) {
      const blipAngle = sweep - 0.15 - i * 0.18;
      const blipR = r * (0.35 + ((i * 0.17 + angle.current * 0.3) % 0.6));
      const bx = cx + Math.cos(blipAngle) * blipR;
      const by = cy + Math.sin(blipAngle) * blipR;
      const alpha = Math.max(0, 0.9 - i * 0.22);
      ctx.beginPath();
      ctx.arc(bx, by, 2.5 - i * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,30,39,${alpha})`;
      ctx.shadowColor = "#FF1E27";
      ctx.shadowBlur = 6;
      ctx.fill();
    }
  });

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="absolute inset-0 pointer-events-none"
      style={{ borderRadius: "50%" }}
    />
  );
}

// ─── Orbiting energy ring ────────────────────────────────────────────────────
interface RingProps {
  radius: number;
  speed: number;
  tiltX: number;
  tiltZ: number;
  color: string;
  dashed?: boolean;
  dotCount?: number;
}

function OrbitRing({ radius, speed, tiltX, tiltZ, color, dashed = false, dotCount = 0 }: RingProps) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: radius * 2,
        height: radius * 2,
        left: "50%",
        top: "50%",
        marginLeft: -radius,
        marginTop: -radius,
        border: `1px ${dashed ? "dashed" : "solid"} ${color}`,
        transformStyle: "preserve-3d",
        transform: `rotateX(${tiltX}deg) rotateZ(${tiltZ}deg)`,
      }}
      animate={{ rotateZ: [tiltZ, tiltZ + 360] }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
    >
      {dotCount > 0 &&
        [...Array(dotCount)].map((_, i) => {
          const a = (i / dotCount) * Math.PI * 2;
          return (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 4,
                height: 4,
                background: color,
                boxShadow: `0 0 6px 2px ${color}`,
                left: "50%",
                top: "50%",
                transform: `translate(-50%, -50%) translate(${Math.cos(a) * radius}px, ${Math.sin(a) * radius}px)`,
              }}
            />
          );
        })}
    </motion.div>
  );
}

// ─── Floating particle ───────────────────────────────────────────────────────
function Particle({ index, tiltX, tiltY }: { index: number; tiltX: number; tiltY: number }) {
  const angle = (index / 12) * Math.PI * 2;
  const baseR = 80 + (index % 3) * 28;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: index % 3 === 0 ? 3 : 2,
        height: index % 3 === 0 ? 3 : 2,
        background: index % 4 === 0 ? "#FF1E27" : "rgba(255,255,255,0.6)",
        boxShadow: index % 4 === 0 ? "0 0 8px #FF1E27" : "0 0 4px rgba(255,255,255,0.4)",
        left: "50%",
        top: "50%",
      }}
      animate={{
        x: [
          Math.cos(angle) * baseR + tiltY * 0.6,
          Math.cos(angle + 0.4) * (baseR + 18) + tiltY * 0.6,
          Math.cos(angle) * baseR + tiltY * 0.6,
        ],
        y: [
          Math.sin(angle) * baseR - tiltX * 0.6,
          Math.sin(angle + 0.4) * (baseR + 12) - tiltX * 0.6,
          Math.sin(angle) * baseR - tiltX * 0.6,
        ],
        opacity: [0.3, 0.9, 0.3],
        scale: [0.8, 1.4, 0.8],
      }}
      transition={{
        duration: 3.5 + index * 0.4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: index * 0.2,
      }}
    />
  );
}

// ─── Energy pulse ring on click ──────────────────────────────────────────────
function PulseRing({ id }: { id: number }) {
  return (
    <motion.div
      key={id}
      className="absolute rounded-full pointer-events-none border border-brand"
      style={{ left: "50%", top: "50%", marginLeft: -75, marginTop: -75, width: 150, height: 150 }}
      initial={{ scale: 0.6, opacity: 0.8 }}
      animate={{ scale: 2.8, opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    />
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export const InteractiveYutobiaStage: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("FREEFORM");
  const [pulses, setPulses] = useState<number[]>([]);
  const [clickCount, setClickCount] = useState(0);
  const [currentMantra, setCurrentMantra] = useState(MANTRAS[0]);
  const [hudTab, setHudTab] = useState<"LAYERS" | "ANGLE" | "STATUS">("LAYERS");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [coherence, setCoherence] = useState(99.9);
  const pulseId = useRef(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!stageRef.current || viewportMode === "ISOMETRIC") return;
      const rect = stageRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / (rect.width / 2);
      const ny = (e.clientY - cy) / (rect.height / 2);
      setTilt({ x: -ny * 28, y: nx * 28 });
    },
    [viewportMode]
  );

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  const handleStageClick = () => {
    const id = pulseId.current++;
    setPulses((p) => [...p.slice(-4), id]);
    setClickCount((c) => c + 1);
    setCurrentMantra(MANTRAS[(clickCount + 1) % MANTRAS.length]);
    setCoherence(+(98.5 + Math.random() * 1.5).toFixed(1));
  };

  const activeTilt = viewportMode === "ISOMETRIC" ? { x: 38, y: -38 } : tilt;

  return (
    <div
      ref={stageRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        if (viewportMode === "FREEFORM") setTilt({ x: 0, y: 0 });
      }}
      className="relative w-full h-[480px] md:h-[580px] rounded-3xl overflow-hidden flex items-center justify-center cursor-crosshair select-none"
      style={{
        background: "radial-gradient(ellipse 80% 70% at 50% 55%, #0d0101 0%, #080808 55%, #020202 100%)",
        boxShadow: isHovered
          ? "0 0 80px rgba(255,30,39,0.12), inset 0 0 60px rgba(255,30,39,0.04)"
          : "0 0 40px rgba(0,0,0,0.6)",
      }}
      id="yutobia-interactive-stage"
      onClick={handleStageClick}
    >
      {/* ── Grid dot pattern ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="stageDots" width="28" height="28" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="0.9" fill="rgba(255,255,255,0.35)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stageDots)" />
        </svg>
      </div>

      {/* ── Ambient radial glow ───────────────────────────────────────────── */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 360,
          height: 360,
          background: "radial-gradient(circle, rgba(255,30,39,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{ scale: isHovered ? [1, 1.12, 1] : 1, opacity: isHovered ? [0.7, 1, 0.7] : 0.5 }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ── Radar sweep (canvas) ──────────────────────────────────────────── */}
      <div className="absolute" style={{ width: 340, height: 340, left: "50%", top: "50%", marginLeft: -170, marginTop: -170, borderRadius: "50%", overflow: "hidden" }}>
        <RadarSweep size={340} />
      </div>

      {/* ── Static ring outlines ──────────────────────────────────────────── */}
      {[{ r: 155, op: 0.06 }, { r: 120, op: 0.09 }, { r: 85, op: 0.12 }].map(({ r, op }, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: r * 2,
            height: r * 2,
            left: "50%",
            top: "50%",
            marginLeft: -r,
            marginTop: -r,
            border: `1px solid rgba(255,255,255,${op})`,
          }}
        />
      ))}

      {/* ── 3D orbit rings ────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ perspective: "800px", perspectiveOrigin: "50% 50%" }}
      >
        <OrbitRing radius={148} speed={18} tiltX={activeTilt.x * 0.6} tiltZ={0} color="rgba(255,30,39,0.22)" dashed dotCount={2} />
        <OrbitRing radius={118} speed={28} tiltX={-activeTilt.x * 0.4} tiltZ={60} color="rgba(255,255,255,0.07)" />
        <OrbitRing radius={88} speed={12} tiltX={activeTilt.x * 0.8} tiltZ={120} color="rgba(255,30,39,0.15)" dashed />
      </div>

      {/* ── Floating particles ────────────────────────────────────────────── */}
      <div className="absolute pointer-events-none" style={{ left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
        {[...Array(12)].map((_, i) => (
          <Particle key={i} index={i} tiltX={activeTilt.x} tiltY={activeTilt.y} />
        ))}
      </div>

      {/* ── Corner targeting brackets ─────────────────────────────────────── */}
      {[
        { top: "14%", left: "12%", rotate: "0deg" },
        { top: "14%", right: "12%", rotate: "90deg" },
        { bottom: "14%", left: "12%", rotate: "-90deg" },
        { bottom: "14%", right: "12%", rotate: "180deg" },
      ].map((style, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ ...style, width: 20, height: 20 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.4 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M0 8V0H8" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />
          </svg>
        </motion.div>
      ))}

      {/* ── Main 3D logo card ─────────────────────────────────────────────── */}
      <motion.div
        style={{ transformStyle: "preserve-3d", perspective: "900px" }}
        animate={{
          rotateX: activeTilt.x,
          rotateY: activeTilt.y,
        }}
        transition={{ type: "spring", stiffness: 80, damping: 18, mass: 0.7 }}
        className="relative z-20 flex items-center justify-center"
      >
        {/* Click pulse rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <AnimatePresence>
            {pulses.map((id) => (
              <PulseRing key={id} id={id} />
            ))}
          </AnimatePresence>
        </div>

        {/* Inner glow sphere behind logo */}
        <motion.div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 160,
            height: 160,
            background: "radial-gradient(circle, rgba(255,30,39,0.35) 0%, rgba(255,30,39,0.08) 50%, transparent 75%)",
            filter: "blur(18px)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* SVG Logo */}
        <motion.svg
          width="180"
          height="180"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ translateZ: "60px", filter: "drop-shadow(0 0 30px rgba(255,30,39,0.7)) drop-shadow(0 8px 24px rgba(255,30,39,0.4))" }}
          animate={{ scale: zoomLevel }}
          transition={{ type: "spring", stiffness: 200, damping: 16 }}
        >
          <defs>
            <linearGradient id="stageRedCore" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FF8086" />
              <stop offset="45%" stopColor="#FF1E27" />
              <stop offset="100%" stopColor="#6B0306" />
            </linearGradient>
            <linearGradient id="stageRibbon" x1="40" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FFD0D2" />
              <stop offset="100%" stopColor="#FF1E27" />
            </linearGradient>
            <filter id="stageGlow">
              <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#FF1E27" floodOpacity="0.6" />
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#FF8086" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Structural guide circles */}
          <circle cx="60" cy="60" r="52" stroke="rgba(255,30,39,0.18)" strokeWidth="0.8" strokeDasharray="3 5" />
          <circle cx="60" cy="60" r="42" stroke="rgba(255,30,39,0.10)" strokeWidth="0.6" strokeDasharray="1 4" />

          {/* Globe crest */}
          <path
            d="M 60,11 C 30,11 11,32 11,60 C 11,88 28,103 48,107 C 49,90 41,79 34,71 C 26,62 19,53 23,40 C 27,27 39,21 54,23 C 71,25 80,39 82,53 C 84,67 76,80 66,86 C 65,86 52,90 40,84 C 55,94 77,93 89,81 C 102,68 104,45 94,30 C 86,18 73,11 60,11 Z"
            fill="url(#stageRedCore)"
            filter="url(#stageGlow)"
          />

          {/* Ribbon */}
          <path
            d="M 42,32 C 40,45 42,55 48,65 C 55,75 66,78 78,74 C 92,70 102,54 96,38 C 94,33 88,40 85,45 C 77,58 64,62 55,54 C 49,49 48,38 46,30 C 45,26 43,26 42,32 Z"
            fill="url(#stageRibbon)"
          />

          {/* Core energy node */}
          <motion.circle
            cx="60" cy="60" r="5"
            fill="white"
            animate={{ r: [4.5, 6.5, 4.5], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Base sweep */}
          <path
            d="M 48,107 C 42,108 34,103 28,100 C 24,96 16,78 18,65 C 19,64 21,68 22,72 C 26,88 36,98 48,103 Z"
            fill="#FF8086"
          />
        </motion.svg>

        {/* 3D face depth plane — subtle surface shine */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: 100,
            height: 100,
            background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)",
            transform: "translateZ(80px)",
          }}
        />
      </motion.div>

      {/* ── Mode toggle + zoom — top-left ─────────────────────────────────── */}
      <div
        className="absolute top-4 left-4 z-30 flex items-center gap-1 p-1 rounded-xl backdrop-blur-md border border-white/10"
        style={{ background: "rgba(10,10,10,0.75)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {(["FREEFORM", "ISOMETRIC"] as ViewportMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              setViewportMode(mode);
              setTilt(mode === "ISOMETRIC" ? { x: 38, y: -38 } : { x: 0, y: 0 });
            }}
            className={`px-3 py-1.5 text-[9px] font-mono tracking-wider font-bold rounded-lg transition-all cursor-pointer ${
              viewportMode === mode
                ? "bg-brand text-white shadow-[0_0_12px_rgba(255,30,39,0.5)]"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            {mode}
          </button>
        ))}
        <div className="w-px h-4 bg-white/10 mx-0.5" />
        <button
          onClick={() => setZoomLevel((z) => (z === 1 ? 1.18 : 1))}
          className="p-1.5 rounded-lg text-white/40 hover:text-brand transition-colors cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Mantra — top-right ────────────────────────────────────────────── */}
      <div className="absolute top-4 right-4 z-30 max-w-[200px] text-right pointer-events-none">
        <div className="text-[8px] font-mono tracking-widest text-brand/80 uppercase font-black mb-1">
          CREATIVE DIRECTIVE // LIVE
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={currentMantra}
            initial={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="text-[10px] text-white/50 font-sans italic leading-snug tracking-tight"
          >
            "{currentMantra}"
          </motion.p>
        </AnimatePresence>
      </div>

      {/* ── HUD panel — bottom ────────────────────────────────────────────── */}
      <div
        className="absolute bottom-12 left-5 right-5 z-30 flex justify-between items-center py-2 px-4 rounded-2xl backdrop-blur-md border border-white/[0.07]"
        style={{ background: "rgba(8,8,8,0.85)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex gap-4">
          {(["LAYERS", "ANGLE", "STATUS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setHudTab(tab)}
              className={`text-[8.5px] font-mono font-black tracking-widest cursor-pointer transition-colors ${
                hudTab === tab ? "text-brand" : "text-white/30 hover:text-white/60"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="text-[8.5px] font-mono tracking-wider text-white/40">
          {hudTab === "LAYERS" && "EMBLEM CORE v2.0 // BRAND SCALING"}
          {hudTab === "ANGLE" && `ROTATION_X: ${activeTilt.x.toFixed(0)}° // ROTATION_Y: ${activeTilt.y.toFixed(0)}°`}
          {hudTab === "STATUS" && `COHERENCE: ${coherence}% // ACTIVE LOOP`}
        </div>
      </div>

      {/* ── Studio credit bar — bottom edge ──────────────────────────────── */}
      <div className="absolute bottom-4 inset-x-5 flex justify-between items-center text-[8px] font-mono tracking-widest text-brand/40 z-20 pointer-events-none select-none">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-brand"
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <span>INTERACTIVE DESIGN DEMO // READY</span>
        </div>
        <span className="hidden sm:block">STUDIO VERSION // 2026.06</span>
        <span>YOUTOBIA_STUDIOS</span>
      </div>
    </div>
  );
};

export default InteractiveYutobiaStage;

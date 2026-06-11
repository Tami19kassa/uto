import React from "react";
import { motion } from "motion/react";

/**
 * SectionBackground — gives each section its own distinct animated decoration.
 * All variants share a dark base (neutral-950 / #060606) in dark mode,
 * white/neutral in light mode. The decorations are purely ornamental and
 * pointer-events: none so they never block interaction.
 *
 * Variants:
 *  "ecosystem"   — rotating 3D wireframe cube
 *  "story"       — floating geometric rings / orbits
 *  "enqoq"       — pulsing radial grid burst
 *  "studio"      — diagonal sweeping lines
 *  "vision"      — dark with large rotating diamond
 *  "media"       — floating equaliser bars
 *  "connect"     — subtle gradient mesh
 */

// ─── 3D Wireframe Cube ───────────────────────────────────────────────────────
function WireframeCube({ size = 220 }: { size?: number }) {
  const s = size / 2;
  // 8 vertices of a cube centred at origin
  const vertices = [
    [-s, -s, -s], [ s, -s, -s], [ s,  s, -s], [-s,  s, -s],
    [-s, -s,  s], [ s, -s,  s], [ s,  s,  s], [-s,  s,  s],
  ] as [number, number, number][];

  // 12 edges [vertexA, vertexB]
  const edges: [number, number][] = [
    [0,1],[1,2],[2,3],[3,0], // back face
    [4,5],[5,6],[6,7],[7,4], // front face
    [0,4],[1,5],[2,6],[3,7], // connecting edges
  ];

  // Simple isometric-ish projection with rotation driven by CSS
  const project = ([x, y, z]: [number, number, number]) => {
    const rotY = 35 * (Math.PI / 180);
    const rotX = 25 * (Math.PI / 180);
    const x2 = x * Math.cos(rotY) + z * Math.sin(rotY);
    const z2 = -x * Math.sin(rotY) + z * Math.cos(rotY);
    const y2 = y * Math.cos(rotX) - z2 * Math.sin(rotX);
    return { px: x2 + size, py: y2 + size };
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ width: size * 2, height: size * 2 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
    >
      <svg width={size * 2} height={size * 2} viewBox={`0 0 ${size * 2} ${size * 2}`} fill="none">
        {edges.map(([a, b], i) => {
          const pa = project(vertices[a]);
          const pb = project(vertices[b]);
          return (
            <line
              key={i}
              x1={pa.px} y1={pa.py}
              x2={pb.px} y2={pb.py}
              stroke="rgba(255,30,39,0.25)"
              strokeWidth="1"
            />
          );
        })}
        {vertices.map((v, i) => {
          const p = project(v);
          return (
            <circle key={i} cx={p.px} cy={p.py} r="2.5"
              fill="rgba(255,30,39,0.4)" />
          );
        })}
      </svg>
    </motion.div>
  );
}

// ─── Floating orbit rings ────────────────────────────────────────────────────
function OrbitDecor() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {[200, 300, 420].map((r, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-brand/10"
          style={{ width: r, height: r }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 18 + i * 8, repeat: Infinity, ease: "linear" }}
        >
          <div
            className="absolute w-2 h-2 rounded-full bg-brand/40"
            style={{ top: -4, left: "50%", transform: "translateX(-50%)" }}
          />
        </motion.div>
      ))}
    </div>
  );
}

// ─── Radial pulse grid ───────────────────────────────────────────────────────
function RadialGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-brand/8"
          style={{ width: i * 180, height: i * 180 }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}
      {/* Radial lines */}
      <svg className="absolute w-full h-full opacity-5" viewBox="0 0 800 600">
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          return (
            <line key={i}
              x1="400" y1="300"
              x2={400 + Math.cos(angle) * 600}
              y2={300 + Math.sin(angle) * 600}
              stroke="#FF1E27" strokeWidth="0.5"
            />
          );
        })}
      </svg>
    </div>
  );
}

// ─── Diagonal sweep lines ────────────────────────────────────────────────────
function DiagonalLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg width="100%" height="100%" className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={i}
            x1={`${i * 14}%`} y1="0%"
            x2={`${i * 14 + 30}%`} y2="100%"
            stroke="rgba(255,30,39,0.12)"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, delay: i * 0.15, ease: "easeOut" }}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── Rotating diamond ────────────────────────────────────────────────────────
function RotatingDiamond() {
  return (
    <motion.div
      className="absolute pointer-events-none opacity-8"
      style={{ width: 500, height: 500 }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    >
      <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
        <rect
          x="100" y="100" width="300" height="300"
          transform="rotate(45 250 250)"
          stroke="rgba(255,30,39,0.2)" strokeWidth="1.5" fill="none"
        />
        <rect
          x="140" y="140" width="220" height="220"
          transform="rotate(45 250 250)"
          stroke="rgba(255,30,39,0.12)" strokeWidth="1" fill="none"
        />
        <rect
          x="180" y="180" width="140" height="140"
          transform="rotate(45 250 250)"
          stroke="rgba(255,30,39,0.08)" strokeWidth="0.5" fill="none"
        />
      </svg>
    </motion.div>
  );
}

// ─── Equaliser bars ──────────────────────────────────────────────────────────
function EqualiserBars() {
  const heights = [40, 80, 55, 100, 65, 90, 45, 75, 60, 85];
  return (
    <div className="absolute bottom-0 left-0 right-0 pointer-events-none flex items-end justify-center gap-3 px-8 opacity-10">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className="w-4 rounded-t-sm bg-brand"
          style={{ height: h }}
          animate={{ height: [h * 0.3, h, h * 0.5, h * 0.8, h * 0.3] }}
          transition={{ duration: 1.5 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 }}
        />
      ))}
    </div>
  );
}

// ─── Gradient mesh ───────────────────────────────────────────────────────────
function GradientMesh() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,30,39,0.06) 0%, transparent 65%)",
          filter: "blur(60px)",
          top: "10%", left: "60%",
        }}
        animate={{ scale: [1, 1.15, 1], x: [-20, 20, -20] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,30,39,0.04) 0%, transparent 65%)",
          filter: "blur(50px)",
          bottom: "15%", left: "5%",
        }}
        animate={{ scale: [1.1, 1, 1.1], y: [-15, 15, -15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

// ─── Floating 3D boxes ───────────────────────────────────────────────────────
function FloatingBoxes() {
  const boxes = [
    { size: 60, top: "15%", left: "8%",  delay: 0,   dur: 6  },
    { size: 40, top: "25%", right: "10%",delay: 0.8, dur: 8  },
    { size: 80, bottom:"20%",left: "12%",delay: 1.2, dur: 7  },
    { size: 50, top: "60%", right: "8%", delay: 0.4, dur: 9  },
    { size: 30, top: "40%", left: "5%",  delay: 1.6, dur: 5  },
  ];
  return (
    <>
      {boxes.map((b, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none border border-brand/20"
          style={{
            width: b.size, height: b.size,
            top: b.top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom,
          }}
          animate={{
            y: [-12, 12, -12],
            rotate: [0, 90, 180, 270, 360],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            y: { duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay },
            rotate: { duration: b.dur * 2, repeat: Infinity, ease: "linear" },
            opacity: { duration: b.dur, repeat: Infinity, ease: "easeInOut", delay: b.delay },
          }}
        >
          {/* Inner cross */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-brand/15" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-full bg-brand/15" />
          </div>
        </motion.div>
      ))}
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
type SectionVariant = "ecosystem" | "story" | "enqoq" | "studio" | "vision" | "media" | "connect";

interface SectionBackgroundProps {
  variant: SectionVariant;
  className?: string;
}

export const SectionBackground: React.FC<SectionBackgroundProps> = ({ variant, className = "" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>

      {/* ── Base ambient glow — every section gets this ─────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: variant === "vision"
            ? "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(255,30,39,0.06) 0%, transparent 65%)"
            : "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,30,39,0.04) 0%, transparent 70%)",
        }}
      />

      {/* ── Dot grid — every section ────────────────────────────────────── */}
      <div className="absolute inset-0 huge-grid-pattern opacity-20 dark:opacity-30" />

      {/* ── Variant-specific decorations ────────────────────────────────── */}
      {variant === "ecosystem" && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <WireframeCube size={180} />
          </div>
          <FloatingBoxes />
        </>
      )}

      {variant === "story" && <OrbitDecor />}

      {variant === "enqoq" && (
        <>
          <RadialGrid />
          <div className="absolute bottom-0 inset-x-0">
            <EqualiserBars />
          </div>
        </>
      )}

      {variant === "studio" && (
        <>
          <DiagonalLines />
          <FloatingBoxes />
        </>
      )}

      {variant === "vision" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <RotatingDiamond />
        </div>
      )}

      {variant === "media" && (
        <>
          <OrbitDecor />
          <EqualiserBars />
        </>
      )}

      {variant === "connect" && <GradientMesh />}
    </div>
  );
};

export default SectionBackground;

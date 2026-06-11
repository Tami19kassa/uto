import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "../lib/gsap";

/**
 * SectionBackground — GSAP-animated per-section decorative backgrounds.
 * Fully replaces the motion/react version.
 */

// ─── 3D Wireframe Cube (SVG, rotated by GSAP) ───────────────────────────────
function WireframeCube({ size = 220 }: { size?: number }) {
  const ref = useRef<SVGSVGElement>(null);
  const s = size / 2;

  const vertices: [number, number, number][] = [
    [-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],
    [-s,-s,s],[s,-s,s],[s,s,s],[-s,s,s],
  ];
  const edges: [number,number][] = [
    [0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
  ];

  const project = ([x,y,z]:[number,number,number], rotY: number, rotX: number) => {
    const x2 = x*Math.cos(rotY) + z*Math.sin(rotY);
    const z2 = -x*Math.sin(rotY) + z*Math.cos(rotY);
    const y2 = y*Math.cos(rotX) - z2*Math.sin(rotX);
    return { px: x2+size, py: y2+size };
  };

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let angle = 0;
    const ticker = gsap.ticker.add(() => {
      angle += 0.008;
      const rY = angle;
      const rX = 0.4;
      const lines = el.querySelectorAll("line");
      const circles = el.querySelectorAll("circle");
      edges.forEach(([a,b], i) => {
        const pa = project(vertices[a], rY, rX);
        const pb = project(vertices[b], rY, rX);
        const ln = lines[i] as SVGLineElement;
        if (ln) {
          ln.setAttribute("x1", String(pa.px));
          ln.setAttribute("y1", String(pa.py));
          ln.setAttribute("x2", String(pb.px));
          ln.setAttribute("y2", String(pb.py));
        }
      });
      vertices.forEach((v, i) => {
        const p = project(v, rY, rX);
        const c = circles[i] as SVGCircleElement;
        if (c) { c.setAttribute("cx", String(p.px)); c.setAttribute("cy", String(p.py)); }
      });
    });
    return () => gsap.ticker.remove(ticker);
  }, []);

  const pa0 = project(vertices[0], 0.6, 0.4);
  const pb0 = project(vertices[1], 0.6, 0.4);

  return (
    <div className="absolute pointer-events-none" style={{ width: size*2, height: size*2 }}>
      <svg ref={ref} width={size*2} height={size*2} viewBox={`0 0 ${size*2} ${size*2}`} fill="none">
        {edges.map(([a,b],i) => {
          const pa = project(vertices[a],0.6,0.4);
          const pb = project(vertices[b],0.6,0.4);
          return <line key={i} x1={pa.px} y1={pa.py} x2={pb.px} y2={pb.py} stroke="rgba(255,30,39,0.25)" strokeWidth="1" />;
        })}
        {vertices.map((v,i) => {
          const p = project(v,0.6,0.4);
          return <circle key={i} cx={p.px} cy={p.py} r="2.5" fill="rgba(255,30,39,0.4)" />;
        })}
      </svg>
    </div>
  );
}

// ─── Floating orbit rings (GSAP ticker rotation) ─────────────────────────────
function OrbitDecor() {
  const refs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const sizes = [200, 300, 420];

  useLayoutEffect(() => {
    const angles = [0, 0, 0];
    const speeds = [0.006, -0.004, 0.003];
    const ticker = gsap.ticker.add(() => {
      refs.forEach((ref, i) => {
        if (!ref.current) return;
        angles[i] += speeds[i];
        gsap.set(ref.current, { rotate: angles[i] * (180/Math.PI) });
      });
    });
    return () => gsap.ticker.remove(ticker);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {sizes.map((r, i) => (
        <div
          key={i}
          ref={refs[i]}
          className="absolute rounded-full border border-brand/10"
          style={{ width: r, height: r }}
        >
          <div className="absolute w-2 h-2 rounded-full bg-brand/40"
            style={{ top: -4, left: "50%", transform: "translateX(-50%)" }} />
        </div>
      ))}
    </div>
  );
}

// ─── Radial pulse grid (GSAP pulsing) ────────────────────────────────────────
function RadialGrid() {
  const ringRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ringRefs.forEach((ref, i) => {
        if (!ref.current) return;
        gsap.to(ref.current, {
          scale: 1.08,
          opacity: 0.8,
          duration: 3 + i * 0.7,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.4,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {[1,2,3,4].map((i) => (
        <div
          key={i}
          ref={ringRefs[i-1]}
          className="absolute rounded-full border border-brand/8"
          style={{ width: i*180, height: i*180, opacity: 0.4 }}
        />
      ))}
      <svg className="absolute w-full h-full opacity-5" viewBox="0 0 800 600">
        {[...Array(12)].map((_,i) => {
          const angle = (i/12)*Math.PI*2;
          return <line key={i} x1="400" y1="300"
            x2={400+Math.cos(angle)*600} y2={300+Math.sin(angle)*600}
            stroke="#FF1E27" strokeWidth="0.5" />;
        })}
      </svg>
    </div>
  );
}

// ─── Diagonal sweep lines (GSAP drawSVG-like scaleX reveal) ─────────────────
function DiagonalLines() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const lines = containerRef.current?.querySelectorAll("line");
      if (!lines) return;
      gsap.from(lines, {
        attr: { x2: (i: number, el: SVGLineElement) => el.getAttribute("x1"), y2: "0%" },
        duration: 2.5,
        ease: "power2.out",
        stagger: 0.15,
        opacity: 0,
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      <svg width="100%" height="100%" className="absolute inset-0">
        {[...Array(8)].map((_,i) => (
          <line key={i}
            x1={`${i*14}%`} y1="0%"
            x2={`${i*14+30}%`} y2="100%"
            stroke="rgba(255,30,39,0.12)" strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
}

// ─── Rotating diamond (GSAP ticker) ──────────────────────────────────────────
function RotatingDiamond() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        rotate: 360,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="absolute pointer-events-none opacity-8"
      style={{ width: 500, height: 500 }}>
      <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
        <rect x="100" y="100" width="300" height="300" transform="rotate(45 250 250)"
          stroke="rgba(255,30,39,0.2)" strokeWidth="1.5" fill="none" />
        <rect x="140" y="140" width="220" height="220" transform="rotate(45 250 250)"
          stroke="rgba(255,30,39,0.12)" strokeWidth="1" fill="none" />
        <rect x="180" y="180" width="140" height="140" transform="rotate(45 250 250)"
          stroke="rgba(255,30,39,0.08)" strokeWidth="0.5" fill="none" />
      </svg>
    </div>
  );
}

// ─── Equaliser bars (GSAP stagger height animation) ──────────────────────────
function EqualiserBars() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heights = [40,80,55,100,65,90,45,75,60,85];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const bars = containerRef.current?.querySelectorAll(".eq-bar");
      if (!bars) return;
      bars.forEach((bar, i) => {
        const h = heights[i];
        gsap.to(bar, {
          height: h,
          duration: 1.5 + i*0.1,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: i * 0.08,
        });
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}
      className="absolute bottom-0 left-0 right-0 pointer-events-none flex items-end justify-center gap-3 px-8 opacity-10">
      {heights.map((h,i) => (
        <div key={i} className="eq-bar w-4 rounded-t-sm bg-brand"
          style={{ height: h * 0.3 }} />
      ))}
    </div>
  );
}

// ─── Gradient mesh (GSAP floating blobs) ─────────────────────────────────────
function GradientMesh() {
  const blob1 = useRef<HTMLDivElement>(null);
  const blob2 = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(blob1.current, {
        scale: 1.15,
        x: 20,
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(blob2.current, {
        scale: 1.1,
        y: 15,
        duration: 10,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 1,
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div ref={blob1} className="absolute w-[600px] h-[600px] rounded-full"
        style={{ background:"radial-gradient(circle,rgba(255,30,39,0.06) 0%,transparent 65%)",
          filter:"blur(60px)", top:"10%", left:"60%" }} />
      <div ref={blob2} className="absolute w-[400px] h-[400px] rounded-full"
        style={{ background:"radial-gradient(circle,rgba(255,30,39,0.04) 0%,transparent 65%)",
          filter:"blur(50px)", bottom:"15%", left:"5%" }} />
    </div>
  );
}

// ─── Floating boxes (GSAP float + spin) ──────────────────────────────────────
function FloatingBoxes() {
  const boxRefs = [
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];
  const boxes = [
    { size:60, top:"15%",  left:"8%",   delay:0,   dur:6  },
    { size:40, top:"25%",  right:"10%", delay:0.8, dur:8  },
    { size:80, bottom:"20%",left:"12%", delay:1.2, dur:7  },
    { size:50, top:"60%",  right:"8%",  delay:0.4, dur:9  },
    { size:30, top:"40%",  left:"5%",   delay:1.6, dur:5  },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      boxRefs.forEach((ref, i) => {
        if (!ref.current) return;
        const b = boxes[i];
        gsap.to(ref.current, {
          y: 12,
          duration: b.dur,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: b.delay,
        });
        gsap.to(ref.current, {
          rotate: 360,
          duration: b.dur * 2,
          ease: "none",
          repeat: -1,
        });
        gsap.to(ref.current, {
          opacity: 0.7,
          duration: b.dur,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
          delay: b.delay,
        });
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <>
      {boxes.map((b,i) => (
        <div key={i} ref={boxRefs[i]}
          className="absolute pointer-events-none border border-brand/20"
          style={{ width:b.size, height:b.size,
            top:(b as any).top, left:(b as any).left,
            right:(b as any).right, bottom:(b as any).bottom,
            opacity: 0.3 }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-brand/15" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-px h-full bg-brand/15" />
          </div>
        </div>
      ))}
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
type SectionVariant = "ecosystem"|"story"|"enqoq"|"studio"|"vision"|"media"|"connect";

interface SectionBackgroundProps {
  variant: SectionVariant;
  className?: string;
}

export const SectionBackground: React.FC<SectionBackgroundProps> = ({ variant, className="" }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="absolute inset-0"
        style={{ background: variant==="vision"
          ? "radial-gradient(ellipse 80% 60% at 50% 40%,rgba(255,30,39,0.06) 0%,transparent 65%)"
          : "radial-gradient(ellipse 70% 50% at 50% 50%,rgba(255,30,39,0.04) 0%,transparent 70%)" }} />

      <div className="absolute inset-0 huge-grid-pattern opacity-20 dark:opacity-30" />

      {variant==="ecosystem" && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <WireframeCube size={180} />
          </div>
          <FloatingBoxes />
        </>
      )}

      {variant==="story" && <OrbitDecor />}

      {variant==="enqoq" && (
        <>
          <RadialGrid />
          <div className="absolute bottom-0 inset-x-0"><EqualiserBars /></div>
        </>
      )}

      {variant==="studio" && (
        <>
          <DiagonalLines />
          <FloatingBoxes />
        </>
      )}

      {variant==="vision" && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <RotatingDiamond />
        </div>
      )}

      {variant==="media" && (
        <>
          <OrbitDecor />
          <EqualiserBars />
        </>
      )}

      {variant==="connect" && <GradientMesh />}
    </div>
  );
};

export default SectionBackground;

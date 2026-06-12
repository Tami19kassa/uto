import React, { useRef, useLayoutEffect } from "react";
import { gsap } from "../lib/gsap";

/**
 * AnimatedBackground
 *
 * Pure CSS + GSAP animated background.
 * No WebGL. No canvas. All DOM elements.
 *
 * Contents:
 *  — Large rotating 3D icosahedron wireframe (CSS 3D transforms)
 *  — 3 overlapping orbiting rings at different 3D tilts
 *  — 20 floating particles with random drift
 *  — Scroll-driven rotation of the whole scene
 *  — Mouse parallax on two layers
 *  — Section-based colour pulse (emissive glow ring)
 */

const RING_CONFIGS = [
  { size: 520, tiltX: 62,  tiltZ: 18,  speed: 18,  opacity: 0.18 },
  { size: 680, tiltX: -38, tiltZ: 75,  speed: 28,  opacity: 0.12 },
  { size: 820, tiltX: 22,  tiltZ: -50, speed: 14,  opacity: 0.10 },
  { size: 360, tiltX: 80,  tiltZ: 12,  speed: 10,  opacity: 0.22 },
  { size: 960, tiltX: -55, tiltZ: 35,  speed: 22,  opacity: 0.07 },
];

export const AnimatedBackground: React.FC = () => {
  const sceneRef      = useRef<HTMLDivElement>(null);
  const crystalRef    = useRef<HTMLDivElement>(null);
  const layer1Ref     = useRef<HTMLDivElement>(null);
  const layer2Ref     = useRef<HTMLDivElement>(null);
  const glowRef       = useRef<HTMLDivElement>(null);
  const ringRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const particleRefs  = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const crystal = crystalRef.current;
      const scene   = sceneRef.current;
      if (!crystal || !scene) return;

      // ── Crystal: continuous rotation ──────────────────────────────
      gsap.to(crystal, {
        rotateY: 360,
        duration: 22,
        ease: "none",
        repeat: -1,
      });
      gsap.to(crystal, {
        rotateX: 360,
        duration: 38,
        ease: "none",
        repeat: -1,
      });

      // ── Crystal: gentle float ─────────────────────────────────────
      gsap.to(crystal, {
        y: -28,
        duration: 3.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // ── Crystal: scale pulse ──────────────────────────────────────
      gsap.to(crystal, {
        scale: 1.06,
        duration: 2.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // ── Rings: continuous spin ─────────────────────────────────────
      ringRefs.current.forEach((ring, i) => {
        if (!ring) return;
        const cfg = RING_CONFIGS[i];
        gsap.to(ring, {
          rotateZ: `+=${i % 2 === 0 ? 360 : -360}`,
          duration: cfg.speed,
          ease: "none",
          repeat: -1,
        });
      });

      // ── Particles: random drift loops ─────────────────────────────
      particleRefs.current.forEach((p, i) => {
        if (!p) return;
        const dur  = 4 + Math.random() * 6;
        const xAmt = (Math.random() - 0.5) * 80;
        const yAmt = (Math.random() - 0.5) * 80;
        gsap.to(p, {
          x: xAmt,
          y: yAmt,
          scale: 0.4 + Math.random() * 1.2,
          opacity: 0.15 + Math.random() * 0.6,
          duration: dur,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          delay: Math.random() * 4,
        });
      });

      // ── Glow ring pulse ───────────────────────────────────────────
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          scale: 1.35,
          opacity: 0.06,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

      // ── Mouse parallax ────────────────────────────────────────────
      const onMouse = (e: MouseEvent) => {
        const mx = (e.clientX / window.innerWidth  - 0.5) * 2;
        const my = (e.clientY / window.innerHeight - 0.5) * 2;

        gsap.to(layer1Ref.current, {
          x: mx * 35,
          y: my * 25,
          rotateY: mx * 8,
          rotateX: -my * 6,
          duration: 1.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(layer2Ref.current, {
          x: mx * -18,
          y: my * -12,
          duration: 2.0,
          ease: "power2.out",
          overwrite: "auto",
        });
      };
      window.addEventListener("mousemove", onMouse, { passive: true });

      // ── Scroll → crystal Z-rotation ───────────────────────────────
      let lastSY = 0;
      let velY   = 0;
      const onScroll = () => {
        const delta = window.scrollY - lastSY;
        lastSY = window.scrollY;
        velY  += delta * 0.08;

        gsap.to(crystal, {
          rotateZ: `+=${velY}`,
          duration: 1.2,
          ease: "power2.out",
          overwrite: "auto",
        });

        // Scroll progress → scene scale
        const prog = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
        gsap.to(scene, {
          scale: 1 + prog * 0.15,
          duration: 0.8,
          ease: "power2.out",
          overwrite: "auto",
        });

        velY *= 0.85;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      // ── Section-based glow colour shift ───────────────────────────
      const SECTIONS = ["home","ecosystem","enqoq-cash","studio","vision","media-hub","connect"];
      const COLORS   = [
        "#FF1E27", "#CC0010", "#FF1E27",
        "#FF4422", "#FF1E27", "#CC0010", "#FF1E27",
      ];
      let lastSec = 0;
      const onSecScroll = () => {
        const pos = window.scrollY + window.innerHeight * 0.4;
        SECTIONS.forEach((id, i) => {
          const el = document.getElementById(id);
          if (!el) return;
          if (pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight && i !== lastSec) {
            lastSec = i;
            // Pulse the glow ring with the section colour
            if (glowRef.current) {
              gsap.to(glowRef.current, {
                background: `radial-gradient(circle, ${COLORS[i]} 0%, transparent 70%)`,
                scale: 1.6,
                opacity: 0.18,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                  gsap.to(glowRef.current, {
                    scale: 1.0,
                    opacity: 0.04,
                    duration: 1.2,
                    ease: "power2.in",
                  });
                },
              });
            }
          }
        });
      };
      window.addEventListener("scroll", onSecScroll, { passive: true });

      return () => {
        window.removeEventListener("mousemove", onMouse);
        window.removeEventListener("scroll",    onScroll);
        window.removeEventListener("scroll",    onSecScroll);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Ambient glow — always centered */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{
          width: 900, height: 900,
          background: "radial-gradient(circle, #FF1E27 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.04,
        }}
      />

      {/* Scene wrapper — mouse parallax layer 2 (slow, reverse) */}
      <div
        ref={layer2Ref}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1200px" }}
      >
        {/* Orbiting rings */}
        {RING_CONFIGS.map((cfg, i) => (
          <div
            key={i}
            ref={el => { ringRefs.current[i] = el; }}
            className="absolute rounded-full border border-brand pointer-events-none"
            style={{
              width:  cfg.size,
              height: cfg.size,
              opacity: cfg.opacity,
              transform: `rotateX(${cfg.tiltX}deg) rotateZ(${cfg.tiltZ}deg)`,
              transformStyle: "preserve-3d",
            }}
          />
        ))}

        {/* Particles */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle  = (i / 20) * Math.PI * 2;
          const radius = 180 + (i % 4) * 90;
          const x      = Math.cos(angle) * radius;
          const y      = Math.sin(angle) * radius;
          const size   = 3 + (i % 3) * 2.5;
          return (
            <div
              key={i}
              ref={el => { particleRefs.current[i] = el; }}
              className="absolute rounded-full bg-brand pointer-events-none"
              style={{
                width: size, height: size,
                left: `calc(50% + ${x}px)`,
                top:  `calc(50% + ${y}px)`,
                opacity: 0.3,
                filter: "blur(0.5px)",
                boxShadow: "0 0 6px #FF1E27",
              }}
            />
          );
        })}
      </div>

      {/* Crystal + fast parallax layer 1 */}
      <div
        ref={layer1Ref}
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 42%" }}
      >
        <div
          ref={crystalRef}
          className="relative pointer-events-none"
          style={{
            width: 320,
            height: 320,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Crystal: multiple rotated diamond shapes stacked = icosahedron feel */}
          {[
            { rotateX:   0, rotateY:   0, rotateZ:  0, size: 220, opacity: 0.22 },
            { rotateX:  55, rotateY:   0, rotateZ:  0, size: 220, opacity: 0.18 },
            { rotateX:   0, rotateY:  55, rotateZ:  0, size: 220, opacity: 0.18 },
            { rotateX:  30, rotateY:  30, rotateZ:  0, size: 195, opacity: 0.14 },
            { rotateX: -30, rotateY:  60, rotateZ: 15, size: 195, opacity: 0.14 },
            { rotateX:  72, rotateY:  36, rotateZ: 36, size: 180, opacity: 0.12 },
            { rotateX:  36, rotateY: -72, rotateZ: 36, size: 180, opacity: 0.12 },
          ].map((face, i) => (
            <div
              key={i}
              className="absolute inset-0 m-auto border-2 border-brand"
              style={{
                width:  face.size,
                height: face.size,
                borderRadius: "4px",
                opacity: face.opacity,
                transform: `rotateX(${face.rotateX}deg) rotateY(${face.rotateY}deg) rotateZ(${face.rotateZ}deg)`,
                transformStyle: "preserve-3d",
                background: `linear-gradient(135deg, rgba(255,30,39,0.04) 0%, transparent 60%)`,
              }}
            />
          ))}

          {/* Center glow */}
          <div
            className="absolute inset-0 m-auto rounded-full"
            style={{
              width: 80, height: 80,
              background: "radial-gradient(circle, rgba(255,30,39,0.5) 0%, transparent 70%)",
              filter: "blur(12px)",
            }}
          />

          {/* Center dot */}
          <div
            className="absolute inset-0 m-auto rounded-full bg-brand"
            style={{ width: 8, height: 8 }}
          />
        </div>
      </div>

      {/* Top-left corner decorative element */}
      <div className="absolute top-16 left-12 pointer-events-none hidden lg:block">
        <CornerBracket />
      </div>
      {/* Bottom-right */}
      <div className="absolute bottom-16 right-12 pointer-events-none hidden lg:block" style={{ transform: "rotate(180deg)" }}>
        <CornerBracket />
      </div>
    </div>
  );
};

function CornerBracket() {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        opacity: 0.6, duration: 2.2, ease: "sine.inOut",
        yoyo: true, repeat: -1, delay: Math.random() * 2,
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} style={{ opacity: 0.2 }}>
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path d="M0 20V0H20" stroke="#FF1E27" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export default AnimatedBackground;

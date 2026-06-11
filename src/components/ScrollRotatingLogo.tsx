import React, { useRef, useEffect, useCallback } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";

export const ScrollRotatingLogo: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotXRef   = useRef(0);
  const rotYRef   = useRef(0);
  const velX      = useRef(0);
  const lastY     = useRef(0);
  const rafRef    = useRef(0);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const delta = latest - lastY.current;
    lastY.current = latest;
    velX.current += delta * 0.006;
  });

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;

    const draw = () => {
      const ctx = c.getContext("2d");
      if (!ctx) return;

      const W  = c.width;
      const H  = c.height;
      const cx = W / 2;
      const cy = H / 2;
      const r  = Math.min(W, H) * 0.40;

      // update rotation
      rotXRef.current += velX.current;
      velX.current    *= 0.90;
      rotYRef.current += 0.004;

      ctx.clearRect(0, 0, W, H);

      const dark = document.documentElement.classList.contains("dark");
      const alpha = dark ? 0.18 : 0.12;

      // ── 1. Base sphere fill ──────────────────────────────────────────────
      const baseGrad = ctx.createRadialGradient(
        cx - r * 0.3, cy - r * 0.3, r * 0.05,
        cx, cy, r
      );
      baseGrad.addColorStop(0,   `rgba(255,30,39,${alpha * 1.6})`);
      baseGrad.addColorStop(0.6, `rgba(255,30,39,${alpha})`);
      baseGrad.addColorStop(1,   `rgba(255,30,39,${alpha * 0.3})`);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = baseGrad;
      ctx.fill();

      // ── 2. Grid lines clipped to sphere ─────────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = `rgba(255,30,39,${dark ? 0.18 : 0.10})`;
      ctx.lineWidth = 0.8;

      // Latitude rings
      for (let i = -3; i <= 3; i++) {
        const lat  = i * (Math.PI / 7) + rotXRef.current;
        const py   = Math.sin(lat) * r;
        const pr   = Math.abs(Math.cos(lat)) * r;   // always >= 0
        if (pr < 1) continue;
        ctx.beginPath();
        ctx.ellipse(cx, cy + py, pr, pr * 0.22, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Longitude arcs
      for (let i = 0; i < 8; i++) {
        const lon  = (i / 8) * Math.PI * 2 + rotYRef.current;
        const px   = Math.sin(lon) * r * 0.18;
        const prX  = Math.abs(Math.cos(lon)) * r * 0.18;  // always >= 0
        if (prX < 1) continue;
        ctx.beginPath();
        ctx.ellipse(cx + px, cy, prX, r, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // ── 3. Logo paths projected on sphere ───────────────────────────────
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.88, 0, Math.PI * 2);
      ctx.clip();

      const sqX  = Math.max(0.05, Math.abs(Math.cos(rotYRef.current)));
      const sqY  = Math.max(0.05, Math.abs(Math.cos(rotXRef.current)));
      const shX  = Math.sin(rotYRef.current) * r * 0.3;
      const shY  = Math.sin(rotXRef.current) * r * 0.3;
      const s    = (r / 60) * sqX;
      const sy   = (r / 60) * sqY;

      ctx.translate(cx + shX, cy + shY);
      ctx.scale(s, sy);
      ctx.globalAlpha = alpha * 1.8 * Math.max(0.2, sqX * sqY);

      // Outer globe crest (translated to centre at 0,0 from viewBox 60,60)
      ctx.fillStyle = "rgba(255,30,39,1)";
      ctx.beginPath();
      ctx.moveTo(0, -49);
      ctx.bezierCurveTo(-30,-49,-49,-28,-49,0);
      ctx.bezierCurveTo(-49,28,-32,43,-12,47);
      ctx.bezierCurveTo(-11,30,-19,19,-26,11);
      ctx.bezierCurveTo(-34,2,-41,-7,-37,-20);
      ctx.bezierCurveTo(-33,-33,-21,-39,-6,-37);
      ctx.bezierCurveTo(11,-35,20,-21,22,-7);
      ctx.bezierCurveTo(24,7,16,20,6,26);
      ctx.bezierCurveTo(5,26,-8,30,-20,24);
      ctx.bezierCurveTo(-5,34,17,33,29,21);
      ctx.bezierCurveTo(42,8,44,-15,34,-30);
      ctx.bezierCurveTo(26,-42,13,-49,0,-49);
      ctx.closePath();
      ctx.fill();

      // Inner ribbon (Y core)
      ctx.fillStyle = "rgba(255,255,255,0.75)";
      ctx.beginPath();
      ctx.moveTo(-18,-28);
      ctx.bezierCurveTo(-20,-15,-18,-5,-12,5);
      ctx.bezierCurveTo(-5,15,6,18,18,14);
      ctx.bezierCurveTo(32,10,42,-6,36,-22);
      ctx.bezierCurveTo(34,-27,28,-20,25,-15);
      ctx.bezierCurveTo(17,-2,4,2,-5,-6);
      ctx.bezierCurveTo(-11,-11,-12,-22,-14,-30);
      ctx.bezierCurveTo(-15,-34,-17,-34,-18,-28);
      ctx.closePath();
      ctx.fill();

      ctx.globalAlpha = 1;
      ctx.restore();

      // ── 4. Ambient occlusion edge darkening ──────────────────────────────
      const aoGrad = ctx.createRadialGradient(cx, cy, r * 0.55, cx, cy, r);
      aoGrad.addColorStop(0, "rgba(0,0,0,0)");
      aoGrad.addColorStop(1, dark ? "rgba(0,0,0,0.60)" : "rgba(0,0,0,0.22)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = aoGrad;
      ctx.fill();

      // ── 5. Specular highlight (glass shine) ──────────────────────────────
      const specGrad = ctx.createRadialGradient(
        cx - r * 0.38, cy - r * 0.38, 0,
        cx - r * 0.2,  cy - r * 0.2,  r * 0.55
      );
      specGrad.addColorStop(0,   "rgba(255,255,255,0.24)");
      specGrad.addColorStop(0.5, "rgba(255,255,255,0.07)");
      specGrad.addColorStop(1,   "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = specGrad;
      ctx.fill();

      // ── 6. Ring border ────────────────────────────────────────────────────
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = dark ? "rgba(255,30,39,0.22)" : "rgba(255,30,39,0.14)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      rafRef.current = requestAnimationFrame(draw);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        rafRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

export default ScrollRotatingLogo;

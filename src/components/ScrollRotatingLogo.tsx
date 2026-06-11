import React, { useRef, useEffect, useCallback } from "react";
import { gsap } from "../lib/gsap";

/**
 * ScrollRotatingLogo
 *
 * Renders the YouTobia logo (red circular swoosh + inner play-arrow)
 * as a full-screen fixed 3D canvas background.
 *
 * Scroll drives the Y-axis rotation (full spin).
 * Mouse parallax adds subtle X/Y tilt.
 * Everything is drawn on a 2D canvas with layered paths, gradients,
 * and drop-shadow to recreate the 3D depth from the reference image.
 */
export const ScrollRotatingLogo: React.FC = () => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);

  // Rotation state
  const rotY       = useRef(0);   // driven by scroll (full 360 spin)
  const rotX       = useRef(0);   // driven by mouse tilt
  const velY       = useRef(0);   // scroll velocity accumulator
  const lastScroll = useRef(0);

  // Mouse tilt target
  const tiltX      = useRef(0);
  const tiltY      = useRef(0);

  // ── Resize ──────────────────────────────────────────────────────────────
  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
  }, []);

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  // ── Scroll → rotY velocity ───────────────────────────────────────────────
  useEffect(() => {
    const onScroll = () => {
      const delta = window.scrollY - lastScroll.current;
      lastScroll.current = window.scrollY;
      velY.current += delta * 0.003;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Mouse → tilt ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      tiltX.current = ((e.clientY / window.innerHeight) - 0.5) * 18;
      tiltY.current = ((e.clientX / window.innerWidth)  - 0.5) * 18;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => window.removeEventListener("mousemove", onMouse);
  }, []);

  // ── Main draw loop ────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const W  = canvas.width;
      const H  = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      // Base radius = 38% of shortest side, min 180, max 420
      const baseR = Math.min(Math.max(Math.min(W, H) * 0.38, 180), 420);

      // ── Physics update ────────────────────────────────────────────────
      rotY.current += velY.current;
      velY.current  *= 0.92;   // friction
      // slow idle auto-spin when no scroll
      rotY.current  += 0.003;

      // Smooth tilt toward mouse target
      rotX.current += (tiltX.current - rotX.current) * 0.06;

      const dark  = document.documentElement.classList.contains("dark");
      const alpha = dark ? 0.13 : 0.09;

      ctx.clearRect(0, 0, W, H);

      // ── 3D squeeze factors ────────────────────────────────────────────
      // rotY controls left-right flip (scaleX squeeze)
      // rotX controls top-bottom tilt (skewY)
      const cosY   = Math.cos(rotY.current);
      const sinY   = Math.sin(rotY.current);
      const cosX   = Math.cos(rotX.current * Math.PI / 180);
      const scaleX = Math.abs(cosY);          // 0 → 1 → 0 horizontal squeeze
      const skewY  = sinY * 0.18;             // subtle depth lean
      const scaleZ = 1 + sinY * 0.06;        // slight depth scale
      const r      = baseR * scaleZ;
      const rX     = r * scaleX;             // squeezed horizontal radius

      // ── Save and apply 3D transform ───────────────────────────────────
      ctx.save();
      ctx.translate(cx, cy);
      // tilt the whole drawing plane
      const tiltRad = rotX.current * Math.PI / 180;
      ctx.transform(
        1,          // scaleX
        Math.sin(tiltRad) * 0.12,   // skewY (top-bottom lean)
        0,          // skewX
        cosX,       // scaleY (Y squeeze from tilt)
        0, 0
      );

      // ── Shadow / depth glow ───────────────────────────────────────────
      ctx.shadowColor = `rgba(180,0,10,${alpha * 2.2})`;
      ctx.shadowBlur  = r * 0.35;

      // ── LAYER 1: Outer circular band ──────────────────────────────────
      // The thick red ring that forms the outer shell of the logo
      drawOuterRing(ctx, rX, r, alpha, cosY, dark);

      // ── LAYER 2: Inner swoosh arc ─────────────────────────────────────
      drawInnerSwoosh(ctx, rX, r, alpha, cosY, dark);

      // ── LAYER 3: Play-arrow triangle ──────────────────────────────────
      drawPlayArrow(ctx, rX, r, alpha, cosY, dark);

      // ── LAYER 4: Specular ring highlight ─────────────────────────────
      drawSpecular(ctx, rX, r, alpha);

      ctx.restore();

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
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Drawing helpers — each receives rX (squeezed X radius) and r (full radius)
// so all shapes squeeze together to fake 3D rotation.
// ─────────────────────────────────────────────────────────────────────────────

function drawOuterRing(
  ctx: CanvasRenderingContext2D,
  rX: number, r: number,
  alpha: number, cosY: number, dark: boolean
) {
  const ringW   = r * 0.20;               // ring stroke width
  const ringRX  = rX - ringW * 0.5;
  const ringRY  = r  - ringW * 0.5;
  const facing  = cosY >= 0;              // which face is toward viewer

  // Gradient sweeps left-to-right to fake lighting depth
  const grad = ctx.createLinearGradient(-rX, 0, rX, 0);
  if (facing) {
    grad.addColorStop(0,    `rgba(180, 10, 15, ${alpha * 0.6})`);
    grad.addColorStop(0.25, `rgba(220, 20, 20, ${alpha * 1.4})`);
    grad.addColorStop(0.55, `rgba(255, 30, 39, ${alpha * 2.0})`);
    grad.addColorStop(0.75, `rgba(200, 15, 20, ${alpha * 1.6})`);
    grad.addColorStop(1,    `rgba(140,  5, 10, ${alpha * 0.7})`);
  } else {
    // Back face — darker
    grad.addColorStop(0,    `rgba(100,  5,  8, ${alpha * 0.4})`);
    grad.addColorStop(0.5,  `rgba(160, 10, 15, ${alpha * 1.0})`);
    grad.addColorStop(1,    `rgba(100,  5,  8, ${alpha * 0.4})`);
  }

  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(1, ringRX), Math.max(1, ringRY), 0, 0, Math.PI * 2);
  ctx.strokeStyle = grad;
  ctx.lineWidth   = ringW;
  ctx.stroke();

  // Bottom-left break gap in ring (matches reference logo open section)
  // Overdraw with transparent to create the gap
  const gapStart = Math.PI * 0.55;
  const gapEnd   = Math.PI * 0.85;
  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(1, ringRX), Math.max(1, ringRY), 0, gapStart, gapEnd);
  ctx.strokeStyle = "rgba(0,0,0,0)";
  ctx.lineWidth   = ringW * 1.05;
  ctx.globalCompositeOperation = "destination-out";
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";

  // Top-right break gap
  const gap2Start = Math.PI * 1.55;
  const gap2End   = Math.PI * 1.72;
  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(1, ringRX), Math.max(1, ringRY), 0, gap2Start, gap2End);
  ctx.strokeStyle = "rgba(0,0,0,0)";
  ctx.lineWidth   = ringW * 0.9;
  ctx.globalCompositeOperation = "destination-out";
  ctx.stroke();
  ctx.globalCompositeOperation = "source-over";
}

function drawInnerSwoosh(
  ctx: CanvasRenderingContext2D,
  rX: number, r: number,
  alpha: number, cosY: number, dark: boolean
) {
  // A C-shaped inner arc that matches the inner red swoosh in the logo
  const ir  = r  * 0.62;
  const irX = rX * 0.62;
  const sw  = r  * 0.16;

  const grad = ctx.createLinearGradient(-irX, -ir * 0.3, irX * 0.5, ir * 0.5);
  const facing = cosY >= 0;
  grad.addColorStop(0,   `rgba(140, 5, 10, ${alpha * 0.8})`);
  grad.addColorStop(0.4, `rgba(200,18, 22, ${alpha * 1.6 * (facing ? 1 : 0.6)})`);
  grad.addColorStop(0.7, `rgba(180,12, 16, ${alpha * 1.3})`);
  grad.addColorStop(1,   `rgba(120, 5,  8, ${alpha * 0.7})`);

  // Draw a fat arc from top-right around to bottom-left (C shape)
  ctx.beginPath();
  ctx.ellipse(0, 0, Math.max(1, irX), Math.max(1, ir), 0,
    -Math.PI * 0.15,   // start: upper right
     Math.PI * 1.0,    // end:   lower left
    false
  );
  ctx.strokeStyle = grad;
  ctx.lineWidth   = sw;
  ctx.lineCap     = "round";
  ctx.stroke();
}

function drawPlayArrow(
  ctx: CanvasRenderingContext2D,
  rX: number, r: number,
  alpha: number, cosY: number, dark: boolean
) {
  // Triangle pointing right, scaled by rX (squeezes with rotation)
  const scale  = rX / r;                // 0 → 1 when side-on → front-on
  const facing = cosY >= 0;

  // Triangle dimensions in "full" space, then X-squeezed
  const tw = r  * 0.46 * scale;        // half-width of triangle base
  const th = r  * 0.54;                // height (not squeezed)
  const ox = r  * 0.04 * Math.sign(cosY); // slight offset toward viewer
  const oy = r  * 0.04;

  // 3 vertices of the play arrow
  // Right-pointing triangle: tip at right, flat on left
  const x1 = -tw * 0.55 + ox,  y1 = -th * 0.5 + oy;   // top-left
  const x2 = -tw * 0.55 + ox,  y2 =  th * 0.5 + oy;   // bottom-left
  const x3 =  tw * 0.95 + ox,  y3 =  oy;               // right tip

  const grad = ctx.createLinearGradient(x1, y1, x3, y3);
  const a    = alpha * (facing ? 1.8 : 0.8);
  grad.addColorStop(0,   `rgba(160,  8, 14, ${a * 0.7})`);
  grad.addColorStop(0.35,`rgba(210, 20, 22, ${a * 1.0})`);
  grad.addColorStop(0.7, `rgba(180, 12, 16, ${a * 0.9})`);
  grad.addColorStop(1,   `rgba(120,  5,  8, ${a * 0.6})`);

  ctx.save();
  // Rotate slightly with rotY to give the arrow a tumbling feel
  ctx.rotate(Math.sin(cosY) * 0.05);

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fillStyle   = grad;
  ctx.shadowColor = `rgba(180, 5, 10, ${alpha})`;
  ctx.shadowBlur  = r * 0.12;
  ctx.fill();

  // Inner dark shadow on left side of arrow to add 3D depth
  const shadowGrad = ctx.createLinearGradient(x1, 0, x3 * 0.3, 0);
  shadowGrad.addColorStop(0,   `rgba(80, 0, 5, ${alpha * 1.5})`);
  shadowGrad.addColorStop(0.5, `rgba(80, 0, 5, 0)`);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.lineTo(x3, y3);
  ctx.closePath();
  ctx.fillStyle = shadowGrad;
  ctx.fill();

  ctx.restore();
}

function drawSpecular(
  ctx: CanvasRenderingContext2D,
  rX: number, r: number,
  alpha: number
) {
  // Subtle glass-like highlight arc at top-right
  const sx = -rX * 0.25;
  const sy = -r  * 0.30;
  const sr =  r  * 0.28;

  const specGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
  specGrad.addColorStop(0,   `rgba(255,255,255,${alpha * 0.9})`);
  specGrad.addColorStop(0.4, `rgba(255,255,255,${alpha * 0.3})`);
  specGrad.addColorStop(1,   `rgba(255,255,255,0)`);

  ctx.beginPath();
  ctx.arc(sx, sy, sr, 0, Math.PI * 2);
  ctx.fillStyle = specGrad;
  ctx.fill();
}

export default ScrollRotatingLogo;

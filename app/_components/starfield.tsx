"use client";

import { useEffect, useRef } from "react";

/**
 * Procedural starfield + occasional shooting stars.
 * Mirrors the SwiftUI StarfieldView the app uses behind its 3D scene:
 * static dots that twinkle, plus sparse meteors at random angles.
 *
 * Lives at z-index 0 inside a fixed full-viewport container so every
 * page sits on top of the same sky.
 */
export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    type Star = { x: number; y: number; r: number; base: number; tw: number; ph: number };
    type Meteor = {
      x: number; y: number; vx: number; vy: number; born: number; life: number;
    };

    let stars: Star[] = [];
    let meteors: Meteor[] = [];
    let nextSpawn = performance.now() + 2400;
    let raf = 0;
    let dpr = Math.min(2, window.devicePixelRatio || 1);

    function resize() {
      if (!canvas) return;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale star count to viewport area so phones don't get
      // overwhelmed and big monitors don't look sparse.
      const target = Math.round((w * h) / 6800);
      stars = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.3 + Math.random() * 1.6,
        base: 0.25 + Math.random() * 0.65,
        tw: 0.6 + Math.random() * 1.4,    // twinkle speed
        ph: Math.random() * Math.PI * 2,  // phase offset
      }));
    }

    function frame(now: number) {
      const w = canvas!.width / dpr;
      const h = canvas!.height / dpr;

      // Soft cosmic vignette wash — keeps stars feeling embedded
      // in a real sky rather than dots on flat black.
      ctx!.clearRect(0, 0, w, h);

      // Stars
      const t = now / 1000;
      for (const s of stars) {
        const flicker = reduce ? 1 : 0.7 + 0.3 * Math.sin(t * s.tw + s.ph);
        const alpha = Math.max(0, Math.min(1, s.base * flicker));
        ctx!.globalAlpha = alpha;
        // Slight warm tint on the brightest stars to echo the
        // cream/cat tones in the icon — small detail but adds depth.
        const warmth = s.r > 1.4 ? 1 : 0;
        ctx!.fillStyle = warmth ? "#F5E6C8" : "#FFFFFF";
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fill();
        // Brighter stars get a tiny halo
        if (s.r > 1.3) {
          ctx!.globalAlpha = alpha * 0.18;
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.r * 3.4, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
      ctx!.globalAlpha = 1;

      // Meteors
      if (!reduce) {
        if (now > nextSpawn && meteors.length < 4) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 320 + Math.random() * 220;
          meteors.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            born: now,
            life: 700 + Math.random() * 900,
          });
          // Sparse cadence — irregular gaps so it never feels metronomic.
          // 12% chance of a quick follow-up "cluster", otherwise long wait.
          const burst = Math.random() < 0.12;
          nextSpawn = now + (burst ? 200 + Math.random() * 600 : 4500 + Math.random() * 8000);
        }

        meteors = meteors.filter((m) => now - m.born < m.life);
        for (const m of meteors) {
          const elapsed = (now - m.born) / 1000;
          const px = m.x + m.vx * elapsed;
          const py = m.y + m.vy * elapsed;
          const progress = (now - m.born) / m.life;
          const alpha = Math.max(0, 1 - progress);
          const speed = Math.hypot(m.vx, m.vy);
          const ux = m.vx / speed;
          const uy = m.vy / speed;
          // Trail
          const tailX = px - ux * 46;
          const tailY = py - uy * 46;
          const grad = ctx!.createLinearGradient(px, py, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.95})`);
          grad.addColorStop(1, "rgba(217, 70, 239, 0)");
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1.4;
          ctx!.beginPath();
          ctx!.moveTo(px, py);
          ctx!.lineTo(tailX, tailY);
          ctx!.stroke();
          // Head
          ctx!.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx!.beginPath();
          ctx!.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      raf = requestAnimationFrame(frame);
    }

    resize();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}

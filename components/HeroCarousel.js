"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Drop as many licensed photos as you like into public/: hero.jpg, hero1.jpg, hero2.jpg...
// The carousel auto-detects which exist and cross-fades between them. With only one, it
// shows a single image; with none, a clean gradient placeholder.
//
// Pass `fill` to run it as a full-bleed background behind hero text (UniPod style):
//   <HeroCarousel fill />
// Otherwise it renders as a rounded, self-contained card.
const CANDIDATES = ["/hero.jpg", "/hero1.jpg", "/hero2.jpg", "/hero3.jpg", "/hero4.jpg", "/hero5.jpg"];

export default function HeroCarousel({ fill = false }) {
  const [imgs, setImgs] = useState(null);
  const [i, setI] = useState(0);

  useEffect(() => {
    let alive = true;
    Promise.all(
      CANDIDATES.map(
        (src) =>
          new Promise((res) => {
            const im = new window.Image();
            im.onload = () => res(src);
            im.onerror = () => res(null);
            im.src = src;
          })
      )
    ).then((results) => {
      if (alive) setImgs(results.filter(Boolean));
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!imgs || imgs.length < 2) return;
    const t = setInterval(() => setI((p) => (p + 1) % imgs.length), 4500);
    return () => clearInterval(t);
  }, [imgs]);

  const list = imgs && imgs.length ? imgs : [];
  const current = list.length ? list[i % list.length] : null;

  const wrapper = fill
    ? "absolute inset-0 overflow-hidden"
    : "relative aspect-[16/8] overflow-hidden rounded-3xl border border-slate-200 shadow-2xl shadow-blue-600/10";

  return (
    <div className={wrapper}>
      {/* base fallback (shown until images load / if none exist) */}
      <div className={`absolute inset-0 ${fill ? "bg-gradient-to-br from-slate-900 via-[var(--brand-dark)] to-indigo-950" : "bg-gradient-to-br from-blue-100 to-indigo-100"}`} />

      <AnimatePresence>
        {current && (
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${current}')` }}
          />
        )}
      </AnimatePresence>

      {fill ? (
        <>
          {/* branded blue wash so white text stays legible over any photo */}
          <div className="absolute inset-0 bg-slate-950/55" />
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/55 via-slate-900/45 to-indigo-900/60" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand)]/20 via-transparent to-indigo-400/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white/70 to-transparent" />
        </>
      )}

      {list.length > 1 && (
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1.5">
          {list.map((_, k) => (
            <span key={k} className={`h-1.5 w-5 rounded-full transition ${k === i % list.length ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
      )}
    </div>
  );
}

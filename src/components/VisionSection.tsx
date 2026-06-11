import React from "react";
import { motion } from "motion/react";
import { SectionBackground } from "./SectionBackground";

const PILLARS = [
  {
    word: "CREATE",
    desc: "Original, high-quality multimedia content.",
    num: "01",
  },
  {
    word: "STREAM",
    desc: "Accessible, immersive viewing experiences.",
    num: "02",
  },
  {
    word: "EDUCATE",
    desc: "Empower learners at every level.",
    num: "03",
  },
  {
    word: "INFORM",
    desc: "Trusted insights for the multimedia world.",
    num: "04",
  },
];

export const VisionSection: React.FC = () => {

  return (
    <section
      id="vision"
      className="relative bg-neutral-950 overflow-hidden py-28 md:py-40 border-t border-white/8"
    >
      <SectionBackground variant="vision" />
      {/* Ambient glow — complements the SectionBackground */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(255,30,39,0.05) 0%, transparent 70%)",
        }}
      />

      {/* Dot grid removed — GlobalBackground provides the dot pattern */}

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-20">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl space-y-6"
        >
          <span className="font-mono text-[10px] tracking-widest text-brand/70 font-semibold uppercase">
            THE VISION FORWARD
          </span>
          <h2 className="font-serif italic text-4xl sm:text-6xl text-white tracking-tight leading-[1.05]">
            To become a{" "}
            <span className="text-brand font-display font-black tracking-tighter uppercase not-italic">
              leading force
            </span>{" "}
            in the multimedia industry.
          </h2>
          <p className="text-white/50 text-base leading-relaxed font-sans font-light max-w-2xl">
            By bringing together creativity, technology, Entertainment, Information, and education to deliver exceptional content, innovative tools, and trusted information.
          </p>
        </motion.div>

        {/* Four pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PILLARS.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="relative bg-white/4 border border-white/10 rounded-2xl p-8 space-y-4 overflow-hidden group hover:border-brand/40 hover:bg-white/6 transition-all duration-300"
            >
              {/* Big background number */}
              <div className="absolute -right-3 -bottom-4 font-display font-black text-[6rem] leading-none text-white/3 select-none pointer-events-none group-hover:text-brand/5 transition-colors">
                {p.num}
              </div>

              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-brand/0 group-hover:bg-brand/60 transition-all duration-500" />

              <span className="font-mono text-[10px] tracking-widest text-brand/60 font-semibold">
                PILLAR {p.num}
              </span>
              <h3 className="font-display font-black text-3xl text-white tracking-tight group-hover:text-brand transition-colors duration-300">
                {p.word}
              </h3>
              <p className="text-white/45 text-sm leading-relaxed font-sans font-light">
                {p.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom brand statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-white/8 pt-12 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <p className="font-mono text-[10px] tracking-[0.3em] text-white/25 uppercase">
            © {new Date().getFullYear()} YouTobia Multimedia P.l.C. · Addis Ababa, Ethiopia
          </p>
          <div className="flex items-center gap-6">
            {["QenaView", "eTop", "YentaBarsiisaa", "MirXog", "EnqoqCash"].map((b) => (
              <span key={b} className="font-mono text-[9px] tracking-widest text-white/20 hover:text-brand/60 transition-colors cursor-default">
                {b}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VisionSection;

import React, { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { SectionBackground } from "./SectionBackground";

// ─── Sub-brand card ──────────────────────────────────────────────────────────
interface SubBrandProps {
  num: string;
  name: string;
  amharic: string;
  domain: string;
  purpose: string;
  values: { title: string; desc: string }[];
  index: number;
  accent: string;
}

function SubBrandCard({ num, name, amharic, domain, purpose, values, index, accent }: SubBrandProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start py-16 border-b border-neutral-200 dark:border-white/8 ${
        isEven ? "" : "lg:flex-row-reverse"
      }`}
    >
      {/* Label column */}
      <div className={`lg:col-span-4 space-y-4 ${!isEven ? "lg:order-2" : ""}`}>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-widest text-brand/70 font-semibold">
            SUB-BRAND {num}
          </span>
        </div>
        <div>
          <p className="font-display font-black text-2xl text-brand tracking-tight">{amharic}</p>
          <h3 className="font-serif italic text-3xl sm:text-4xl text-neutral-900 dark:text-white leading-tight tracking-tight">
            {name}
          </h3>
        </div>
        <span className="inline-block font-mono text-[10px] tracking-widest text-neutral-500 dark:text-neutral-400 uppercase border border-neutral-200 dark:border-white/10 px-3 py-1 rounded-full">
          {domain}
        </span>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-sans font-light">
          {purpose}
        </p>
      </div>

      {/* Values grid */}
      <div className={`lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 ${!isEven ? "lg:order-1" : ""}`}>
        {values.map((v, i) => (
          <motion.div
            key={i}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="relative bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/8 rounded-2xl p-5 space-y-2 overflow-hidden group"
          >
            {/* Left accent bar */}
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand origin-top"
              animate={{ scaleY: hovered === i ? 1 : 0 }}
              transition={{ duration: 0.25 }}
            />
            <h4 className="font-serif italic text-lg text-neutral-800 dark:text-neutral-100 group-hover:text-brand transition-colors duration-200">
              {v.title}
            </h4>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans font-light">
              {v.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Main section ────────────────────────────────────────────────────────────
export const EcosystemSection: React.FC = () => {

  const subBrands: SubBrandProps[] = [
    {
      num: "01",
      name: "QenaView",
      amharic: "ቀናView",
      domain: "Multimedia Streaming & Distribution",
      purpose:
        "To revolutionize how people access and experience multimedia content by offering a platform that is both technologically advanced and user-friendly, catering to diverse entertainment needs.",
      values: [
        { title: "Accessibility", desc: "Content easily accessible to a diverse global audience." },
        { title: "Quality", desc: "High-definition, premium content across all genres." },
        { title: "Innovation", desc: "Exploring new streaming technologies and immersive experiences." },
        { title: "User-Centric", desc: "Tailored experiences based on user preferences and feedback." },
      ],
      index: 0,
      accent: "#FF1E27",
    },
    {
      num: "02",
      name: "eTop Production",
      amharic: "eTop",
      domain: "Multimedia Content Production",
      purpose:
        "To become a leading multimedia production house that creates compelling stories and fosters a creative ecosystem where artists and producers push the boundaries of content creation.",
      values: [
        { title: "Creativity", desc: "Bold, innovative, original content." },
        { title: "Collaboration", desc: "Diverse talent producing world-class multimedia." },
        { title: "Excellence", desc: "Highest standards in every phase of production." },
        { title: "Sustainability", desc: "Eco-friendly, socially responsible practices." },
      ],
      index: 1,
      accent: "#FF1E27",
    },
    {
      num: "03",
      name: "YentaBarsiisaa",
      amharic: "የንታBarsissa",
      domain: "Multimedia Skills & Education Hub",
      purpose:
        "To be the premier hub for multimedia education, where aspiring and seasoned professionals learn the latest skills and techniques needed to excel in the dynamic multimedia landscape.",
      values: [
        { title: "Empowerment", desc: "Equipping learners with skills to thrive in the multimedia industry." },
        { title: "Innovation", desc: "Cutting-edge tools and methods for multimedia arts and technology education." },
        { title: "Inclusion", desc: "Opportunities for learners from all backgrounds, regardless of experience level." },
        { title: "Lifelong Learning", desc: "Continuous skill development in the fast-evolving multimedia world." },
      ],
      index: 2,
      accent: "#FF1E27",
    },
    {
      num: "04",
      name: "MirXog",
      amharic: "ምርXog",
      domain: "Multimedia Information Hub",
      purpose:
        "To serve as the go-to information hub for all things multimedia — offering insights, news, and analysis to help creators, businesses, and enthusiasts stay ahead in the rapidly evolving multimedia world.",
      values: [
        { title: "Accuracy", desc: "Well-researched, reliable, up-to-date information." },
        { title: "Transparency", desc: "Clear, unbiased insights and reporting." },
        { title: "Community", desc: "Trusted network of professionals and enthusiasts." },
        { title: "Curiosity", desc: "Encouraging exploration and discovery in multimedia." },
      ],
      index: 3,
      accent: "#FF1E27",
    },
    {
      num: "05",
      name: "EnqoqCash",
      amharic: "እንቆቅCash",
      domain: "Flagship Interactive Quiz Ecosystem",
      purpose:
        "A regulated, multi-platform, knowledge-driven trivia network. Compete in live categorized trivia scoring points against rapid clocks to secure structural prizes and cash backings.",
      values: [
        { title: "Knowledge-Driven", desc: "Questions spanning General Knowledge, Sports, Science, and History." },
        { title: "Real Rewards", desc: "Synchronized secure transaction channels back gameplay with immediate rewards." },
        { title: "Live Multipliers", desc: "Fast response times boost your score and activate dynamic multipliers." },
        { title: "Cultural Identity", desc: "Rooted in the traditional word 'Enqoqlsh' (እንቆቅልሽ) — Ethiopian trivia heritage." },
      ],
      index: 4,
      accent: "#FF1E27",
    },
  ];

  const coreValues = [
    { title: "Innovation", desc: "Pushing boundaries in multimedia technologies and trends." },
    { title: "Creativity", desc: "Fostering original, high-quality content creation." },
    { title: "Collaboration", desc: "Building strong partnerships across the multimedia landscape." },
    { title: "Integrity", desc: "Upholding transparency and trust in every endeavor." },
    { title: "Diversity & Inclusion", desc: "Promoting a wide range of voices, ideas, and perspectives." },
  ];

  return (
    <section
      id="ecosystem"
      className="relative bg-white dark:bg-[#060606] border-t border-rose-100 dark:border-white/8 overflow-hidden"
    >
      <SectionBackground variant="ecosystem" />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

        {/* ── Section 1: The Ecosystem intro ──────────────────────────── */}
        <div className="py-24 md:py-32 space-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-neutral-200 dark:border-white/8 pb-16"
          >
            <div className="lg:col-span-7 space-y-5">
              <span className="font-mono text-xs tracking-widest text-brand font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                THE YOUTOBIA ECOSYSTEM
              </span>
              <h2 className="font-serif italic text-4xl sm:text-6xl text-neutral-900 dark:text-white tracking-tight leading-[1.05]">
                Five Brands. <br />
                <span className="text-brand font-display font-black tracking-tighter uppercase not-italic">
                  One Holding Vision.
                </span>
              </h2>
            </div>
            <div className="lg:col-span-5">
              <p className="text-neutral-600 dark:text-neutral-400 text-base leading-relaxed font-sans font-light">
                YouTobia Multimedia P.l.C. is a holding company that unites five specialized sub-brands — each designed to lead in its domain of the multimedia landscape.
              </p>
            </div>
          </motion.div>

          {/* Brand summary pills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { amharic: "እንቆቅCash", name: "EnqoqCash", domain: "Interactive Quiz" },
              { amharic: "ቀናView", name: "QenaView", domain: "Streaming" },
              { amharic: "eTop", name: "eTop Production", domain: "Content Production" },
              { amharic: "የንታBarsissa", name: "YentaBarsiisaa", domain: "Skills & Education" },
              { amharic: "ምርXog", name: "MirXog", domain: "Information Hub" },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/8 rounded-2xl p-5 space-y-2 hover:border-brand/40 transition-all duration-300 group"
              >
                <p className="font-display font-black text-lg text-brand">{b.amharic}</p>
                <p className="font-serif italic text-sm text-neutral-700 dark:text-neutral-300">{b.name}</p>
                <p className="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">{b.domain}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Section 2: Holding Brand — Purpose & Core Values ─────────── */}
        <div className="py-16 md:py-24 space-y-16 border-t border-neutral-200 dark:border-white/8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-28">
              <span className="font-mono text-[10px] tracking-widest text-brand/70 font-semibold uppercase">
                HOLDING BRAND
              </span>
              <h3 className="font-serif italic text-3xl sm:text-4xl text-neutral-900 dark:text-white tracking-tight leading-tight">
                YouTobia Multimedia P.l.C.
              </h3>
              <div className="h-px w-16 bg-brand/40" />
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-sans font-light">
                <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">Purpose:</strong> To become a leading force in the multimedia industry by bringing together creativity, technology, entertainment, information, and education to deliver exceptional content, innovative tools, and trusted information.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreValues.map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/8 rounded-2xl p-5 space-y-2 hover:border-brand/40 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-0.5 h-0 bg-brand group-hover:h-full transition-all duration-300" />
                  <div className="w-8 h-8 rounded-lg bg-brand/8 border border-brand/20 flex items-center justify-center font-mono text-[10px] text-brand font-bold">
                    0{i + 1}
                  </div>
                  <h4 className="font-serif italic text-lg text-neutral-800 dark:text-neutral-100">{v.title}</h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-sans font-light">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Section 3: Five Sub-Brands deep dive ─────────────────────── */}
        <div className="py-4 border-t border-neutral-200 dark:border-white/8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-16 pb-8 space-y-3"
          >
            <span className="font-mono text-xs tracking-widest text-brand font-semibold">
              THE FIVE SUB-BRANDS
            </span>
            <h3 className="font-serif italic text-3xl sm:text-5xl text-neutral-900 dark:text-white tracking-tight leading-tight">
              Each Brand. <span className="text-brand font-display font-black tracking-tighter uppercase not-italic">Its Domain.</span>
            </h3>
          </motion.div>

          {subBrands.map((brand) => (
            <SubBrandCard key={brand.num} {...brand} />
          ))}
        </div>

        {/* ── Section 4: Brand Values at a Glance ──────────────────────── */}
        <div className="py-24 border-t border-neutral-200 dark:border-white/8 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4 text-center max-w-2xl mx-auto"
          >
            <span className="font-mono text-xs tracking-widest text-brand font-semibold">
              BRAND VALUES AT A GLANCE
            </span>
            <h3 className="font-serif italic text-3xl sm:text-5xl text-neutral-900 dark:text-white tracking-tight leading-tight">
              Each sub-brand carries a distinct identity while sharing the holding company's core commitment to{" "}
              <span className="text-brand not-italic font-display font-black">innovation, quality, and community.</span>
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed font-sans font-light">
              The five brands form an integrated ecosystem — from content creation and streaming to education and industry information — all unified under the YouTobia vision.
            </p>
          </motion.div>

          {/* Ecosystem orbit diagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { name: "QenaView", values: ["Streaming", "Accessibility", "Quality"], color: "from-red-50 to-white dark:from-red-950/20 dark:to-neutral-900/60" },
              { name: "eTop Production", values: ["Content", "Excellence", "Sustainability"], color: "from-orange-50 to-white dark:from-orange-950/20 dark:to-neutral-900/60" },
              { name: "YentaBarsiisaa", values: ["Education", "Empowerment", "Inclusion"], color: "from-amber-50 to-white dark:from-amber-950/20 dark:to-neutral-900/60" },
              { name: "MirXog", values: ["Information", "Accuracy", "Community"], color: "from-rose-50 to-white dark:from-rose-950/20 dark:to-neutral-900/60" },
              { name: "EnqoqCash", values: ["Interactive Trivia", "Real Rewards", "Cultural Identity"], color: "from-red-50 to-white dark:from-red-950/20 dark:to-neutral-900/60" },
              { name: "YouTobia P.l.C.", values: ["Innovation", "Creativity", "Integrity"], color: "from-neutral-100 to-white dark:from-neutral-800/40 dark:to-neutral-900/60", isHolder: true },
            ].map((b: any, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.5 }}
                className={`bg-gradient-to-br ${b.color} border ${b.isHolder ? "border-brand/40 ring-2 ring-brand/10" : "border-neutral-200 dark:border-white/8"} rounded-2xl p-6 space-y-3`}
              >
                <h4 className={`font-display font-black text-lg ${b.isHolder ? "text-brand" : "text-neutral-800 dark:text-neutral-100"}`}>
                  {b.name}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {b.values.map((v: string) => (
                    <span key={v} className="text-[10px] font-mono tracking-wider text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-white/8 px-2 py-0.5 rounded-full">
                      {v}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;

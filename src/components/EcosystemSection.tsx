import React, { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { revealWords, clipReveal, scaleBurst, scrubDrift, drawLine } from "../lib/scrollAnimations";
import { SectionBackground } from "./SectionBackground";

// ─── GSAP scroll-3D reveal wrapper (used only inside SubBrandSection) ─────────
function Scroll3D({
  children,
  className = "",
  rotateDirection = "up",
}: {
  children: React.ReactNode;
  className?: string;
  rotateDirection?: "up" | "left" | "right" | "barrel";
  key?: React.Key;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const outer = outerRef.current;
    if (!inner || !outer) return;

    // Initial state
    const initRotX = rotateDirection === "up" || rotateDirection === "barrel" ? 55 : 0;
    const initRotY = rotateDirection === "left" ? -55
      : rotateDirection === "right" ? 55
      : rotateDirection === "barrel" ? -65 : 0;
    const initRotZ = rotateDirection === "barrel" ? -25 : 0;

    gsap.set(inner, {
      rotateX: initRotX,
      rotateY: initRotY,
      rotateZ: initRotZ,
      scale: 0.82,
      opacity: 0,
      transformStyle: "preserve-3d",
      willChange: "transform, opacity",
    });

    ScrollTrigger.create({
      trigger: outer,
      start: "top 88%",
      end: "bottom 12%",
      scrub: 1.0,
      onUpdate: (self) => {
        const p = self.progress;
        let rotX: number, rotY: number, rotZ: number, sc: number, op: number;

        if (p < 0.35) {
          const t = p / 0.35;
          rotX = gsap.utils.interpolate(initRotX, 0, t);
          rotY = gsap.utils.interpolate(initRotY, 0, t);
          rotZ = gsap.utils.interpolate(initRotZ, 0, t);
          sc   = gsap.utils.interpolate(0.82, 1, t);
          op   = gsap.utils.interpolate(0, 1, t * 2);
        } else if (p < 0.65) {
          rotX = 0; rotY = 0; rotZ = 0; sc = 1; op = 1;
        } else {
          const t = (p - 0.65) / 0.35;
          rotX = rotateDirection === "up" || rotateDirection === "barrel" ? gsap.utils.interpolate(0, -30, t) : 0;
          rotY = rotateDirection === "left" ? gsap.utils.interpolate(0, 30, t)
            : rotateDirection === "right" ? gsap.utils.interpolate(0, -30, t)
            : rotateDirection === "barrel" ? gsap.utils.interpolate(0, 35, t) : 0;
          rotZ = rotateDirection === "barrel" ? gsap.utils.interpolate(0, 15, t) : 0;
          sc   = gsap.utils.interpolate(1, 0.85, t);
          op   = gsap.utils.interpolate(1, 0, t);
        }

        gsap.set(inner, { rotateX: rotX, rotateY: rotY, rotateZ: rotZ, scale: sc, opacity: op });
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter(t => t.trigger === outer)
        .forEach(t => t.kill());
    };
  }, [rotateDirection]);

  return (
    <div ref={outerRef} className={className} style={{ perspective: "1000px" }}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}

// ─── GSAP mouse-tilt card ─────────────────────────────────────────────────────
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string; key?: React.Key }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
    const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    gsap.to(el, {
      rotateX: -ny * 12,
      rotateY:  nx * 12,
      transformStyle: "preserve-3d",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(ref.current, {
      rotateX: 0, rotateY: 0,
      duration: 0.5, ease: "elastic.out(1, 0.6)",
    });
  };

  return (
    <div ref={ref} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      className={className} style={{ transformStyle: "preserve-3d" }}>
      {children}
    </div>
  );
}

// ─── Sub-brand data ────────────────────────────────────────────────────────────
const SUB_BRANDS = [
  {
    num: "01", name: "QenaView", amharic: "ቀናView",
    domain: "Streaming & Distribution",
    purpose: "To revolutionize how people access and experience multimedia content by offering a platform that is both technologically advanced and user-friendly, catering to diverse entertainment needs.",
    values: [
      { title: "Accessibility", desc: "Content easily accessible to a diverse global audience." },
      { title: "Quality",       desc: "High-definition, premium content across all genres." },
      { title: "Innovation",    desc: "Exploring new streaming technologies and immersive experiences." },
      { title: "User-Centric",  desc: "Tailored experiences based on user preferences and feedback." },
    ],
  },
  {
    num: "02", name: "eTop Production", amharic: "eTop",
    domain: "Content Production",
    purpose: "To become a leading multimedia production house that creates compelling stories and fosters a creative ecosystem where artists and producers push the boundaries of content creation.",
    values: [
      { title: "Creativity",     desc: "Bold, innovative, original content." },
      { title: "Collaboration",  desc: "Diverse talent producing world-class multimedia." },
      { title: "Excellence",     desc: "Highest standards in every phase of production." },
      { title: "Sustainability", desc: "Eco-friendly, socially responsible practices." },
    ],
  },
  {
    num: "03", name: "YentaBarsiisaa", amharic: "የንታBarsissa",
    domain: "Skills & Education Hub",
    purpose: "To be the premier hub for multimedia education, where aspiring and seasoned professionals learn the latest skills and techniques needed to excel in the dynamic multimedia landscape.",
    values: [
      { title: "Empowerment",       desc: "Equipping learners with skills to thrive in the multimedia industry." },
      { title: "Innovation",        desc: "Cutting-edge tools and methods for multimedia arts and technology education." },
      { title: "Inclusion",         desc: "Opportunities for learners from all backgrounds, regardless of experience level." },
      { title: "Lifelong Learning", desc: "Continuous skill development in the fast-evolving multimedia world." },
    ],
  },
  {
    num: "04", name: "MirXog", amharic: "ምርXog",
    domain: "Information Hub",
    purpose: "To serve as the go-to information hub for all things multimedia — offering insights, news, and analysis to help creators, businesses, and enthusiasts stay ahead in the rapidly evolving multimedia world.",
    values: [
      { title: "Accuracy",     desc: "Well-researched, reliable, up-to-date information." },
      { title: "Transparency", desc: "Clear, unbiased insights and reporting." },
      { title: "Community",    desc: "Trusted network of professionals and enthusiasts." },
      { title: "Curiosity",    desc: "Encouraging exploration and discovery in multimedia." },
    ],
  },
  {
    num: "05", name: "EnqoqCash", amharic: "እንቆቅCash",
    domain: "Interactive Quiz Ecosystem",
    purpose: "A regulated, multi-platform, knowledge-driven trivia network. Compete in live categorized trivia scoring points against rapid clocks to secure structural prizes and cash backings.",
    values: [
      { title: "Knowledge-Driven", desc: "Questions spanning General Knowledge, Sports, Science, and History." },
      { title: "Real Rewards",      desc: "Synchronized secure transaction channels back gameplay with immediate rewards." },
      { title: "Live Multipliers",  desc: "Fast response times boost your score and activate dynamic multipliers." },
      { title: "Cultural Identity", desc: "Rooted in the traditional word 'Enqoqlsh' (እንቆቅልሽ) — Ethiopian trivia heritage." },
    ],
  },
];

function SubBrandSection({ brand, isEven }: { brand: typeof SUB_BRANDS[0]; isEven: boolean; key?: React.Key }) {
  return (
    <div className="py-28 md:py-36 border-b border-neutral-200 dark:border-white/8">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${!isEven ? "lg:flex-row-reverse" : ""}`}>
        <Scroll3D rotateDirection={isEven ? "left" : "right"} className={!isEven ? "lg:order-2" : ""}>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="font-display font-black text-[7rem] leading-none text-brand/8 dark:text-brand/12 select-none">
                {brand.num}
              </span>
              <div className="space-y-1">
                <span className="font-mono text-sm font-bold text-brand/60 tracking-widest uppercase block">Sub-Brand {brand.num}</span>
                <div className="h-px w-16 bg-brand/30" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-display font-black text-4xl text-brand">{brand.amharic}</p>
              <h3 className="font-display font-black text-[clamp(3.5rem,5.5vw,6rem)] text-neutral-900 dark:text-white leading-[0.9] tracking-tight">
                {brand.name}
              </h3>
            </div>
            <div className="inline-flex items-center gap-3 bg-brand/8 border border-brand/25 px-5 py-2.5 rounded-full">
              <span className="w-2.5 h-2.5 rounded-full bg-brand animate-pulse" />
              <span className="font-mono text-sm text-brand font-bold tracking-widest uppercase">{brand.domain}</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 text-xl leading-relaxed font-sans">{brand.purpose}</p>
          </div>
        </Scroll3D>

        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${!isEven ? "lg:order-1" : ""}`}
          style={{ perspective: "1100px" }}>
          {brand.values.map((v, i) => (
            <Scroll3D key={i} rotateDirection={i % 2 === 0 ? "up" : "barrel"}>
              <TiltCard className="group h-full">
                <div className="h-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-white/10 rounded-3xl p-7 space-y-4 hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/15 transition-all duration-300 relative overflow-hidden min-h-[180px]">
                  <div className="absolute -right-2 -bottom-3 font-black font-display text-[5rem] leading-none text-neutral-50 dark:text-white/4 select-none pointer-events-none">
                    {String(i+1).padStart(2,"0")}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-b-3xl" />
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0">
                      <span className="font-mono font-black text-base text-brand">{String(i+1).padStart(2,"0")}</span>
                    </div>
                    <h4 className="font-display font-black text-2xl text-neutral-900 dark:text-white">{v.title}</h4>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed">{v.desc}</p>
                </div>
              </TiltCard>
            </Scroll3D>
          ))}
        </div>
      </div>
    </div>
  );
}

export const EcosystemSection: React.FC = () => {
  const coreValues = [
    { num:"01", title:"Innovation",           desc:"Pushing boundaries in multimedia technologies and trends." },
    { num:"02", title:"Creativity",            desc:"Fostering original, high-quality content creation." },
    { num:"03", title:"Collaboration",         desc:"Building strong partnerships across the multimedia landscape." },
    { num:"04", title:"Integrity",             desc:"Upholding transparency and trust in every endeavor." },
    { num:"05", title:"Diversity & Inclusion", desc:"Promoting a wide range of voices, ideas, and perspectives." },
  ];

  // Hero section refs for scroll animations
  const heroRef     = useRef<HTMLDivElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef  = useRef<HTMLHeadingElement>(null);
  const descRef     = useRef<HTMLParagraphElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);
  const driftLeft   = useRef<HTMLDivElement>(null);
  const driftRight  = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const hero = heroRef.current;
      if (!hero) return;

      // Badge clip reveal
      if (badgeRef.current) {
        gsap.from(badgeRef.current, {
          clipPath: "inset(0% 100% 0% 0%)",
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: hero, start: "top 75%", toggleActions: "play none none reverse" },
        });
      }

      // Headline: word-by-word slide up
      if (headlineRef.current) revealWords(headlineRef.current, hero, { duration: 0.8 });
      if (sublineRef.current)  revealWords(sublineRef.current,  hero, { duration: 0.8, delay: 0.15 });

      // Description fade-in from right
      if (descRef.current) {
        gsap.from(descRef.current, {
          x: 60, opacity: 0, duration: 0.9, ease: "expo.out",
          scrollTrigger: { trigger: hero, start: "top 72%", toggleActions: "play none none reverse" },
        });
      }

      // Animated rule line draw
      if (lineRef.current) drawLine(lineRef.current, hero);

      // 5 brand cards stagger burst
      if (cardsRef.current) {
        scaleBurst(cardsRef.current.children, cardsRef.current);
      }

      // Scrub-driven ghost text drift
      if (driftLeft.current)  scrubDrift(driftLeft.current,  120, false);
      if (driftRight.current) scrubDrift(driftRight.current, 100, true);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="ecosystem" className="relative bg-white dark:bg-[#060606] border-t border-rose-100 dark:border-white/8 overflow-hidden">
      <SectionBackground variant="ecosystem" />

      {/* Scrub-drifting ghost text background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div ref={driftLeft}
          className="absolute top-[8%] left-0 font-display font-black text-[18vw] leading-none text-neutral-100/40 dark:text-white/[0.02] whitespace-nowrap">
          ECOSYSTEM
        </div>
        <div ref={driftRight}
          className="absolute bottom-[12%] right-0 font-display font-black text-[14vw] leading-none text-neutral-100/30 dark:text-white/[0.015] whitespace-nowrap">
          YOUTOBIA
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* ══ HERO ══ */}
        <div ref={heroRef} className="pt-28 md:pt-40 pb-20">
          {/* Animated divider line */}
          <div ref={lineRef} className="w-full h-px bg-brand/20 mb-12 origin-left" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-6">
              <div ref={badgeRef}
                className="inline-flex items-center gap-3 bg-brand/8 border border-brand/20 px-5 py-2.5 rounded-full">
                <span className="w-3 h-3 rounded-full bg-brand animate-pulse" />
                <span className="font-mono text-sm font-bold text-brand tracking-widest uppercase">The YouTobia Ecosystem</span>
              </div>
              <h2 ref={headlineRef}
                className="font-display font-black text-[clamp(3.5rem,8vw,8.5rem)] leading-[0.88] tracking-tighter text-neutral-900 dark:text-white">
                Five Brands. <span className="text-brand">One Vision.</span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p ref={descRef}
                className="text-neutral-600 dark:text-neutral-300 text-xl leading-relaxed">
                YouTobia Multimedia P.l.C. unites five specialized sub-brands — each designed to lead in its domain of the multimedia landscape.
              </p>
            </div>
          </div>
        </div>

        {/* ══ 5 BRAND CARDS ══ */}
        <div ref={cardsRef} className="pb-24 border-b border-neutral-200 dark:border-white/8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {SUB_BRANDS.map((b,i) => (
              <TiltCard key={i} className="group h-full">
                <div className="h-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-white/10 rounded-3xl p-7 space-y-5 hover:border-brand/50 hover:shadow-2xl hover:shadow-brand/15 transition-all duration-300 relative overflow-hidden">
                  <div className="absolute -right-2 -bottom-4 font-black font-display text-[5rem] leading-none text-neutral-50 dark:text-white/4 select-none pointer-events-none">{b.num}</div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-brand scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 rounded-b-3xl" />
                  <p className="font-display font-black text-2xl text-brand">{b.amharic}</p>
                  <h4 className="font-display font-black text-2xl text-neutral-900 dark:text-white leading-tight">{b.name}</h4>
                  <div className="pt-1 border-t border-neutral-100 dark:border-white/8">
                    <span className="font-mono text-sm text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{b.domain}</span>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* ══ HOLDING BRAND ══ */}
        <HoldingBrandSection coreValues={coreValues} />

        {/* ══ DEEP DIVE ══ */}
        <DeepDiveSection />

        {/* ══ VALUES SUMMARY ══ */}
        <ValuesSummarySection />

      </div>
    </section>
  );
};

// ─── Holding brand with sticky scroll + reveal ────────────────────────────────
function HoldingBrandSection({ coreValues }: { coreValues: { num: string; title: string; desc: string }[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const valuesRef  = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) revealWords(titleRef.current, sectionRef.current!);
      if (lineRef.current)  drawLine(lineRef.current, sectionRef.current!);
      if (valuesRef.current) {
        scaleBurst(valuesRef.current.children, valuesRef.current, { delay: 0.2 });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="py-24 md:py-32 border-b border-neutral-200 dark:border-white/8">
      <div ref={lineRef} className="w-full h-px bg-neutral-200 dark:bg-white/8 mb-16 origin-left" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
        <div className="lg:sticky lg:top-28 space-y-8">
          <span className="font-mono text-sm tracking-widest text-brand/70 font-bold uppercase block">Holding Brand</span>
          <h3 ref={titleRef}
            className="font-display font-black text-[clamp(2.8rem,5vw,5.5rem)] text-neutral-900 dark:text-white leading-[0.9] tracking-tight">
            YouTobia <span className="text-brand">Multimedia</span> P.l.C.
          </h3>
          <div className="w-24 h-1.5 bg-brand rounded-full" />
          <p className="text-neutral-600 dark:text-neutral-300 text-xl leading-relaxed">
            <strong className="text-neutral-900 dark:text-white font-bold">Purpose:</strong> To become a leading force in the multimedia industry by bringing together creativity, technology, entertainment, information, and education to deliver exceptional content, innovative tools, and trusted information.
          </p>
        </div>
        <div ref={valuesRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {coreValues.map((v,i) => (
            <TiltCard key={i} className="group h-full">
              <div className="h-full bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-white/10 rounded-3xl p-7 space-y-4 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/10 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
                <div className="w-12 h-12 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center">
                  <span className="font-mono font-black text-lg text-brand">{v.num}</span>
                </div>
                <h4 className="font-display font-black text-2xl text-neutral-900 dark:text-white">{v.title}</h4>
                <p className="text-neutral-600 dark:text-neutral-300 text-base leading-relaxed">{v.desc}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Deep dive header ─────────────────────────────────────────────────────────
function DeepDiveSection() {
  const ref      = useRef<HTMLDivElement>(null);
  const h3Ref    = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (h3Ref.current) revealWords(h3Ref.current, ref.current!);
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="border-b border-neutral-200 dark:border-white/8">
      <div className="py-20 space-y-4">
        <span className="font-mono text-sm tracking-widest text-brand font-bold uppercase block">Deep Dive</span>
        <h3 ref={h3Ref}
          className="font-display font-black text-[clamp(3rem,6vw,7.5rem)] text-neutral-900 dark:text-white tracking-tighter leading-[0.88]">
          Each Brand. <span className="text-brand">Its Domain.</span>
        </h3>
      </div>
      {SUB_BRANDS.map((brand,i) => (
        <SubBrandSection key={brand.num} brand={brand} isEven={i%2===0} />
      ))}
    </div>
  );
}

// ─── Values summary grid ──────────────────────────────────────────────────────
function ValuesSummarySection() {
  const ref      = useRef<HTMLDivElement>(null);
  const gridRef  = useRef<HTMLDivElement>(null);
  const h3Ref    = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (h3Ref.current) revealWords(h3Ref.current, ref.current!);
      if (gridRef.current) scaleBurst(gridRef.current.children, gridRef.current);
    });
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="py-24 md:py-32 space-y-16">
      <div className="text-center space-y-5 max-w-3xl mx-auto">
        <span className="font-mono text-sm tracking-widest text-brand font-bold uppercase block">Brand Values at a Glance</span>
        <h3 ref={h3Ref}
          className="font-display font-black text-[clamp(2.5rem,5vw,5.5rem)] text-neutral-900 dark:text-white tracking-tight leading-[0.9]">
          Shared commitment to <span className="text-brand">innovation, quality & community.</span>
        </h3>
        <p className="text-neutral-500 dark:text-neutral-400 text-xl leading-relaxed">
          Five brands, one integrated ecosystem — all unified under the YouTobia vision.
        </p>
      </div>
      <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          { name:"QenaView",        tags:["Streaming","Accessibility","Quality"],         isHolder:false },
          { name:"eTop Production", tags:["Content","Excellence","Sustainability"],        isHolder:false },
          { name:"YentaBarsiisaa",  tags:["Education","Empowerment","Inclusion"],          isHolder:false },
          { name:"MirXog",          tags:["Information","Accuracy","Community"],           isHolder:false },
          { name:"EnqoqCash",       tags:["Interactive Trivia","Real Rewards","Culture"],  isHolder:false },
          { name:"YouTobia P.l.C.", tags:["Innovation","Creativity","Integrity"],          isHolder:true  },
        ].map((b,i) => (
          <TiltCard key={i} className="h-full">
            <div className={`h-full rounded-3xl p-8 space-y-6 border-2 transition-all duration-300 ${
              b.isHolder
                ? "bg-brand border-brand shadow-2xl shadow-brand/30"
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10 hover:border-brand/50 hover:shadow-xl hover:shadow-brand/10"
            }`}>
              <h4 className={`font-display font-black text-2xl ${b.isHolder?"text-white":"text-neutral-900 dark:text-white"}`}>{b.name}</h4>
              <div className="flex flex-wrap gap-3">
                {b.tags.map(t => (
                  <span key={t} className={`text-sm font-mono px-4 py-2 rounded-full ${
                    b.isHolder ? "bg-white/15 text-white" : "bg-neutral-100 dark:bg-white/8 text-neutral-600 dark:text-neutral-300"
                  }`}>{t}</span>
                ))}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </div>
  );
}

export default EcosystemSection;

import React, { useState, useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { revealWords, scaleBurst, clipReveal, scrubDrift, drawLine } from "../lib/scrollAnimations";
import { ArrowUpRight } from "lucide-react";
import { SectionBackground } from "./SectionBackground";

interface StudioShowcaseProps { onPlayDemo: () => void; }

export const StudioShowcase: React.FC<StudioShowcaseProps> = ({ onPlayDemo }) => {
  const sectionRef   = useRef<HTMLElement>(null);
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const descRef      = useRef<HTMLParagraphElement>(null);
  const lineRef      = useRef<HTMLDivElement>(null);
  const gridRef      = useRef<HTMLDivElement>(null);
  const pillarsRef   = useRef<HTMLDivElement>(null);
  const driftRef     = useRef<HTMLDivElement>(null);
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const contentRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const capabilities = [
    { id:1, tag:"FLAGSHIP PRODUCT",  title:"ENQOQ CASH",
      desc:"A regulated, multi-platform, knowledge-driven trivia network. Compete across General Knowledge, Sports, Science, and History categories with real-time score multipliers.",
      image:"/src/assets/images/game_interface_1781111602583.png", span:"md:col-span-8", action:onPlayDemo, btnText:"Play Demo" },
    { id:2, tag:"SUB-BRAND 01", title:"QENAVIEW",
      desc:"Multimedia Streaming & Distribution — revolutionizing how people access and experience multimedia content through an accessible, high-definition platform.",
      image:"/src/assets/images/modern_studio_1781111587439.png", span:"md:col-span-4" },
    { id:3, tag:"SUB-BRAND 02", title:"eTop Production",
      desc:"Multimedia Content Production — a leading production house creating compelling stories and fostering a creative ecosystem where artists push the boundaries of content.",
      image:"https://images.unsplash.com/photo-1578241561880-0a1d5db3cb8a?w=800&q=75", span:"md:col-span-4" },
    { id:4, tag:"SUB-BRANDS 03 · 04", title:"YENTABARSIISAA & MIRXOG",
      desc:"Skills & Education Hub empowering multimedia professionals through inclusive training — plus a trusted Information Hub delivering insights, news, and analysis for the multimedia world.",
      image:"https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&q=75", span:"md:col-span-8" },
  ];

  const featuresList = [
    { title:"Innovation",       desc:"Pushing boundaries in multimedia technologies and trends across all five sub-brands." },
    { title:"Creativity",       desc:"Fostering original, high-quality content creation at every level of the ecosystem." },
    { title:"Collaboration",    desc:"Building strong partnerships across the multimedia landscape with diverse talent." },
    { title:"Integrity & Inclusion", desc:"Upholding transparency and trust while promoting a wide range of voices and perspectives." },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current!;

      // Headline word reveal
      if (headlineRef.current) revealWords(headlineRef.current, section);

      // Desc slide in from right
      if (descRef.current) {
        gsap.from(descRef.current, {
          x: 80, opacity: 0, duration: 1.0, ease: "expo.out",
          scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none reverse" },
        });
      }

      // Line draw
      if (lineRef.current) drawLine(lineRef.current, section);

      // Scrub-drifting ghost text
      if (driftRef.current) scrubDrift(driftRef.current, 100, true);

      // Bento cards: clip-reveal staggered
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          clipPath: "inset(100% 0% 0% 0%)",
          opacity: 0,
          duration: 0.9,
          ease: "expo.inOut",
          delay: i * 0.12,
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });

      // Pillar cards burst in
      if (pillarsRef.current) {
        scaleBurst(pillarsRef.current.querySelectorAll(".pillar-card"), pillarsRef.current);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Hover tilt
  const handleCardEnter = (i: number) => {
    setHoveredCard(i);
    const card    = cardRefs.current[i];
    const content = contentRefs.current[i];
    if (card)    gsap.to(card,    { rotateX:-4, rotateY:6, scale:1.02, duration:0.35, ease:"power2.out" });
    if (content) gsap.to(content, { y:-8, duration:0.4, ease:"power2.out" });
  };
  const handleCardLeave = (i: number) => {
    setHoveredCard(null);
    const card    = cardRefs.current[i];
    const content = contentRefs.current[i];
    if (card)    gsap.to(card,    { rotateX:0, rotateY:0, scale:1, duration:0.5, ease:"elastic.out(1,0.6)" });
    if (content) gsap.to(content, { y:0, duration:0.4, ease:"power2.out" });
  };

  return (
    <section ref={sectionRef} id="studio"
      className="relative py-24 md:py-32 bg-[#fafafa] dark:bg-[#060606] border-t border-rose-100 dark:border-white/8 px-6 md:px-12 overflow-hidden">
      <SectionBackground variant="studio" />

      {/* Scrub-drifting ghost text */}
      <div ref={driftRef}
        className="absolute -bottom-8 right-0 font-display font-black text-[15vw] leading-none text-neutral-100/30 dark:text-white/[0.015] whitespace-nowrap select-none pointer-events-none">
        STUDIO
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">

        {/* Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div ref={lineRef} className="lg:col-span-12 w-full h-px bg-neutral-200 dark:bg-white/8 mb-4 origin-left" />
          <div className="lg:col-span-6 space-y-4">
            <span className="font-mono text-xs tracking-widest text-[#FF1E27] font-semibold">03 / THE YOUTOBIA ECOSYSTEM</span>
            <h2 ref={headlineRef}
              className="font-serif italic text-4xl sm:text-6xl text-neutral-900 dark:text-white tracking-tight leading-none">
              Five Brands. <span className="text-[#FF1E27] font-display font-black tracking-tighter uppercase not-italic">One Vision</span>.
            </h2>
          </div>
          <div className="lg:col-span-6">
            <p ref={descRef}
              className="text-neutral-600 dark:text-neutral-300 text-base md:text-lg font-sans max-w-xl leading-relaxed font-light">
              YouTobia Multimedia P.l.C. is a holding company that unites five specialized sub-brands — each designed to lead in its domain: streaming, content production, education, information, and interactive trivia.
            </p>
          </div>
        </div>

        {/* Bento grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {capabilities.map((card, i) => (
            <div
              key={card.id}
              ref={el => { cardRefs.current[i] = el; }}
              className={`relative overflow-hidden group rounded-2xl border border-neutral-200/80 bg-white flex flex-col justify-end min-h-[460px] cursor-pointer shadow-xs ${card.span}`}
              style={{ transformStyle: "preserve-3d" }}
              onMouseEnter={() => handleCardEnter(i)}
              onMouseLeave={() => handleCardLeave(i)}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                <img src={card.image} alt={card.title} referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale opacity-55 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-700 transform group-hover:scale-[1.06]" />
              </div>
              <div ref={el => { contentRefs.current[i] = el; }} className="relative z-20 p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] tracking-widest text-[#FF1E27] font-bold bg-[#FF1E27]/10 border border-[#FF1E27]/20 rounded px-2.5 py-1">{card.tag}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif italic text-3xl text-white tracking-tight leading-tight group-hover:text-red-400 transition-colors">{card.title}</h3>
                  <p className="text-white/80 text-xs md:text-sm leading-relaxed max-w-xl font-sans font-light">{card.desc}</p>
                </div>
                {card.action && (
                  <button onClick={(e) => { e.stopPropagation(); card.action!(); }}
                    className="mt-2 inline-flex items-center gap-2 bg-[#FF1E27] hover:bg-[#C90E16] text-white text-xs font-mono tracking-widest px-4 py-2 rounded-lg transition-colors font-bold cursor-pointer">
                    <span>{card.btnText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Brand pillars */}
        <div ref={pillarsRef} className="pt-16 border-t border-neutral-200 dark:border-white/8 space-y-12">
          <div className="max-w-md space-y-2">
            <span className="font-mono text-xs tracking-widest text-brand font-semibold">OUR CORE VALUES</span>
            <h3 className="font-serif italic text-3xl text-neutral-900 dark:text-white tracking-tight pt-1">The YouTobia Principles</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuresList.map((f, i) => (
              <div key={i}
                className="pillar-card bg-white dark:bg-black/45 border border-neutral-200 dark:border-white/5 p-6 rounded-xl hover:border-brand/40 hover:shadow-lg transition-all duration-300 space-y-4 relative group"
                onMouseEnter={e => gsap.to(e.currentTarget, { y:-6, duration:0.3, ease:"power2.out" })}
                onMouseLeave={e => gsap.to(e.currentTarget, { y:0,  duration:0.5, ease:"elastic.out(1,0.5)" })}>
                <div className="absolute top-0 left-0 w-0.5 h-0 bg-brand group-hover:h-full transition-all duration-300" />
                <div className="w-10 h-10 bg-[#FF1E27]/5 border border-[#FF1E27]/20 rounded-lg flex items-center justify-center text-[#FF1E27] font-mono font-bold text-xs">
                  0{i+1}
                </div>
                <h4 className="font-serif italic text-lg text-neutral-800 dark:text-white">{f.title}</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-300 leading-relaxed font-sans font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
export default StudioShowcase;

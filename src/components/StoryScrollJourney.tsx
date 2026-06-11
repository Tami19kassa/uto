import React, { useRef, useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { Reveal } from "./Reveal";
import { HelpCircle, ChevronRight, Activity, Cpu, Award, Coins, Play } from "lucide-react";

interface StoryStep {
  id: string; num: string; title: string; subtitle: string;
  desc: string; icon: React.ReactNode; badge: string;
}

export const StoryScrollJourney: React.FC<{ onPlayDemo: () => void }> = ({ onPlayDemo }) => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const beadRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const cardRefs      = useRef<(HTMLDivElement | null)[]>([]);

  const steps: StoryStep[] = [
    { id:"step1", num:"01", title:"The Trivia Challenge",
      subtitle:"GENERAL KNOWLEDGE, SPORTS, SCIENCE & HISTORY",
      desc:"Our interactive riddle engine presents fascinating questions across diverse categories. Challenge your mind, select your favorite category, and discover deep cultural lore.",
      icon:<HelpCircle className="w-6 h-6 text-[#FF1E27]" />, badge:"CHAPTER I: THE RIDDLE" },
    { id:"step2", num:"02", title:"Dynamic Score Multipliers",
      subtitle:"REPLY QUICKLY, RECORD SUCCESS",
      desc:"Evaluate the multiple-choice choices under a live timer constraint. You hold precious seconds to lock in your answer. Fast response times boost your score and multipliers.",
      icon:<Cpu className="w-6 h-6 text-[#FF1E27]" />, badge:"CHAPTER II: THE VELOCITY" },
    { id:"step3", num:"03", title:"Instant Response System",
      subtitle:"HIGH-SPEED SUBMISSION FEEDBACK",
      desc:"Once submitted, your option is evaluated in milliseconds. YouTobia's game interface logs correct selections instantly, updating your dynamic score and level progression.",
      icon:<Activity className="w-6 h-6 text-[#FF1E27]" />, badge:"CHAPTER III: THE COUNT" },
    { id:"step4", num:"04", title:"Earning Dynamic Accolades",
      subtitle:"UNLOCK RECORD COMPLETED PASSES",
      desc:"Rise above the starting questions. Your triumphant answer streaks unlock the digital Crimson Enqoq Pass — a stylized virtual card celebrating your intellectual mastery.",
      icon:<Award className="w-6 h-6 text-[#FF1E27]" />, badge:"CHAPTER IV: THE REVELATION" },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {

      // Scrub the progress bar as user scrolls through the section
      gsap.to(progressBarRef.current, {
        height: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          end: "bottom 40%",
          scrub: 0.8,
        },
      });

      // Each step card: 3D reveal + perspective tilt
      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const isEven = i % 2 === 0;

        gsap.from(card, {
          opacity: 0,
          scale: 0.92,
          y: 35,
          rotateX: 6,
          rotateY: isEven ? 12 : -12,
          transformStyle: "preserve-3d",
          duration: 0.85,
          ease: "yutobia.enter",
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });

        // Hover tilt
        const handleEnter = () => gsap.to(card, {
          scale: 1.025, rotateY: isEven ? 3 : -3, rotateX: -2,
          duration: 0.35, ease: "power2.out",
        });
        const handleLeave = () => gsap.to(card, {
          scale: 1, rotateY: 0, rotateX: 0,
          duration: 0.5, ease: "elastic.out(1,0.6)",
        });
        card.addEventListener("mouseenter", handleEnter);
        card.addEventListener("mouseleave", handleLeave);
      });

      // Timeline beads pop in
      beadRefs.current.forEach((bead, i) => {
        if (!bead) return;
        gsap.from(bead, {
          scale: 0.8,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: bead,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        });
        // Continuous pulse on the bead ring
        const ring = bead.querySelector(".bead-ring") as HTMLElement;
        if (ring) {
          gsap.to(ring, {
            scale: 1.6, opacity: 0,
            duration: 1.4, ease: "power2.out",
            repeat: -1, repeatDelay: 0.8,
          });
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="story-journey"
      className="relative py-28 md:py-40 bg-white dark:bg-[#060606] border-t border-rose-100 dark:border-white/8 px-6 md:px-12 overflow-hidden"
    >
      {/* Editorial watermarks */}
      <div className="absolute inset-0 huge-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute left-[2%] top-[25%] text-neutral-100/55 dark:text-neutral-900/50 font-display font-black text-[12rem] xl:text-[24rem] leading-none select-none pointer-events-none tracking-tighter uppercase">
        TRIVIA
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-neutral-200 dark:border-white/10 pb-16 mb-24">
          <div className="lg:col-span-7 space-y-4">
            <Reveal effect="fade-right" duration={0.5} easing="ease-out-sine" as="span"
              className="font-mono text-xs tracking-widest text-[#FF1E27] font-bold flex items-center gap-2">
              <span className="w-2 h-2 bg-[#FF1E27] rounded-full animate-pulse" />
              02 / THE GAME LOOP
            </Reveal>
            <Reveal effect="fade-up" delay={0.1} duration={0.7} easing="ease-out-cubic" as="h2"
              className="font-serif italic text-4xl sm:text-6xl text-neutral-900 dark:text-white tracking-tight leading-none">
              How the Mind <br />
              <span className="text-[#FF1E27] font-display font-black tracking-tighter uppercase not-italic">Unlocks Fortune</span>.
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal effect="fade-up-left" delay={0.2} duration={0.6} as="p"
              className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base font-sans leading-relaxed font-light">
              We have designed the premier modern trivia destination. Follow the game process below to discover how continuous learning converts into concrete competitive achievements and score metrics.
            </Reveal>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Scrubbing progress line (desktop) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-neutral-200 dark:bg-white/10 hidden md:block">
            <div
              ref={progressBarRef}
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#FF1E27] to-[#ffd1d3] origin-top"
              style={{ height: "0%" }}
            />
          </div>

          <div className="space-y-24 md:space-y-40">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div key={step.id}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative`}>

                  {/* Step info */}
                  <Reveal
                    effect={isEven ? "fade-right" : "fade-left"}
                    delay={0.1} duration={0.7} easing="ease-out-quart" margin="-120px"
                    className={`md:col-span-5 space-y-6 ${isEven ? "md:order-1" : "md:order-3 md:text-right md:items-end flex flex-col"}`}
                  >
                    <span className="font-mono text-xs tracking-widest text-[#FF1E27] font-bold">{step.badge}</span>
                    <div className="flex items-center gap-4 group">
                      {isEven && (
                        <div className="w-12 h-12 rounded-xl bg-[#FF1E27]/10 flex items-center justify-center shrink-0 border border-[#FF1E27]/20">
                          {step.icon}
                        </div>
                      )}
                      <div>
                        <span className="font-mono text-[10px] text-neutral-400 block">SERIES {step.num}/04</span>
                        <h3 className="font-serif italic text-2xl sm:text-3xl text-neutral-900 dark:text-white tracking-tight group-hover:text-[#FF1E27] transition-colors">
                          {step.title}
                        </h3>
                      </div>
                      {!isEven && (
                        <div className="w-12 h-12 rounded-xl bg-[#FF1E27]/5 flex items-center justify-center shrink-0 border border-[#FF1E27]/20">
                          {step.icon}
                        </div>
                      )}
                    </div>
                    <p className={`text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed font-sans font-light max-w-md ${!isEven ? "md:text-right" : ""}`}>
                      {step.desc}
                    </p>
                  </Reveal>

                  {/* Bead */}
                  <div className="md:col-span-2 flex justify-start md:justify-center md:order-2 z-10">
                    <div
                      ref={el => { beadRefs.current[idx] = el; }}
                      className="w-10 h-10 rounded-full bg-white dark:bg-neutral-950 border-2 border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-800 dark:text-white font-mono text-xs font-bold hover:border-[#FF1E27] transition-colors relative"
                    >
                      {step.num}
                      <span className="bead-ring absolute -inset-1 rounded-full border border-[#FF1E27]/40" />
                    </div>
                  </div>

                  {/* Interactive card */}
                  <div
                    ref={el => { cardRefs.current[idx] = el; }}
                    className={`md:col-span-12 lg:col-span-5 ${isEven ? "md:order-3" : "md:order-1"}`}
                    style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                  >
                    <div className="bg-[#fafafa]/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden aspect-video flex flex-col justify-between group hover:border-[#FF1E27]/30 transition-all duration-500 shadow-md">
                      <div className="absolute inset-0 huge-grid-pattern opacity-10 pointer-events-none" />
                      <div className="absolute top-0 left-0 w-2 h-full bg-[#FF1E27] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FF1E27] animate-pulse" />
                          <span className="font-mono text-[9px] text-neutral-400 tracking-widest uppercase">
                            DEMO_MODULE: STEP_{step.num}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-[#FF1E27] tracking-widest">[ ENQOQ RUNTIME ]</span>
                      </div>

                      {/* Step-specific graphic */}
                      <StepGraphic stepId={step.id} />

                      {/* Footer */}
                      <div className="flex items-center justify-between border-t border-neutral-200 dark:border-white/10 pt-3">
                        <span className="text-[9px] font-mono text-neutral-400">CHAPTER {step.num} // PROCESS</span>
                        <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-500">
                          <span>DEMO LOOP</span>
                          <ChevronRight className="w-3 h-3 text-[#FF1E27]" />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <Reveal effect="zoom-in" duration={0.6} easing="ease-out-back" margin="-100px"
          className="mt-28 md:mt-40 text-center space-y-6 max-w-xl mx-auto border border-rose-100 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/60 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-[#FF1E27]/40 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FF1E27] via-neutral-200 dark:via-white/10 to-[#FF1E27]" />
          <Reveal effect="zoom-in-up" delay={0.1} duration={0.5} as="h3"
            className="font-serif italic text-3xl md:text-4xl text-neutral-900 dark:text-white tracking-tight leading-none">
            Ready to test <br />
            <span className="text-[#FF1E27] font-display font-black tracking-tighter uppercase not-italic">your own mind?</span>
          </Reveal>
          <Reveal effect="fade-up" delay={0.2} duration={0.5} as="p"
            className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm leading-relaxed font-sans font-light">
            A diverse treasury of General Knowledge, Sports, Science, and History challenges backed by
            high-stakes score multipliers awaits.
          </Reveal>
          <div className="pt-2 flex justify-center">
            <button onClick={onPlayDemo}
              className="group flex items-center gap-3 bg-[#FF1E27] hover:bg-[#C90E16] text-white font-display font-bold py-4 px-8 rounded-xl scale-100 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-xl shadow-[#FF1E27]/20 cursor-pointer">
              <Play className="w-4 h-4 fill-white" />
              <span>LAUNCH ENQOQ CASH</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </Reveal>

      </div>
    </section>
  );
};

// ─── Per-step graphic panels ──────────────────────────────────────────────────
function StepGraphic({ stepId }: { stepId: string }) {
  const scanRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (stepId === "step3" && scanRef.current) {
      gsap.to(scanRef.current, {
        top: "90%", duration: 2.5, ease: "none",
        repeat: -1, yoyo: true,
      });
    }
  }, [stepId]);

  if (stepId === "step1") return (
    <div className="my-auto flex flex-col items-center justify-center space-y-4">
      <FloatCard>
        <div className="bg-white dark:bg-neutral-900 px-6 py-4 rounded-xl border border-neutral-200 dark:border-white/10 shadow-md relative text-center max-w-xs overflow-hidden">
          <span className="absolute top-0 right-0 font-mono text-[8px] bg-[#FF1E27] text-white px-1.5 py-0.5 font-bold uppercase rounded-bl">TRIVIA</span>
          <div className="text-neutral-400 font-mono text-[9px] mb-1">GENERAL KNOWLEDGE</div>
          <div className="font-serif italic text-base text-[#FF1E27] tracking-wide">
            "Which planet is known as the Red Planet?"
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 text-[10px] mt-2 font-light">Category: Space & Science</p>
        </div>
      </FloatCard>
      <EqualiserDots />
    </div>
  );

  if (stepId === "step2") return (
    <div className="my-auto flex flex-col justify-center space-y-3 w-full max-w-sm mx-auto">
      <OptionRow label="A. Venus" />
      <OptionRow label="B. Mars" selected />
      <OptionRow label="C. Jupiter" faded />
    </div>
  );

  if (stepId === "step3") return (
    <div className="my-auto flex flex-col justify-center space-y-4 items-center">
      <div className="font-mono text-[10px] text-neutral-500 w-full max-w-xs bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-white/5 space-y-2 relative shadow-xs overflow-hidden">
        <div ref={scanRef} className="absolute left-0 right-0 h-[1.5px] bg-[#FF1E27]" style={{ top: "10%" }} />
        <div className="flex justify-between border-b border-neutral-200 dark:border-white/10 pb-1.5 text-[#FF1E27] font-bold">
          <span>ACTIVE SCOREBOARD</span><span>ONLINE</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">GAMER_OPTION:</span>
          <span className="text-neutral-800 dark:text-neutral-200 font-bold">CORRECT_CHOICE</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">ADDED_MULTIPLIER:</span>
          <span className="text-neutral-700 dark:text-neutral-400">3x SPEED BOOST</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">LEVEL STATUS:</span>
          <span className="text-green-600 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />COMPLETED
          </span>
        </div>
      </div>
    </div>
  );

  if (stepId === "step4") return (
    <div className="my-auto flex items-center justify-center py-2">
      <FloatCard amplitude={5} duration={5}>
        <div className="bg-white dark:bg-neutral-900 border-2 border-dashed border-[#FF1E27] rounded-xl p-4 w-60 text-center relative overflow-hidden shadow-md">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-[#FF1E27]" />
          <div className="flex justify-between items-center text-[7px] font-mono text-neutral-400 tracking-widest uppercase mb-2">
            <span>YUTOBIA COMPLETED TICKET</span>
            <span className="text-[#FF1E27] font-bold">#94021</span>
          </div>
          <div className="w-10 h-10 mx-auto bg-[#FF1E27]/5 rounded-full flex items-center justify-center mb-2 border border-[#FF1E27]/20">
            <Coins className="w-5 h-5 text-[#FF1E27]" />
          </div>
          <h4 className="font-serif italic text-neutral-800 dark:text-neutral-200 text-sm">Trivia Demo Companion</h4>
          <div className="font-mono text-lg font-black text-[#FF1E27] tracking-tighter mt-1">+1,250 PTS</div>
          <p className="text-[10px] text-[#FF1E27] font-mono uppercase tracking-[0.2em] mt-1">DEMO ACCLAIMED</p>
        </div>
      </FloatCard>
    </div>
  );

  return null;
}

// ─── Micro helpers ────────────────────────────────────────────────────────────
function FloatCard({ children, amplitude = 6, duration = 4 }: {
  children: React.ReactNode; amplitude?: number; duration?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        y: amplitude, duration, ease: "sine.inOut",
        yoyo: true, repeat: -1,
      });
    });
    return () => ctx.revert();
  }, [amplitude, duration]);
  return <div ref={ref}>{children}</div>;
}

function EqualiserDots() {
  const refs = [useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null), useRef<HTMLSpanElement>(null)];
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      refs.forEach((r, i) => {
        gsap.to(r.current, {
          y: -4, duration: 0.4, ease: "sine.inOut",
          yoyo: true, repeat: -1, delay: i * 0.15,
        });
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <div className="flex gap-1">
      {refs.map((r, i) => (
        <span key={i} ref={r} className="w-1.5 h-1.5 rounded-full bg-neutral-200 inline-block" />
      ))}
    </div>
  );
}

function OptionRow({ label, selected, faded }: { label: string; selected?: boolean; faded?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (selected) {
      const ctx = gsap.context(() => {
        gsap.to(ref.current, {
          scale: 1.02, duration: 3,
          ease: "sine.inOut", yoyo: true, repeat: -1,
        });
      });
      return () => ctx.revert();
    }
  }, [selected]);
  return (
    <div ref={ref}
      className={`w-full p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
        selected
          ? "bg-[#FF1E27]/5 border-[#FF1E27]/50 shadow-xs shadow-[#FF1E27]/10"
          : faded
            ? "bg-white/40 dark:bg-neutral-950/40 border-neutral-200 dark:border-white/5 opacity-50"
            : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-white/10"
      }`}>
      <span className={selected ? "text-neutral-900 dark:text-white font-bold flex items-center gap-1.5" : "text-neutral-600 dark:text-neutral-400"}>
        {selected && <span className="text-[#FF1E27] font-black">●</span>} {label}
      </span>
      {selected
        ? <span className="w-3.5 h-3.5 rounded-full bg-[#FF1E27] shrink-0 flex items-center justify-center text-[8px] text-white">✓</span>
        : <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 shrink-0" />
      }
    </div>
  );
}

export default StoryScrollJourney;

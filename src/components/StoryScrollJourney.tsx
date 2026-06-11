import React, { useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronRight, Activity, Cpu, Award, MessageCircle, Coins, ShieldCheck, Play } from "lucide-react";

interface StoryStep {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ReactNode;
  badge: string;
}

export const StoryScrollJourney: React.FC<{ onPlayDemo: () => void }> = ({ onPlayDemo }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll within this storytelling section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Transform lines or graphics based on scroll
  const progressHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);
  const pulseScale = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0.95, 1.05, 0.95]);
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.6, 0.9], [0.1, 0.3, 0.1]);

  const steps: StoryStep[] = [
    {
      id: "step1",
      num: "01",
      title: "The Trivia Challenge",
      subtitle: "GENERAL KNOWLEDGE, SPORTS, SCIENCE & HISTORY",
      desc: "Our interactive riddle engine presents fascinating questions across diverse categories. Challenge your mind, select your favorite category, and discover deep cultural lore.",
      icon: <HelpCircle className="w-6 h-6 text-[#FF1E27]" />,
      badge: "CHAPTER I: THE RIDDLE"
    },
    {
      id: "step2",
      num: "02",
      title: "Dynamic Score Multipliers",
      subtitle: "REPLY QUICKLY, RECORD SUCCESS",
      desc: "Evaluate the multiple-choice choices under a live timer constraint. You hold precious seconds to lock in your answer. Fast response times boost your score and multipliers.",
      icon: <Cpu className="w-6 h-6 text-[#FF1E27]" />,
      badge: "CHAPTER II: THE VELOCITY"
    },
    {
      id: "step3",
      num: "03",
      title: "Instant Response System",
      subtitle: "HIGH-SPEED SUBMISSION FEEDBACK",
      desc: "Once submitted, your option is evaluated in milliseconds. YouTobia's game interface logs correct selections instantly, updating your dynamic score and checking your level progression.",
      icon: <Activity className="w-6 h-6 text-[#FF1E27]" />,
      badge: "CHAPTER III: THE COUNT"
    },
    {
      id: "step4",
      num: "04",
      title: "Earning Dynamic Accolades",
      subtitle: "UNLOCK RECORD COMPLETED PASSES",
      desc: "Rise above the starting questions. Your triumphant answer streaks unlock the digital Crimson Enqoq Pass — a stylized virtual card celebrating your intellectual mastery.",
      icon: <Award className="w-6 h-6 text-[#FF1E27]" />,
      badge: "CHAPTER IV: THE REVELATION"
    }
  ];

  return (
    <section 
      ref={containerRef}
      id="story-journey" 
      className="relative py-28 md:py-40 bg-white border-t border-rose-100 px-6 md:px-12 overflow-hidden"
    >
      {/* Editorial Watermark & Grid Background */}
      <div className="absolute inset-0 huge-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute left-[2%] top-[25%] text-neutral-100/55 dark:text-neutral-900/50 font-display font-black text-[12rem] xl:text-[24rem] leading-none select-none pointer-events-none tracking-tighter uppercase">
        TRIVIA
      </div>
      <div className="absolute right-[2%] bottom-[15%] text-[#FF1E27]/[0.01] font-display font-black text-[12rem] xl:text-[24rem] leading-none select-none pointer-events-none tracking-tighter">
        REWARDS
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Typographic Intro Statement - Animated text */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-neutral-200 dark:border-white/10 pb-16 mb-24 transition-colors">
          <div className="lg:col-span-7 space-y-4">
            <motion.span 
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-mono text-xs tracking-widest text-[#FF1E27] font-bold flex items-center gap-2"
            >
              <span className="w-2 h-2 bg-[#FF1E27] rounded-full animate-pulse" />
              02 / THE GAME LOOP
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif italic text-4xl sm:text-6xl text-neutral-900 dark:text-white tracking-tight leading-none transition-colors"
            >
              How the Mind <br />
              <span className="text-[#FF1E27] font-display font-black tracking-tighter uppercase not-italic">Unlocks Fortune</span>.
            </motion.h2>
          </div>
          <div className="lg:col-span-5">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base font-sans leading-relaxed font-light transition-colors"
            >
              We have designed the premier modern trivia destination. Follow the game process below to discover how continuous learning converts into concrete competitive achievements and score metrics.
            </motion.p>
          </div>
        </div>

        {/* Story Journey Grid (Timeline side-by-side with interactive visual state) */}
        <div className="relative">
          
          {/* Centered timeline progress bar on Desktop (hidden on mobile) */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-neutral-200 -translate-x-[0.5px] pointer-events-none hidden md:block">
            {/* Live animated active scrolling tracker trace */}
            <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#FF1E27] to-[#ffd1d3] origin-top"
              style={{ height: progressHeight }}
            />
          </div>

          <div className="space-y-24 md:space-y-40">
            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div 
                  key={step.id} 
                  className={`grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative ${isEven ? "" : "md:flex-row-reverse"}`}
                >
                  
                  {/* Step Info segment */}
                  <motion.div 
                    className={`md:col-span-5 space-y-6 ${isEven ? "md:order-1" : "md:order-3 md:text-right md:items-end flex flex-col"}`}
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  >
                    <span className="font-mono text-xs tracking-widest text-[#FF1E27] font-bold">
                      {step.badge}
                    </span>
                    
                    <div className="flex items-center gap-4 group">
                      {isEven && (
                        <div className="w-12 h-12 rounded-xl bg-[#FF1E27]/10 flex items-center justify-center shrink-0 border border-[#FF1E27]/20">
                          {step.icon}
                        </div>
                      )}
                      <div>
                        <span className="font-mono text-[10px] text-neutral-400 block">SERIES {step.num}/04</span>
                        <h3 className="font-serif italic text-2xl sm:text-3xl text-neutral-900 tracking-tight group-hover:text-[#FF1E27] transition-colors">
                          {step.title}
                        </h3>
                      </div>
                      {!isEven && (
                        <div className="w-12 h-12 rounded-xl bg-[#FF1E27]/5 flex items-center justify-center shrink-0 border border-[#FF1E27]/20">
                          {step.icon}
                        </div>
                      )}
                    </div>

                    <p className={`text-neutral-600 text-sm leading-relaxed font-sans font-light max-w-md ${!isEven ? "md:text-right" : ""}`}>
                      {step.desc}
                    </p>
                  </motion.div>

                  {/* Desktop Center Ticker Bead (Absolute timeline indicator block) */}
                  <div className="md:col-span-2 flex justify-start md:justify-center md:order-2 z-10">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-white border-2 border-neutral-200 flex items-center justify-center text-neutral-800 font-mono text-xs font-bold hover:border-[#FF1E27] transition-colors relative"
                      whileInView={{ scale: [0.8, 1.1, 1] }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      {step.num}
                      <span className="absolute -inset-1 rounded-full border border-[#FF1E27]/30 animate-pulse" />
                    </motion.div>
                  </div>

                  {/* Interactive Dynamic Graphic Showcase representing each step in red and white with high-end 3D perspective */}
                  <motion.div 
                    className={`md:col-span-12 lg:col-span-5 ${isEven ? "md:order-3" : "md:order-1"}`}
                    initial={{ opacity: 0, scale: 0.92, y: 35, rotateX: 6, rotateY: isEven ? 12 : -12 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0, rotateX: 0, rotateY: 0 }}
                    whileHover={{ scale: 1.025, rotateY: isEven ? 3 : -3, rotateX: -2 }}
                    viewport={{ once: true, margin: "-120px" }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                  >
                    <div className="bg-[#fafafa]/80 border border-neutral-200 rounded-2xl p-6 md:p-8 relative overflow-hidden aspect-video flex flex-col justify-between group hover:border-[#FF1E27]/30 transition-all duration-500 shadow-md">
                      
                      {/* Grid background on inside cards too */}
                      <div className="absolute inset-0 huge-grid-pattern opacity-10 pointer-events-none" />
                      <div className="absolute top-0 left-0 w-2 h-full bg-[#FF1E27] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top" />

                      {/* Header bar */}
                      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#FF1E27] animate-pulse" />
                          <span className="font-mono text-[9px] text-neutral-400 tracking-widest uppercase">
                            DEMO_MODULE: STEP_{step.num}
                          </span>
                        </div>
                        <span className="font-mono text-[9px] text-[#FF1E27] tracking-widest">
                          [ ENQOQ RUNTIME ]
                        </span>
                      </div>                      {/* CHAPTER 1 GRAPHIC: A High-Tech Trivia Selection */}
                      {step.id === "step1" && (
                        <div className="my-auto flex flex-col items-center justify-center space-y-4">
                           <motion.div 
                            className="bg-white px-6 py-4 rounded-xl border border-neutral-200 dark:border-white/10 dark:bg-neutral-900 shadow-md relative text-center max-w-xs overflow-hidden"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                          >
                            <span className="absolute top-0 right-0 font-mono text-[8px] bg-[#FF1E27] text-white px-1.5 py-0.5 font-bold uppercase rounded-bl">
                              TRIVIA
                            </span>
                            <div className="text-neutral-400 font-mono text-[9px] mb-1">GENERAL KNOWLEDGE</div>
                            <div className="font-serif italic text-base text-[#FF1E27] tracking-wide">
                              "Which planet is known as the Red Planet?"
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 text-[10px] mt-2 font-light">Category: Space & Science</p>
                          </motion.div>
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 animate-bounce" style={{ animationDelay: "0s" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 animate-bounce" style={{ animationDelay: "0.2s" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 animate-bounce" style={{ animationDelay: "0.4s" }} />
                          </div>
                        </div>
                      )}

                      {/* CHAPTER 2 GRAPHIC: User Interactive Decision Matrix */}
                      {step.id === "step2" && (
                        <div className="my-auto flex flex-col justify-center space-y-3 w-full max-w-sm mx-auto">
                          <div className="w-full bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-white/5 text-xs font-mono flex items-center justify-between group-hover:border-[#FF1E27]/20 transition-all">
                            <span className="text-neutral-600 dark:text-neutral-400">A. Venus</span>
                            <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 bg-transparent shrink-0" />
                          </div>
                          <motion.div 
                            className="w-full bg-[#FF1E27]/5 p-3 rounded-xl border border-[#FF1E27]/50 text-xs font-mono flex items-center justify-between shadow-xs shadow-[#FF1E27]/10"
                            animate={{ scale: [0.98, 1.02, 0.98] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                          >
                            <span className="text-neutral-900 dark:text-white font-bold flex items-center gap-1.5">
                              <span className="text-[#FF1E27] font-black">●</span> B. Mars
                            </span>
                            <span className="w-3.5 h-3.5 rounded-full bg-[#FF1E27] shrink-0 flex items-center justify-center text-[8px] text-white">✓</span>
                          </motion.div>
                          <div className="w-full bg-white/40 dark:bg-neutral-950/40 p-3 rounded-xl border border-neutral-200 dark:border-white/5 text-xs font-mono flex items-center justify-between opacity-50">
                            <span className="text-neutral-600 dark:text-neutral-500">C. Jupiter</span>
                            <span className="w-3.5 h-3.5 rounded-full border border-neutral-300 bg-transparent shrink-0" />
                          </div>
                        </div>
                      )}

                      {/* CHAPTER 3 GRAPHIC: Dynamic Response and Score Addition */}
                      {step.id === "step3" && (
                        <div className="my-auto flex flex-col justify-center space-y-4 items-center">
                          <div className="font-mono text-[10px] text-neutral-500 w-full max-w-xs bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-white/5 space-y-2 relative shadow-xs">
                            {/* Scanning horizontal line */}
                            <motion.div 
                              className="absolute left-0 right-0 h-[1.5px] bg-[#FF1E27]"
                              animate={{ top: ["10%", "90%", "10%"] }}
                              transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                            />
                            <div className="flex justify-between border-b border-neutral-200 dark:border-white/10 pb-1.5 text-[#FF1E27] font-bold">
                              <span>ACTIVE SCOREBOARD</span>
                              <span>ONLINE</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">GAMER_OPTION:</span>
                              <span className="text-neutral-800 dark:text-neutral-200 font-bold">CORRECT_CHOICE</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-neutral-400">ADDED_MULTIPLIER:</span>
                              <span className="text-neutral-700 dark:text-neutral-400">3x SPEED BOOST</span>
                            </div>
                            <div className="flex justify-between text-neutral-700">
                              <span className="text-neutral-500">LEVEL STATUS:</span>
                              <span className="text-green-600 font-bold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                                COMPLETED
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CHAPTER 4 GRAPHIC: Floating Laurel Prize Ticket (Red & White) */}
                      {step.id === "step4" && (
                        <div className="my-auto flex items-center justify-center py-2">
                          <motion.div 
                            className="bg-white dark:bg-neutral-900 border-2 border-dashed border-[#FF1E27] rounded-xl p-4 w-60 text-center relative overflow-hidden shadow-md"
                            animate={{ rotateY: [0, 15, 0, -15, 0], y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                            style={{ perspective: 1000 }}
                          >
                            <div className="absolute top-0 left-0 w-full h-[3px] bg-[#FF1E27]" />
                            <div className="flex justify-between items-center text-[7px] font-mono text-neutral-400 tracking-widest uppercase mb-2">
                              <span>YUTOBIA COMPLETED TICKET</span>
                              <span className="text-[#FF1E27] font-bold">#94021</span>
                            </div>
                            <div className="w-10 h-10 mx-auto bg-[#FF1E27]/5 rounded-full flex items-center justify-center mb-2 border border-[#FF1E27]/20">
                              <Coins className="w-5 h-5 text-[#FF1E27]" />
                            </div>
                            <h4 className="font-serif italic text-neutral-800 dark:text-neutral-200 text-sm">Trivia Demo Companion</h4>
                            <div className="font-mono text-lg font-black text-[#FF1E27] tracking-tighter mt-1">
                              +1,250 PTS
                            </div>
                            <p className="text-[10px] text-[#FF1E27] font-mono uppercase tracking-[0.2em] mt-1 pr-1 pl-1">
                              DEMO ACCLAIMED
                            </p>
                          </motion.div>
                        </div>
                      )}

                      {/* Footer bar */}
                      <div className="flex items-center justify-between border-t border-neutral-200 pt-3">
                        <span className="text-[9px] font-mono text-neutral-400">
                          CHAPTER {step.num} // PROCESS
                        </span>
                        <div className="flex items-center gap-1 text-[9px] font-mono text-neutral-500">
                          <span>DEMO LOOP</span>
                          <ChevronRight className="w-3 h-3 text-[#FF1E27]" />
                        </div>
                      </div>

                    </div>
                  </motion.div>

                </div>
              );
            })}
          </div>

        </div>

        {/* Dynamic Action Trigger at the end of the Story Section */}
        <motion.div 
          className="mt-28 md:mt-40 text-center space-y-6 max-w-xl mx-auto border border-rose-100 dark:border-white/5 bg-neutral-50 dark:bg-neutral-900/60 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-[#FF1E27]/40 transition-all duration-300"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#FF1E27] via-neutral-200 dark:via-white/10 to-[#FF1E27]" />
          <div className="absolute inset-0 bg-[#FF1E27]/[0.015] pointer-events-none" />
          
          <motion.h3 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif italic text-3xl md:text-4xl text-neutral-900 dark:text-white tracking-tight leading-none"
          >
            Ready to test <br />
            <span className="text-[#FF1E27] font-display font-black tracking-tighter uppercase not-italic">your own mind?</span>
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-600 dark:text-neutral-400 text-xs md:text-sm leading-relaxed font-sans font-light"
          >
            A diverse treasury of General Knowledge, Sports, Science, and History challenges backed by high-stakes score multipliers awaits. Leap inside the live interactive simulator gameplay environment.
          </motion.p>
          
          <div className="pt-2 flex justify-center">
            <button
              onClick={onPlayDemo}
              className="group flex items-center gap-3 bg-[#FF1E27] hover:bg-[#C90E16] text-white font-display font-bold py-4 px-8 rounded-xl scale-100 hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-xl shadow-[#FF1E27]/20 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>LAUNCH ENQOQ CASH</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default StoryScrollJourney;

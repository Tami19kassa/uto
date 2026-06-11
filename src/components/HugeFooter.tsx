import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "../lib/gsap";
import { revealWords, drawLine, clipReveal, scrubDrift } from "../lib/scrollAnimations";
import { Reveal } from "./Reveal";
import YutobiaLogo from "./YutobiaLogo";
import { Mail, Phone, MapPin, Send, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SocialAccount } from "../types";
import { SectionBackground } from "./SectionBackground";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  socials?: SocialAccount[];
}

export const HugeFooter: React.FC<FooterProps> = ({ onNavigate, socials }) => {
  const [formData, setFormData] = useState({ name:"", email:"", project:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const footerRef   = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);
  const driftRef    = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const footer = footerRef.current!;
      if (headlineRef.current) revealWords(headlineRef.current, footer);
      if (lineRef.current)     drawLine(lineRef.current, footer);
      if (driftRef.current)    scrubDrift(driftRef.current, 80, true);
    }, footerRef);
    return () => ctx.revert();
  }, []);

  const successRef   = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setLoading(true);

    // Animate the button
    if (submitBtnRef.current) {
      gsap.to(submitBtnRef.current, { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 });
    }

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name:"", email:"", project:"", message:"" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  // Animate success state in
  useEffect(() => {
    if (submitted && successRef.current) {
      gsap.from(successRef.current, {
        scale: 0.92, opacity: 0, duration: 0.45, ease: "yutobia.spring",
      });
    }
  }, [submitted]);

  const socialLinks = [
    { label:"TELEGRAM",    href:"https://t.me/youtobia" },
    { label:"LINKEDIN",    href:"https://linkedin.com/company/youtobia" },
    { label:"TWITTER (X)", href:"https://x.com/youtobia" },
    { label:"INSTAGRAM",   href:"https://instagram.com/youtobia" },
  ];
  const activeSocialLinks = (socials && socials.length > 0)
    ? socials.filter(s => s.isActive).map(s => ({ label: s.label.toUpperCase(), href: s.url }))
    : socialLinks;

  return (
    <footer ref={footerRef} id="connect"
      className="relative py-24 md:py-32 bg-white dark:bg-[#060606] border-t border-rose-100 dark:border-white/8 px-6 md:px-12 overflow-hidden">
      <SectionBackground variant="connect" />
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#FF1E27]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Scrub ghost text */}
      <div ref={driftRef}
        className="absolute -top-4 right-0 font-display font-black text-[18vw] leading-none text-neutral-100/20 dark:text-white/[0.015] whitespace-nowrap select-none pointer-events-none">
        CONNECT
      </div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Animated divider line */}
        <div ref={lineRef} className="w-full h-px bg-brand/20 origin-left" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Left — brand info */}
          <Reveal effect="fade-right" duration={0.7} easing="ease-out-cubic"
            className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <YutobiaLogo size={52} />
              <p className="text-neutral-600 text-sm leading-relaxed max-w-sm font-sans font-light">
                YouTobia Multimedia P.l.C. is a holding company uniting five specialized sub-brands:
                QenaView, eTop Production, YentaBarsiisaa, MirXog, and EnqoqCash — each designed to
                lead its domain of the multimedia landscape.
              </p>
              <div className="space-y-3 pt-4 border-t border-neutral-200 font-mono text-xs text-neutral-500">
                {[
                  { icon:<MapPin className="w-4 h-4 text-brand shrink-0" />, text:"Suite 404, Bole Atlas Road, Addis Ababa" },
                  { icon:<Mail  className="w-4 h-4 text-brand shrink-0" />, text:"hello@youtobiamultimedia.com" },
                  { icon:<Phone className="w-4 h-4 text-brand shrink-0" />, text:"+251 912 34 5678" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">{item.icon}<span>{item.text}</span></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">SOCIAL CORRESPONDENCE</div>
              <div className="flex flex-wrap gap-3">
                {activeSocialLinks.map(sc => (
                  <a key={sc.label} href={sc.href} target="_blank" rel="noreferrer"
                    className="bg-neutral-50 hover:bg-[#FF1E27]/5 border border-neutral-200 hover:border-[#FF1E27]/30 text-neutral-600 hover:text-[#FF1E27] px-3.5 py-2 rounded-lg text-[10px] font-mono tracking-widest transition-all duration-300 flex items-center gap-1 cursor-pointer"
                    onMouseEnter={e => gsap.to(e.currentTarget, { scale:1.05, duration:0.2 })}
                    onMouseLeave={e => gsap.to(e.currentTarget, { scale:1, duration:0.3 })}>
                    <span>{sc.label}</span><ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right — contact form */}
          <Reveal effect="fade-left" delay={0.15} duration={0.7} easing="ease-out-cubic"
            className="lg:col-span-7 bg-[#fafafa] dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 rounded-2xl p-6 md:p-10 relative shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-[50px]" />
            <div className="space-y-2 mb-8">
              <span className="font-mono text-[10px] tracking-widest text-[#FF1E27] font-semibold uppercase">04 / CONTACT PORTAL</span>
              <h3 ref={headlineRef} className="font-serif italic text-3xl text-neutral-900 dark:text-white tracking-tight">Let's Shape Reality Together</h3>
            </div>

            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label:"Your Name", type:"text",  ph:"e.g. Alazar",               key:"name",  required:true },
                    { label:"Email Address", type:"email", ph:"e.g. support@youtobia.com", key:"email", required:true },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">{f.label}</label>
                      <input type={f.type} required={f.required} placeholder={f.ph}
                        value={(formData as any)[f.key]}
                        onChange={e => setFormData({ ...formData, [f.key]: e.target.value })}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-neutral-800 dark:text-white focus:outline-none transition-all font-mono" />
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">Scope Of Request</label>
                  <select value={formData.project}
                    onChange={e => setFormData({ ...formData, project: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3.5 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none transition-all font-mono cursor-pointer">
                    <option value="" disabled>Select category...</option>
                    <option value="Enqoq License">Enqoq Cash Game Integration</option>
                    <option value="Multimedia Ad">Branding & Multimedia Production</option>
                    <option value="Web Strategy">Full-Stack Web/App Development</option>
                    <option value="Other">General Inquiry</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">Core Details</label>
                  <textarea rows={4} placeholder="Describe what we are building..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-neutral-800 dark:text-white focus:outline-none transition-all font-sans" />
                </div>
                <button ref={submitBtnRef} type="submit" disabled={loading}
                  className="w-full bg-[#FF1E27] hover:bg-[#C90E16] disabled:opacity-50 text-white font-display font-medium select-none py-3.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2">
                  {loading
                    ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <><span>TRANSMIT REQUISITION</span><Send className="w-4 h-4" /></>}
                </button>
              </form>
            ) : (
              <div ref={successRef} className="space-y-6 text-center py-10">
                <div className="inline-flex justify-center items-center bg-green-500/15 w-16 h-16 rounded-full border border-green-500/20 mb-2">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h4 className="font-display font-black text-xl text-neutral-900 dark:text-white">COMMUNICATION ENCRYPTED</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
                  Your agency inquiry has been safely lodged in YouTobia's client logs. A creative director will make contact within the business day.
                </p>
              </div>
            )}
          </Reveal>
        </div>

        {/* Bottom strip */}
        <Reveal effect="fade-up" delay={0.1} duration={0.5} easing="ease-out-sine"
          className="pt-12 border-t border-neutral-200 dark:border-white/8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500 font-mono">
          <span>© {new Date().getFullYear()} YouTobia Multimedia. Protected worldwide under local Ethiopian statutes.</span>
          <nav className="flex gap-6">
            {[["HOME","home"],["ENQOQ CASH","enqoq-cash"],["PORTFOLIO","studio"]].map(([label, id]) => (
              <button key={id} onClick={() => onNavigate(id)}
                className="hover:text-[#FF1E27] cursor-pointer transition-colors">{label}</button>
            ))}
          </nav>
        </Reveal>
      </div>
    </footer>
  );
};
export default HugeFooter;

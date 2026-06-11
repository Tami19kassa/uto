import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import YutobiaLogo from "./YutobiaLogo";
import { Mail, Phone, MapPin, Send, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SocialAccount } from "../types";

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  socials?: SocialAccount[];
}

export const HugeFooter: React.FC<FooterProps> = ({ onNavigate, socials }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    project: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", project: "", message: "" });
      setTimeout(() => setSubmitted(false), 5000);
    }, 1200);
  };

  const socialLinks = [
    { label: "TELEGRAM", href: "https://t.me/youtobia" },
    { label: "LINKEDIN", href: "https://linkedin.com/company/youtobia" },
    { label: "TWITTER (X)", href: "https://x.com/youtobia" },
    { label: "INSTAGRAM", href: "https://instagram.com/youtobia" }
  ];

  const activeSocialLinks = (socials && socials.length > 0)
    ? socials.filter(s => s.isActive).map(s => ({ label: s.label.toUpperCase(), href: s.url }))
    : socialLinks;

  return (
    <footer id="connect" className="relative py-24 md:py-32 bg-white border-t border-rose-100 px-6 md:px-12 overflow-hidden">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#FF1E27]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Contact Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* LEFT COLUMN: Agency Narrative & Bio */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <YutobiaLogo size={52} />
              
              <p className="text-neutral-600 text-sm leading-relaxed max-w-sm font-sans font-light">
                YouTobia Multimedia is architectural digital craft. 
                We are a creative agency, development firm, and content design production studio based out of Addis Ababa, Ethiopia.
              </p>

              <div className="space-y-3 pt-4 border-t border-neutral-200 font-mono text-xs text-neutral-500">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-brand shrink-0" />
                  <span>Suite 404, Bole Atlas Road, Addis Ababa</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-brand shrink-0" />
                  <span>hello@youtobiamultimedia.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-brand shrink-0" />
                  <span>+251 912 34 5678</span>
                </div>
              </div>
            </div>

            {/* Social box grid */}
            <div className="space-y-4">
              <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                SOCIAL CORRESPONDENCE
              </div>
              <div className="flex flex-wrap gap-3">
                {activeSocialLinks.map((sc) => (
                  <a
                    key={sc.label}
                    href={sc.href}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-neutral-50 hover:bg-[#FF1E27]/5 border border-neutral-200 hover:border-[#FF1E27]/30 text-neutral-600 hover:text-[#FF1E27] px-3.5 py-2 rounded-lg text-[10px] font-mono tracking-widest transition-all duration-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{sc.label}</span>
                    <ArrowUpRight className="w-3 h-3 text-neutral-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Full Stateful Interactive Form block */}
          <div className="lg:col-span-7 bg-[#fafafa] border border-neutral-200 rounded-2xl p-6 md:p-10 relative shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-[50px]" />
            
            <div className="space-y-2 mb-8">
              <span className="font-mono text-[10px] tracking-widest text-[#FF1E27] font-semibold uppercase">
                04 / CONTACT PORTAL
              </span>
              <h3 className="font-serif italic text-3xl text-neutral-900 tracking-tight">
                Let's Shape Reality Together
              </h3>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="contact-form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alazar"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white hover:bg-neutral-50/50 focus:bg-white border border-neutral-350 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-[#FF1E27] transition-all duration-300 font-mono shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. support@youtobia.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white hover:bg-neutral-50/50 focus:bg-white border border-neutral-350 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-[#FF1E27] transition-all duration-300 font-mono shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                      Scope Of Request (Project interest)
                    </label>
                    <select
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      className="w-full bg-white hover:bg-neutral-50/50 focus:bg-white border border-neutral-355 focus:border-[#FF1E27] rounded-xl px-4 py-3.5 text-sm text-neutral-700 focus:outline-[#FF1E27] transition-all duration-300 font-mono cursor-pointer shadow-2xs"
                    >
                      <option value="" disabled className="bg-white text-neutral-400">Select category...</option>
                      <option value="Enqoq License" className="bg-white text-neutral-800">Enqoq Cash Game Integration</option>
                      <option value="Multimedia Ad" className="bg-white text-neutral-800">Branding & Multimedia Production</option>
                      <option value="Web Strategy" className="bg-white text-neutral-800">Full-Stack Web/App Development</option>
                      <option value="Other" className="bg-white text-neutral-800">General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
                      Core Details on your goal
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Describe what we are building..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white hover:bg-neutral-50/50 focus:bg-white border border-neutral-350 focus:border-[#FF1E27] rounded-xl px-4 py-3 text-sm text-neutral-800 focus:outline-[#FF1E27] transition-all duration-300 font-sans shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#FF1E27] hover:bg-[#C90E16] disabled:opacity-50 text-white font-display font-medium select-none py-3.5 rounded-xl cursor-pointer transition-all duration-300 flex items-center justify-center gap-2"
                    id="connect-submit"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>TRANSMIT REQUISITION</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="submission-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6 text-center py-10"
                >
                  <div className="inline-flex justify-center items-center bg-green-500/15 w-16 h-16 rounded-full border border-green-500/20 mb-2">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h4 className="font-display font-black text-xl text-neutral-900">COMMUNICATION ENCRYPTED</h4>
                  <p className="text-sm text-neutral-500 max-w-sm mx-auto">
                    Your agency inquiry has been safely lodged in YouTobia’s client logs. A creative director will make contact within the business day.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom grid footer details */}
        <div className="pt-12 border-t border-neutral-200 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500 font-mono">
          <span>© {new Date().getFullYear()} YouTobia Multimedia. Protected worldwide under local Ethiopian statutes.</span>
          <nav className="flex gap-6">
            <button onClick={() => onNavigate("home")} className="hover:text-[#FF1E27] cursor-pointer">HOME</button>
            <button onClick={() => onNavigate("enqoq-cash")} className="hover:text-[#FF1E27] cursor-pointer">ENQOQ CASH</button>
            <button onClick={() => onNavigate("studio")} className="hover:text-[#FF1E27] cursor-pointer">PORTFOLIO</button>
          </nav>
        </div>

      </div>
    </footer>
  );
};
export default HugeFooter;

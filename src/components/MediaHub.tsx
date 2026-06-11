import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import { gsap } from "../lib/gsap";
import { BookOpen, Tv, Search, X, Play, Pause, Clock, User, ThumbsUp, Globe } from "lucide-react";
import { SectionBackground } from "./SectionBackground";
import { MediaItem } from "../types";

interface MediaHubProps { items: MediaItem[]; onLike: (id: string) => void; }

export const MediaHub: React.FC<MediaHubProps> = ({ items, onLike }) => {
  const [activeTab, setActiveTab]     = useState<"all"|"blog"|"vlog">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlog, setSelectedBlog] = useState<MediaItem|null>(null);
  const [selectedVlog, setSelectedVlog] = useState<MediaItem|null>(null);
  const [vlogPlaying, setVlogPlaying]   = useState(false);
  const sectionRef  = useRef<HTMLElement>(null);
  const gridRef     = useRef<HTMLDivElement>(null);
  const blogModal   = useRef<HTMLDivElement>(null);
  const vlogModal   = useRef<HTMLDivElement>(null);
  const blogInner   = useRef<HTMLDivElement>(null);
  const vlogInner   = useRef<HTMLDivElement>(null);

  const filteredItems = items.filter(item => {
    const matchesTab    = activeTab === "all" || item.type === activeTab;
    const q             = searchQuery.toLowerCase();
    const matchesSearch = !q || item.title.toLowerCase().includes(q)
      || item.author.toLowerCase().includes(q)
      || item.excerpt.toLowerCase().includes(q)
      || item.tags.some(t => t.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  // Animate cards when filter changes
  useLayoutEffect(() => {
    const cards = gridRef.current?.querySelectorAll("article");
    if (!cards || !cards.length) return;
    gsap.from(cards, {
      opacity: 0, y: 25, scale: 0.97, duration: 0.5,
      ease: "yutobia.enter", stagger: 0.07,
    });
  }, [activeTab, searchQuery, items.length]);

  // Blog modal
  useEffect(() => {
    const overlay = blogModal.current;
    const inner   = blogInner.current;
    if (!overlay || !inner) return;
    if (selectedBlog) {
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(inner, { scale: 0.95, y: 30 }, { scale: 1, y: 0, duration: 0.4, ease: "yutobia.enter" });
    } else {
      gsap.to(overlay, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }
  }, [selectedBlog]);

  // Vlog modal
  useEffect(() => {
    const overlay = vlogModal.current;
    const inner   = vlogInner.current;
    if (!overlay || !inner) return;
    if (selectedVlog) {
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
      gsap.fromTo(inner, { scale: 0.95, y: 30 }, { scale: 1, y: 0, duration: 0.4, ease: "yutobia.enter" });
    } else {
      gsap.to(overlay, {
        opacity: 0, duration: 0.25, ease: "power2.in",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }
  }, [selectedVlog]);

  return (
    <section ref={sectionRef} id="media-hub"
      className="relative py-24 md:py-32 bg-white dark:bg-[#060606] border-t border-rose-100 dark:border-white/8 px-6 md:px-12 overflow-hidden">
      <SectionBackground variant="media" />
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[#FF1E27]/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">

        {/* Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-neutral-200 pb-12">
          <div className="lg:col-span-7 space-y-4">
            <span className="font-mono text-xs tracking-widest text-[#FF1E27] font-semibold uppercase">
              04 / CULTURAL JOURNAL & RADIAL STREAMS
            </span>
            <h2 className="font-serif italic text-4xl sm:text-6xl text-neutral-900 dark:text-white tracking-tight leading-none">
              Stories, Lores & <br />
              <span className="text-[#FF1E27] font-display font-black tracking-tighter uppercase not-italic">Broadcast Waves</span>.
            </h2>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 p-4 rounded-2xl">
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl border border-neutral-200 dark:border-white/8 self-start">
            {(["all","blog","vlog"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab ? "bg-[#FF1E27] text-white shadow-xs" : "text-neutral-500 dark:text-neutral-400"
                }`}>
                {tab === "blog" && <BookOpen className="w-3.5 h-3.5" />}
                {tab === "vlog" && <Tv className="w-3.5 h-3.5" />}
                {tab === "all" ? "ALL BROADCASTS" : tab === "blog" ? "EDITORIAL BLOGS" : "CULTURAL VLOGS"}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <input type="text" placeholder="Search lore, authors, or tags..."
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-xl px-11 py-3 text-sm text-neutral-800 focus:outline-none focus:border-[#FF1E27]/50 transition-all font-mono" />
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        {filteredItems.length === 0 ? (
          <div className="border border-neutral-200 bg-neutral-50 rounded-2xl p-16 text-center space-y-4">
            <div className="text-neutral-400 text-sm font-mono uppercase tracking-widest font-bold">No Records Uncovered</div>
            <button onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
              className="text-xs text-[#FF1E27] font-semibold hover:underline cursor-pointer">RESET FILTERS</button>
          </div>
        ) : (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredItems.map(item => (
              <article key={item.id}
                className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-950 p-6 md:p-8 flex flex-col justify-between hover:border-[#FF1E27]/30 transition-all duration-500 hover:shadow-lg group h-[380px]"
                onMouseEnter={e => gsap.to(e.currentTarget, { y: -4, duration: 0.3, ease: "power2.out" })}
                onMouseLeave={e => gsap.to(e.currentTarget, { y: 0,  duration: 0.5, ease: "elastic.out(1,0.4)" })}>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-[10px] tracking-widest text-[#FF1E27] font-bold bg-[#FF1E27]/10 border border-[#FF1E27]/20 rounded px-2.5 py-1">
                      {item.category}
                    </span>
                    <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px]">
                      <Clock className="w-3.5 h-3.5" /><span>{item.duration}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-serif italic text-2xl md:text-3xl text-neutral-800 dark:text-white leading-tight tracking-tight hover:text-[#FF1E27] transition-colors cursor-pointer"
                      onClick={() => item.type === "blog" ? setSelectedBlog(item) : setSelectedVlog(item)}>
                      {item.title}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-300 text-xs sm:text-sm line-clamp-3 leading-relaxed font-sans font-light">{item.excerpt}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-neutral-200 dark:border-white/8 pt-6 mt-6">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-neutral-500" />
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 tracking-wider">
                      {item.author} — <span className="opacity-60">{item.date}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={() => onLike(item.id)}
                      className="flex items-center gap-1.5 text-neutral-400 hover:text-[#FF1E27] font-mono text-[11px] transition-colors cursor-pointer"
                      onMouseEnter={e => gsap.to(e.currentTarget.querySelector("svg"), { scale:1.3, duration:0.2 })}
                      onMouseLeave={e => gsap.to(e.currentTarget.querySelector("svg"), { scale:1, duration:0.3 })}>
                      <ThumbsUp className="w-3.5 h-3.5" /><span>{item.likes}</span>
                    </button>
                    <button onClick={() => item.type === "blog" ? setSelectedBlog(item) : setSelectedVlog(item)}
                      className="flex items-center gap-1.5 bg-neutral-100 hover:bg-[#FF1E27] hover:text-white text-neutral-700 text-[11px] font-mono tracking-widest px-3 py-1.5 rounded-lg border border-neutral-200 cursor-pointer transition-all hover:scale-105">
                      {item.type === "blog"
                        ? <><span>READ LORE</span><BookOpen className="w-3.5 h-3.5" /></>
                        : <><span>WATCH STREAM</span><Play className="w-3 h-3 fill-current" /></>}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Blog modal */}
      <div ref={blogModal}
        className="fixed inset-0 z-50 items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        style={{ display: "none" }}
        onClick={() => setSelectedBlog(null)}>
        <div ref={blogInner}
          className="w-full max-w-3xl bg-white border border-neutral-200 rounded-2xl overflow-hidden max-h-[85vh] flex flex-col relative shadow-2xl"
          onClick={e => e.stopPropagation()}>
          <div className="absolute top-0 left-0 w-full h-[6px] bg-[#FF1E27]" />
          <div className="p-6 md:p-8 border-b border-neutral-100 flex items-start justify-between bg-[#fafafa]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-mono text-[9px] tracking-widest text-[#FF1E27] font-bold bg-[#FF1E27]/15 px-2 py-0.5 rounded border border-[#FF1E27]/25">{selectedBlog?.category}</span>
                <span className="text-neutral-400 font-mono text-[9px]">{selectedBlog?.duration}</span>
                <span className="text-neutral-400 font-mono text-[9px]">{selectedBlog?.date}</span>
              </div>
              <h3 className="font-serif italic text-3xl md:text-4xl text-neutral-900 tracking-tight leading-tight">{selectedBlog?.title}</h3>
              <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-xs">
                <Globe className="w-3.5 h-3.5 text-brand" /><span>BY {selectedBlog?.author.toUpperCase()}</span>
              </div>
            </div>
            <button onClick={() => setSelectedBlog(null)}
              className="p-2 text-neutral-500 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
            {selectedBlog?.content.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm sm:text-base font-light text-neutral-700">{para}</p>
            ))}
            <div className="pt-8 border-t border-neutral-200 flex flex-wrap gap-2">
              {selectedBlog?.tags.map((tag, idx) => (
                <span key={idx} className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded">#{tag}</span>
              ))}
            </div>
          </div>
          <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center px-6 font-mono text-[11px] text-neutral-400">
            <button onClick={() => selectedBlog && onLike(selectedBlog.id)}
              className="flex items-center gap-2 text-neutral-500 hover:text-[#FF1E27] transition-colors cursor-pointer">
              <ThumbsUp className="w-4 h-4" /><span>Recommend ({selectedBlog?.likes})</span>
            </button>
            <span>YUTOBIA REVELATION CHANNELS</span>
          </div>
        </div>
      </div>

      {/* Vlog modal */}
      <div ref={vlogModal}
        className="fixed inset-0 z-50 items-center justify-center p-4 bg-black/95 backdrop-blur-md"
        style={{ display: "none" }}
        onClick={() => { setSelectedVlog(null); setVlogPlaying(false); }}>
        <div ref={vlogInner}
          className="w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl"
          onClick={e => e.stopPropagation()}>
          <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-[#FF1E27]/5">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#FF1E27] animate-pulse" />
              <span className="font-mono text-[10px] tracking-widest text-[#FF1E27] font-semibold uppercase">{selectedVlog?.category}</span>
              <span className="text-white text-xs sm:text-sm font-sans font-medium line-clamp-1">{selectedVlog?.title}</span>
            </div>
            <button onClick={() => { setSelectedVlog(null); setVlogPlaying(false); }}
              className="p-2 text-white/50 hover:text-white bg-white/5 border border-white/5 rounded-lg cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
            {vlogPlaying ? (
              <div className="absolute inset-0 w-full h-full">
                {selectedVlog?.videoUrl?.includes("youtube") || selectedVlog?.videoUrl?.includes("embed") ? (
                  <iframe className="w-full h-full bg-black border-0"
                    src={`${selectedVlog.videoUrl}${selectedVlog.videoUrl.includes("?") ? "&" : "?"}autoplay=1`}
                    title={selectedVlog.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen />
                ) : (
                  <video autoPlay controls playsInline className="w-full h-full object-contain"
                    src={selectedVlog?.videoUrl || "https://cdn.pixabay.com/video/2021/04/12/70860-537333552_large.mp4"} />
                )}
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center space-y-6 cursor-pointer z-10 bg-black/60"
                onClick={() => setVlogPlaying(true)}>
                <div className="w-20 h-20 bg-[#FF1E27] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#FF1E27]/30 border border-white/20"
                  onMouseEnter={e => gsap.to(e.currentTarget, { scale:1.1, duration:0.2 })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { scale:1, duration:0.3, ease:"elastic.out(1,0.5)" })}>
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif italic text-white text-xl">{selectedVlog?.title}</h4>
                  <p className="text-white/40 font-mono text-xs uppercase tracking-widest">BY {selectedVlog?.author}</p>
                </div>
              </div>
            )}
          </div>
          <div className="p-6 bg-neutral-950 border-t border-white/5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-2">
              <p className="text-xs text-white/70 leading-relaxed font-sans font-light">{selectedVlog?.excerpt}</p>
            </div>
            <div className="md:col-span-4 flex justify-end gap-3">
              <button onClick={() => setVlogPlaying(v => !v)}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs px-4 py-3 rounded-xl transition-all cursor-pointer">
                {vlogPlaying ? <><Pause className="w-3.5 h-3.5" /><span>Pause</span></> : <><Play className="w-3.5 h-3.5" /><span>Play</span></>}
              </button>
              <button onClick={() => selectedVlog && onLike(selectedVlog.id)}
                className="flex items-center gap-2 bg-[#FF1E27] hover:bg-[#C90E16] text-white font-mono text-xs px-4 py-3 rounded-xl transition-all cursor-pointer font-bold">
                <ThumbsUp className="w-3.5 h-3.5" /><span>Upvote ({selectedVlog?.likes})</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default MediaHub;

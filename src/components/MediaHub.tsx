import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Tv, 
  Search, 
  X, 
  Play, 
  Pause, 
  Clock, 
  User, 
  ThumbsUp, 
  Globe
} from "lucide-react";
import { MediaItem } from "../types";

interface MediaHubProps {
  items: MediaItem[];
  onLike: (id: string) => void;
}

export const MediaHub: React.FC<MediaHubProps> = ({ items, onLike }) => {
  const [activeTab, setActiveTab] = useState<"all" | "blog" | "vlog">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state for viewing
  const [selectedBlog, setSelectedBlog] = useState<MediaItem | null>(null);
  const [selectedVlog, setSelectedVlog] = useState<MediaItem | null>(null);
  const [vlogPlaying, setVlogPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(35); // simulated progress line

  // Filter & Search logic
  const filteredItems = items.filter(item => {
    const matchesTab = activeTab === "all" || item.type === activeTab;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  // Simulated media player loop if fallback
  useEffect(() => {
    let interval: any;
    if (vlogPlaying) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 600);
    }
    return () => clearInterval(interval);
  }, [vlogPlaying]);

  return (
    <section id="media-hub" className="relative py-24 md:py-32 bg-white/88 dark:bg-[#060606]/88 border-t border-rose-100 px-6 md:px-12 overflow-hidden">
      {/* Decorative backdrop elements */}
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-[#FF1E27]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-96 h-96 bg-brand-orange/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Typographic Heading Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-neutral-200 pb-12">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-widest text-[#FF1E27] font-semibold uppercase">
                04 / CULTURAL JOURNAL & RADIAL STREAMS
              </span>
            </div>
            <h2 className="font-serif italic text-4xl sm:text-6xl text-neutral-900 tracking-tight leading-none">
              Stories, Lores & <br />
              <span className="text-[#FF1E27] font-display font-black tracking-tighter uppercase not-italic">Broadcast Waves</span>.
            </h2>
          </div>
          <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4 justify-end">
          </div>
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-neutral-50 border border-neutral-200 p-4 rounded-2xl">
          {/* Tabs */}
          <div className="flex bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-start">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all cursor-pointer ${
                activeTab === "all" 
                  ? "bg-[#FF1E27] text-white shadow-xs" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              ALL BROADCASTS
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "blog" 
                  ? "bg-[#FF1E27] text-white shadow-xs" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              EDITORIAL BLOGS
            </button>
            <button
              onClick={() => setActiveTab("vlog")}
              className={`px-4 py-2.5 rounded-lg text-xs font-mono tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "vlog" 
                  ? "bg-[#FF1E27] text-white shadow-xs" 
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>CULTURAL VLOGS</span>
              {activeTab === "vlog" && (
                <div className="flex items-end gap-[1.5px] h-3 w-2.5 pb-0.5">
                  <motion.span animate={{ height: [3, 9, 3] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[1px] bg-white rounded-full" />
                  <motion.span animate={{ height: [7, 3, 10, 7] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }} className="w-[1px] bg-white rounded-full" />
                  <motion.span animate={{ height: [2, 6, 2] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }} className="w-[1px] bg-white rounded-full" />
                </div>
              )}
            </button>
          </div>

          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search lore, authors, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-neutral-300 rounded-xl px-11 py-3 text-sm text-neutral-800 focus:outline-none focus:border-[#FF1E27]/50 focus:bg-white transition-all font-mono"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-800 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Media Grid */}
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="border border-neutral-200 bg-neutral-50 rounded-2xl p-16 text-center space-y-4"
            >
              <div className="text-neutral-400 text-sm font-mono uppercase tracking-widest font-bold">No Records Uncovered</div>
              <p className="text-neutral-500 text-xs max-w-sm mx-auto font-sans font-light">
                No matching logs or broadcasts fit your query: "{searchQuery}".
              </p>
              <button
                onClick={() => { setSearchQuery(""); setActiveTab("all"); }}
                className="text-xs text-[#FF1E27] font-semibold hover:underline cursor-pointer"
              >
                RESET FILTERS
              </button>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
            >
              {filteredItems.map((item) => (
                <motion.article
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.98, y: 15 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 15 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 md:p-8 flex flex-col justify-between hover:border-[#FF1E27]/30 transition-all duration-500 hover:shadow-lg group h-[380px]"
                >
                  {/* Category, Read/watch duration, Action badges */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="font-mono text-[10px] tracking-widest text-[#FF1E27] font-bold bg-[#FF1E27]/10 border border-[#FF1E27]/20 rounded px-2.5 py-1">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10px]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    {/* Headline and text */}
                    <div className="space-y-3">
                      <h3 className="font-serif italic text-2xl md:text-3xl text-neutral-800 leading-tight tracking-tight hover:text-[#FF1E27] transition-colors cursor-pointer"
                          onClick={() => item.type === "blog" ? setSelectedBlog(item) : setSelectedVlog(item)}>
                        {item.title}
                      </h3>
                      <p className="text-neutral-500 text-xs sm:text-sm line-clamp-3 leading-relaxed font-sans font-light">
                        {item.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Card bottom tray */}
                  <div className="flex items-center justify-between border-t border-neutral-200 pt-6 mt-6">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-neutral-500" />
                      </div>
                      <span className="font-mono text-[10px] text-neutral-500 tracking-wider">
                        {item.author} — <span className="opacity-60">{item.date}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Likes trigger */}
                      <button 
                        onClick={() => onLike(item.id)}
                        className="flex items-center gap-1.5 text-neutral-400 hover:text-[#FF1E27] font-mono text-[11px] transition-colors group/like cursor-pointer"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 group-hover/like:scale-125 transition-transform" />
                        <span>{item.likes}</span>
                      </button>

                      {/* Interactive visual button with real-time responsive equalizers on hover */}
                      <button
                        onClick={() => item.type === "blog" ? setSelectedBlog(item) : setSelectedVlog(item)}
                        className="flex items-center gap-1.5 bg-neutral-100 hover:bg-[#FF1E27] hover:text-white text-neutral-700 text-[11px] font-mono tracking-widest px-3 py-1.5 rounded-lg border border-neutral-200 cursor-pointer transition-all hover:scale-105 group/btn"
                      >
                        {item.type === "blog" ? (
                          <>
                            <span>READ LORE</span>
                            <BookOpen className="w-3.5 h-3.5 text-neutral-500 group-hover/btn:text-white" />
                          </>
                        ) : (
                          <>
                            <div className="flex items-end gap-[1px] h-2.5 w-2 pb-0.5 mr-0.5 group-hover/btn:flex hidden">
                              <motion.span animate={{ height: [2, 7, 2] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[1.5px] bg-white rounded-full" />
                              <motion.span animate={{ height: [6, 2, 8, 6] }} transition={{ repeat: Infinity, duration: 0.7, delay: 0.1 }} className="w-[1.5px] bg-white rounded-full" />
                              <motion.span animate={{ height: [1, 5, 1] }} transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }} className="w-[1.5px] bg-white rounded-full" />
                            </div>
                            <span>WATCH STREAM</span>
                            <Play className="w-3 h-3 text-neutral-500 fill-neutral-500 group-hover/btn:fill-white group-hover/btn:text-white" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* MODAL 1: BLOG READER MODAL */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedBlog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-3xl bg-white border border-neutral-200 rounded-2xl overflow-hidden max-h-[85vh] flex flex-col relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Cover layout background */}
              <div className="absolute top-0 left-0 w-full h-[6px] bg-[#FF1E27]" />
              
              {/* Header */}
              <div className="p-6 md:p-8 border-b border-neutral-100 flex items-start justify-between bg-[#fafafa]">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[9px] tracking-widest text-[#FF1E27] font-bold bg-[#FF1E27]/15 px-2 py-0.5 rounded border border-[#FF1E27]/25">
                      {selectedBlog.category}
                    </span>
                    <span className="text-neutral-400 font-mono text-[9px]">
                      {selectedBlog.duration}
                    </span>
                    <span className="text-neutral-400 font-mono text-[9px]">
                      {selectedBlog.date}
                    </span>
                  </div>
                  <h3 className="font-serif italic text-3xl md:text-4xl text-neutral-900 tracking-tight leading-tight">
                    {selectedBlog.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-xs">
                    <Globe className="w-3.5 h-3.5 text-brand" />
                    <span>BY {selectedBlog.author.toUpperCase()}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="p-2 text-neutral-500 hover:text-neutral-950 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable text body */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1 text-neutral-800 leading-relaxed font-sans max-w-none">
                {selectedBlog.content.split("\n\n").map((para, i) => (
                  <p key={i} className="text-sm sm:text-base font-light text-neutral-700">
                    {para}
                  </p>
                ))}

                {/* Sub tags footer */}
                <div className="pt-8 border-t border-neutral-200 flex flex-wrap gap-2">
                  {selectedBlog.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer details container */}
              <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex justify-between items-center px-6 font-mono text-[11px] text-neutral-400">
                <button
                  onClick={() => onLike(selectedBlog.id)}
                  className="flex items-center gap-2 text-neutral-500 hover:text-[#FF1E27] transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Recommend ({selectedBlog.likes})</span>
                </button>
                <span>YUTOBIA REVELATION CHANNELS</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL 2: VLOG STREAMER MODAL */}
      <AnimatePresence>
        {selectedVlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => { setSelectedVlog(null); setVlogPlaying(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              className="w-full max-w-4xl bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Title Header */}
              <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-[#FF1E27]/5">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF1E27] animate-pulse" />
                  <span className="font-mono text-[10px] tracking-widest text-[#FF1E27] font-semibold uppercase">{selectedVlog.category}</span>
                  <span className="hidden sm:inline text-white/30 text-[10px] font-mono">|</span>
                  <span className="text-white text-xs sm:text-sm font-sans font-medium line-clamp-1">{selectedVlog.title}</span>
                </div>
                <button
                  onClick={() => { setSelectedVlog(null); setVlogPlaying(false); }}
                  className="p-2 text-white/50 hover:text-white bg-white/5 border border-white/5 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Theater Screen Play area */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 to-black select-none pointer-events-none" />
                
                {/* Embedded Video Player */}
                {vlogPlaying ? (
                  <div className="absolute inset-0 w-full h-full">
                    {selectedVlog.videoUrl && selectedVlog.videoUrl.indexOf("youtube.com") > -1 || (selectedVlog.videoUrl && selectedVlog.videoUrl.indexOf("embed") > -1) ? (
                      <iframe
                        className="w-full h-full bg-black border-0"
                        src={`${selectedVlog.videoUrl.indexOf("?") > -1 ? selectedVlog.videoUrl + "&autoplay=1" : selectedVlog.videoUrl + "?autoplay=1"}`}
                        title={selectedVlog.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      // Raw streaming video fallback
                      <video
                        autoPlay
                        controls
                        playsInline
                        className="w-full h-full object-contain"
                        src={selectedVlog.videoUrl || "https://cdn.pixabay.com/video/2021/04/12/70860-537333552_large.mp4"}
                      />
                    )}
                  </div>
                ) : (
                  // Cover screen with giant play button
                  <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center space-y-6 select-none cursor-pointer z-10 bg-black/60"
                       onClick={() => setVlogPlaying(true)}>
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className="w-20 h-20 bg-[#FF1E27] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#FF1E27]/30 border border-white/20"
                    >
                      <Play className="w-8 h-8 fill-white translate-x-0.5" />
                    </motion.div>
                    <div className="space-y-1">
                      <h4 className="font-serif italic text-white text-xl">{selectedVlog.title}</h4>
                      <p className="text-white/40 font-mono text-xs uppercase tracking-widest">STREAM DURATION: {selectedVlog.duration} // BY {selectedVlog.author}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Vlog info & controls */}
              <div className="p-6 bg-neutral-950 border-t border-white/5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-white/40">{selectedVlog.date}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                    <span className="text-xs text-white/50 font-mono font-medium">Category: {selectedVlog.category}</span>
                  </div>
                  <p className="text-xs text-white/70 leading-relaxed font-sans font-light">
                    {selectedVlog.excerpt}
                  </p>
                </div>
                <div className="md:col-span-4 flex justify-end gap-3">
                  <button 
                    onClick={() => setVlogPlaying(!vlogPlaying)}
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs px-4 py-3 rounded-xl transition-all cursor-pointer"
                  >
                    {vlogPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>Mute Feed</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5" />
                        <span>Resync Play</span>
                      </>
                    )}
                  </button>
                  <button 
                    onClick={() => onLike(selectedVlog.id)}
                    className="flex items-center gap-2 bg-[#FF1E27] hover:bg-[#C90E16] text-white font-mono text-xs px-4 py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-brand/10 font-bold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Upvote ({selectedVlog.likes})</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
export default MediaHub;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Film, 
  Tv, 
  BookOpen, 
  Share2, 
  CheckCircle, 
  X, 
  Plus, 
  Trash2, 
  Settings, 
  Layout, 
  Heart,
  Eye,
  EyeOff,
  Sparkles,
  Link2,
  ArrowUpRight,
  PlusCircle
} from "lucide-react";
import { 
  fetchMediaItems, 
  submitMediaItem, 
  removeMediaItem,
  fetchSocialAccounts, 
  updateSocialAccountList, 
  fetchHeroVideoUrl, 
  saveHeroVideoUrl 
} from "../lib/supabase";
import { MediaItem, SocialAccount } from "../types";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, onSettingsUpdated }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState("");
  const [activeSubTab, setActiveSubTab] = useState<"hero" | "media" | "social">("hero");

  // Hero Video state
  const [heroVideoInput, setHeroVideoInput] = useState("");
  const [heroSuccessMsg, setHeroSuccessMsg] = useState("");

  // Live arrays loaded from database service
  const [blogsList, setBlogsList] = useState<MediaItem[]>([]);
  const [vlogsList, setVlogsList] = useState<MediaItem[]>([]);
  const [socialsList, setSocialsList] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Form State under Admin Create
  const [mediaType, setMediaType] = useState<"blog" | "vlog">("blog");
  const [mediaTitle, setMediaTitle] = useState("");
  const [mediaAuthor, setMediaAuthor] = useState("");
  const [mediaCategory, setMediaCategory] = useState("LORE ANALYSIS");
  const [mediaDuration, setMediaDuration] = useState("");
  const [mediaExcerpt, setMediaExcerpt] = useState("");
  const [mediaContent, setMediaContent] = useState("");
  const [mediaVideoUrl, setMediaVideoUrl] = useState("");
  const [mediaTags, setMediaTags] = useState("");
  const [mediaError, setMediaError] = useState("");
  const [mediaSuccess, setMediaSuccess] = useState("");

  // New Social form
  const [newSocialPlatform, setNewSocialPlatform] = useState<"Youtube" | "Telegram" | "Facebook" | "Twitter" | "Instagram" | "LinkedIn" | "TikTok">("Telegram");
  const [newSocialLabel, setNewSocialLabel] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  // Load configuration on panel open
  useEffect(() => {
    if (isOpen) {
      refreshAllData();
    }
  }, [isOpen]);

  const refreshAllData = async () => {
    setIsLoading(true);
    try {
      const media = await fetchMediaItems();
      setBlogsList(media.filter(m => m.type === "blog"));
      setVlogsList(media.filter(m => m.type === "vlog"));

      const socials = await fetchSocialAccounts();
      setSocialsList(socials);

      const video = await fetchHeroVideoUrl();
      setHeroVideoInput(video);
    } catch (e) {
      console.error("Error refreshing portfolio controls", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123" || password === "youtobia2026") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Access code invalid. Please try again.");
    }
  };

  // Save customized Hero video URL
  const handleSaveVideoUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroVideoInput.trim()) return;
    
    await saveHeroVideoUrl(heroVideoInput.trim());
    setHeroSuccessMsg("Background video updated successfully.");
    setTimeout(() => {
      setHeroSuccessMsg("");
      if (onSettingsUpdated) onSettingsUpdated();
    }, 2000);
  };

  // Add a new blog or vlog article to state
  const handlePublishMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setMediaError("");
    setMediaSuccess("");

    if (!mediaTitle || !mediaAuthor || !mediaExcerpt || !mediaContent) {
      setMediaError("Required parameters missing. Complete Title, Author, Excerpt, and Article Body.");
      return;
    }

    const calculatedDuration = mediaDuration 
      ? mediaDuration 
      : (mediaType === "blog" ? "4 min read" : "6 min watch");

    const processedTags = mediaTags 
      ? mediaTags.split(",").map(t => t.trim()).filter(Boolean)
      : [mediaCategory, mediaType.toUpperCase()];

    const gradientOptions = [
      "from-neutral-900 via-neutral-900 to-neutral-950",
      "from-red-950 via-neutral-900 to-black",
      "from-neutral-900 via-red-950/40 to-neutral-900",
      "from-black via-red-950/30 to-black"
    ];
    const pickedGradient = gradientOptions[Math.floor(Math.random() * gradientOptions.length)];

    const newItem: MediaItem = {
      id: Date.now().toString(),
      type: mediaType,
      title: mediaTitle,
      author: mediaAuthor,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      duration: calculatedDuration,
      category: mediaCategory.toUpperCase(),
      excerpt: mediaExcerpt,
      content: mediaContent,
      videoUrl: mediaType === "vlog" ? (mediaVideoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ") : undefined,
      likes: 0,
      tags: processedTags,
      gradientTheme: pickedGradient
    };

    const done = await submitMediaItem(newItem);
    if (done) {
      setMediaSuccess(`"${mediaTitle}" published of successfully.`);
      
      // Reset input fields
      setMediaTitle("");
      setMediaAuthor("");
      setMediaExcerpt("");
      setMediaContent("");
      setMediaVideoUrl("");
      setMediaTags("");
      
      // Reload lists
      refreshAllData();
      if (onSettingsUpdated) onSettingsUpdated();
    } else {
      setMediaError("Action failed. Verification credentials might be missing.");
    }
  };

  // Delete media item
  const handleDeleteMedia = async (id: string) => {
    if (window.confirm("Verify: delete this portfolio item permanently?")) {
      await removeMediaItem(id);
      refreshAllData();
      if (onSettingsUpdated) onSettingsUpdated();
    }
  };

  // Add new Social Media account
  const handleAddNewSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocialLabel || !newSocialUrl) return;

    const newAcc: SocialAccount = {
      id: "soc-" + Date.now().toString(),
      platform: newSocialPlatform,
      label: newSocialLabel,
      url: newSocialUrl,
      isActive: true
    };

    const updatedSocials = [...socialsList, newAcc];
    await updateSocialAccountList(updatedSocials);
    
    setNewSocialLabel("");
    setNewSocialUrl("");
    refreshAllData();
    if (onSettingsUpdated) onSettingsUpdated();
  };

  // Delete a social media link
  const handleDeleteSocial = async (id: string) => {
    const updated = socialsList.filter(s => s.id !== id);
    await updateSocialAccountList(updated);
    refreshAllData();
    if (onSettingsUpdated) onSettingsUpdated();
  };

  // Toggle active social link status
  const handleToggleSocialActive = async (id: string) => {
    const updated = socialsList.map(s => {
      if (s.id === id) {
        return { ...s, isActive: !s.isActive };
      }
      return s;
    });
    await updateSocialAccountList(updated);
    refreshAllData();
    if (onSettingsUpdated) onSettingsUpdated();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
        >
          {/* Main Modal container */}
          <motion.div
            initial={{ scale: 0.97, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: 30 }}
            transition={{ type: "spring", damping: 28 }}
            className="w-full max-w-4xl bg-neutral-950 border border-white/[0.08] rounded-3xl overflow-hidden max-h-[85vh] flex flex-col relative shadow-2xl"
            id="yutobia-admin-manager-modal"
          >
            {/* Top red header brand marker */}
            <div className="bg-[#FF1E27] h-1.5 w-full animate-pulse" />

            {/* Title segment */}
            <div className="p-6 border-b border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF1E27] animate-pulse" />
                <div>
                  <h2 className="font-serif italic text-xl text-white tracking-tight flex items-center gap-2">
                    Studio Customizer <span className="text-[9px] bg-white/10 px-2.5 py-0.5 rounded-full text-white/70 font-mono tracking-widest uppercase">Console v2.0</span>
                  </h2>
                  <p className="text-[9px] text-white/45 font-mono tracking-widest uppercase">Configure background streams, blogs, and channels</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-full cursor-pointer transition-all"
                id="close-manager-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Authentication Interstitial */}
            {!isAuthenticated ? (
              <div className="p-10 flex flex-col items-center justify-center space-y-6 flex-1 text-center max-w-md mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF1E27] shadow-lg shadow-red-950/20 animate-bounce">
                  <Lock className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif italic text-white text-xl">Manager Access Gate</h3>
                  <p className="text-xs text-white/60 font-sans font-light">
                    Protected administrative module. Provide password to customize backgrounds and manage vlogs or social channels.
                  </p>
                </div>
                
                <form onSubmit={handleLogin} className="w-full space-y-4">
                  {authError && (
                    <p className="font-mono text-[10px] text-[#FF1E27] bg-[#FF1E27]/10 border border-[#FF1E27]/20 p-3 rounded-xl block text-center">
                      {authError}
                    </p>
                  )}
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter manager password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-3 text-sm text-center text-white font-mono focus:outline-none focus:border-[#FF1E27]/50 focus:bg-white/10 transition-all font-semibold"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#FF1E27] hover:bg-[#C90E16] text-white font-mono text-xs tracking-widest font-black cursor-pointer shadow-lg shadow-red-950/20 text-center active:scale-98 transition-all"
                    id="admin-login-submit"
                  >
                    ACCESS CONSOLE
                  </button>
                  <p className="text-[9px] font-mono text-white/30 whitespace-nowrap">
                    Development Password Hint: <span className="text-[#FF1E27]/80 font-bold">admin123</span>
                  </p>
                </form>
              </div>
            ) : (
              // Authentic Control Center Grid
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Left navigation sidebar */}
                <div className="w-full md:w-56 border-r border-white/[0.05] bg-black/40 flex flex-col justify-between shrink-0">
                  <div className="p-4 space-y-1.5Col">
                    <span className="block px-3 text-[9px] font-mono text-white/30 tracking-widest uppercase font-bold mb-3">COMMAND MODULES</span>
                    <button
                      onClick={() => setActiveSubTab("hero")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-mono tracking-wider font-semibold transition-all cursor-pointer ${
                        activeSubTab === "hero"
                          ? "bg-[#FF1E27]/10 text-[#FF1E27] border-l-2 border-[#FF1E27]"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Film className="w-4 h-4" />
                      <span>HERO DESIGN</span>
                    </button>

                    <button
                      onClick={() => setActiveSubTab("media")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-mono tracking-wider font-semibold transition-all cursor-pointer ${
                        activeSubTab === "media"
                          ? "bg-[#FF1E27]/10 text-[#FF1E27] border-l-2 border-[#FF1E27]"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>SHOWCASE WORK</span>
                    </button>

                    <button
                      onClick={() => setActiveSubTab("social")}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-xs font-mono tracking-wider font-semibold transition-all cursor-pointer ${
                        activeSubTab === "social"
                          ? "bg-[#FF1E27]/10 text-[#FF1E27] border-l-2 border-[#FF1E27]"
                          : "text-white/60 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      <Share2 className="w-4 h-4" />
                      <span>SOCIAL PLUGS</span>
                    </button>
                  </div>

                  {/* Sidebar bottom */}
                  <div className="p-4 border-t border-white/[0.05] space-y-2 bg-white/[0.01]">
                    <div className="flex items-center gap-2 justify-between">
                      <span className="font-mono text-[9px] text-[#FF1E27]">STABLE ACCESS</span>
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                    </div>
                    <p className="text-[10px] text-white/40 font-sans font-light leading-relaxed">
                      Customizing layout streams safely via fallback container arrays.
                    </p>
                  </div>
                </div>

                {/* Right Tab Content Screen */}
                <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 bg-[#090909]">
                  
                  {/* TAB 1: HERO VIDEO CONTROLLER */}
                  {activeSubTab === "hero" && (
                    <div className="space-y-6 text-white animate-in fade-in duration-200">
                      <div className="space-y-2 border-b border-white/[0.05] pb-4">
                        <h3 className="font-serif italic text-2xl text-white">Hero Design Background</h3>
                        <p className="text-xs text-white/60 font-sans font-light leading-relaxed">
                          Enter any direct clip link (such as raw MP4 URL) to update the cinematic backdrop elements displayed across YouTobia Multimedia.
                        </p>
                      </div>

                      {heroSuccessMsg && (
                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono p-4 rounded-xl">
                          {heroSuccessMsg}
                        </div>
                      )}

                      <form onSubmit={handleSaveVideoUrl} className="space-y-4 max-w-xl">
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-mono tracking-widest text-white/45 uppercase font-bold">Absolute Clip URL Path</label>
                          <input
                            type="text"
                            placeholder="e.g. https://cdn.pixabay.com/video/2021/04/12/70860-537333552_large.mp4"
                            value={heroVideoInput}
                            onChange={(e) => setHeroVideoInput(e.target.value)}
                            className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/40 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none transition-all"
                            required
                          />
                        </div>

                        <div className="p-4 bg-white/[0.01] border border-white/[0.05] rounded-xl space-y-1.5">
                          <span className="font-mono text-[9px] text-[#FF1E27] tracking-widest uppercase font-bold">Recommended Style Guidelines</span>
                          <p className="text-white/50 text-[11px] leading-relaxed font-sans font-light">
                            Use high-quality loop drone footage, atmospheric slow-motion visual art reels, or abstract brand motion graphics. Under 6MB yields the fastest load speed for visitors.
                          </p>
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-3.5 rounded-xl bg-[#FF1E27] hover:bg-[#C90E16] text-white text-xs font-mono tracking-widest font-bold shadow-lg shadow-red-950/20 cursor-pointer"
                        >
                          BROADCAST VIDEO PATH
                        </button>
                      </form>
                    </div>
                  )}

                  {/* TAB 2: PUBLISH & MANAGE MEDIA HUB (BLOGS & VLOGS) */}
                  {activeSubTab === "media" && (
                    <div className="space-y-8 text-white animate-in fade-in duration-200">
                      <div className="space-y-2 border-b border-white/[0.05] pb-4">
                        <h3 className="font-serif italic text-2xl text-white">Draft & Publish Showcased Portfolios</h3>
                        <p className="text-xs text-white/60 font-sans font-light leading-relaxed">
                          Draft analytical case studies, cultural blogs, or embed video diaries to highlight branding projects or campaign analysis.
                        </p>
                      </div>

                      {/* Display Alert Messages */}
                      {mediaError && (
                        <div className="bg-[#FF1E27]/10 border border-[#FF1E27]/25 text-[#FF1E27] text-xs font-mono p-3.5 rounded-xl max-w-xl">
                          {mediaError}
                        </div>
                      )}
                      {mediaSuccess && (
                        <div className="bg-green-500/10 border border-green-500/25 text-green-400 text-xs font-mono p-3.5 rounded-xl max-w-xl">
                          {mediaSuccess}
                        </div>
                      )}

                      {/* Create Post Section collapse */}
                      <form onSubmit={handlePublishMedia} className="space-y-5 bg-white/[0.01] border border-white/[0.05] p-6 rounded-2xl">
                        <h4 className="font-serif italic text-base text-white">Draft Portfolio Item</h4>
                        
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Portfolio Type Selection</label>
                          <div className="grid grid-cols-2 gap-3 p-1 bg-black/60 border border-white/[0.05] rounded-xl">
                            <button
                              type="button"
                              onClick={() => setMediaType("blog")}
                              className={`py-2.5 rounded-lg text-xs font-mono tracking-widest font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                mediaType === "blog" 
                                  ? "bg-[#FF1E27] text-white" 
                                  : "text-white/50 hover:text-white"
                              }`}
                            >
                              <BookOpen className="w-3.5 h-3.5" />
                              WRITTEN ANALYSIS
                            </button>
                            <button
                              type="button"
                              onClick={() => setMediaType("vlog")}
                              className={`py-2.5 rounded-lg text-xs font-mono tracking-widest font-semibold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                mediaType === "vlog" 
                                  ? "bg-[#FF1E27] text-white" 
                                  : "text-white/50 hover:text-white"
                              }`}
                            >
                              <Tv className="w-3.5 h-3.5" />
                              VIDEO VLOG
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Headline Title *</label>
                            <input
                              type="text"
                              placeholder="e.g. Traditional Ge'ez Letterforms in Brand Identity"
                              value={mediaTitle}
                              onChange={(e) => setMediaTitle(e.target.value)}
                              className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all font-sans"
                              required
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Author Creator *</label>
                            <input
                              type="text"
                              placeholder="e.g., Alazar Yohannes"
                              value={mediaAuthor}
                              onChange={(e) => setMediaAuthor(e.target.value)}
                              className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all font-sans"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Category Badge</label>
                            <select
                              value={mediaCategory}
                              onChange={(e) => setMediaCategory(e.target.value)}
                              className="w-full bg-neutral-900 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all font-mono cursor-pointer"
                            >
                              <option value="LORE ANALYSIS">LORE ANALYSIS</option>
                              <option value="DESIGN SHOWCASE">DESIGN SHOWCASE</option>
                              <option value="CULTURAL STRATEGY">CULTURAL STRATEGY</option>
                              <option value="SONIC BRANDING">SONIC BRANDING</option>
                              <option value="PROJECTS PREVIEW">PROJECTS PREVIEW</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Read / Watch Duration (e.g. '5 min read')</label>
                            <input
                              type="text"
                              placeholder="e.g., 5 min read"
                              value={mediaDuration}
                              onChange={(e) => setMediaDuration(e.target.value)}
                              className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all font-mono"
                            />
                          </div>
                        </div>

                        {mediaType === "vlog" && (
                          <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-250">
                            <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Video Embed Source URL</label>
                            <input
                              type="text"
                              placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                              value={mediaVideoUrl}
                              onChange={(e) => setMediaVideoUrl(e.target.value)}
                              className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all font-mono"
                              required={mediaType === "vlog"}
                            />
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Tags (comma-separated list)</label>
                          <input
                            type="text"
                            placeholder="e.g. Identity, Font Architecture, Culture"
                            value={mediaTags}
                            onChange={(e) => setMediaTags(e.target.value)}
                            className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all font-mono"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Short Excerpt (Grid Card Hook) *</label>
                          <textarea
                            placeholder="Write a brief intro summary..."
                            value={mediaExcerpt}
                            onChange={(e) => setMediaExcerpt(e.target.value)}
                            rows={2}
                            required
                            className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl p-4 text-sm text-white focus:outline-none transition-all font-sans resize-none"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-bold">Full Analytical Text Body *</label>
                          <textarea
                            placeholder="Draft your full showcase content or story narrative here..."
                            value={mediaContent}
                            onChange={(e) => setMediaContent(e.target.value)}
                            rows={3}
                            required
                            className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl p-4 text-sm text-white focus:outline-none transition-all font-sans resize-y"
                          />
                        </div>

                        <button
                          type="submit"
                          className="px-6 py-3 text-white bg-[#FF1E27] hover:bg-[#C90E16] text-[10px] font-mono font-bold tracking-widest rounded-xl transition-all shadow-md mt-2"
                        >
                          ARCHIVE & PUBLISH WORK
                        </button>
                      </form>

                      {/* Manage and delete items list */}
                      <div className="space-y-4">
                        <h4 className="font-serif italic text-base text-white">Active Showcase Portfolio Items</h4>
                        <div className="space-y-3">
                          <div className="text-[9px] font-mono text-white/40 bg-white/5 px-4 py-2.5 rounded-lg border border-white/[0.05] uppercase tracking-widest font-black">
                            Written Essays / Blogs ({blogsList.length})
                          </div>
                          {blogsList.length === 0 ? (
                            <p className="text-xs text-white/45 px-4 font-light">No essays registered.</p>
                          ) : (
                            blogsList.map(item => (
                              <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-900/60 border border-white/[0.05] rounded-xl hover:border-white/10 transition-colors">
                                <div className="space-y-1 max-w-[80%]">
                                  <span className="text-[8px] font-mono text-[#FF1E27] uppercase tracking-widest font-bold">{item.category}</span>
                                  <h5 className="font-medium text-sm text-white truncate leading-none">{item.title}</h5>
                                  <p className="text-[10px] text-white/55 font-mono">By {item.author} — Likes: {item.likes}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteMedia(item.id)}
                                  className="p-2.5 text-[#FF1E27]/80 hover:text-[#FF1E27] hover:bg-[#FF1E27]/10 rounded-full cursor-pointer transition-colors"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>

                        <div className="space-y-3 pt-4">
                          <div className="text-[9px] font-mono text-white/40 bg-white/5 px-4 py-2.5 rounded-lg border border-white/[0.05] uppercase tracking-widest font-black">
                            Interactive Vlogs / Media ({vlogsList.length})
                          </div>
                          {vlogsList.length === 0 ? (
                            <p className="text-xs text-white/45 px-4 font-light">No vlogs registered.</p>
                          ) : (
                            vlogsList.map(item => (
                              <div key={item.id} className="flex items-center justify-between p-4 bg-neutral-900/60 border border-white/[0.05] rounded-xl hover:border-white/10 transition-colors">
                                <div className="space-y-1 max-w-[80%]">
                                  <span className="text-[8px] font-mono text-[#FF1E27] uppercase tracking-widest font-bold font-semibold">{item.category}</span>
                                  <h5 className="font-medium text-sm text-white truncate leading-none">{item.title}</h5>
                                  <p className="text-[10px] text-white/55 font-mono">By {item.author} — Stream: {item.videoUrl}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteMedia(item.id)}
                                  className="p-2.5 text-[#FF1E27]/80 hover:text-[#FF1E27] hover:bg-[#FF1E27]/10 rounded-full cursor-pointer transition-colors"
                                  title="Delete item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: ADD & MANAGE SOCIAL MEDIA ACCOUNTS */}
                  {activeSubTab === "social" && (
                    <div className="space-y-6 text-white animate-in fade-in duration-200">
                      <div className="space-y-2 border-b border-white/[0.05] pb-4">
                        <h3 className="font-serif italic text-2xl text-white">Social Channel Connections</h3>
                        <p className="text-xs text-white/60 font-sans font-light leading-relaxed">
                          Synchronize creative social media feeds on Telegram, YouTube, and and other networks to highlight current campaigns.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* New link form */}
                        <form onSubmit={handleAddNewSocial} className="space-y-4 bg-white/[0.01] border border-white/[0.05] p-5 rounded-2xl h-fit">
                          <h4 className="font-serif italic text-base text-white">Link New Connection Channel</h4>
                          
                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-black">Target Network</label>
                            <select
                              value={newSocialPlatform}
                              onChange={(e) => setNewSocialPlatform(e.target.value as any)}
                              className="w-full bg-neutral-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all cursor-pointer font-mono"
                            >
                              <option value="Telegram">Telegram Channel</option>
                              <option value="Youtube">YouTube channel</option>
                              <option value="Facebook">Facebook page</option>
                              <option value="Twitter">Twitter account</option>
                              <option value="Instagram">Instagram feed</option>
                              <option value="LinkedIn">LinkedIn group</option>
                              <option value="TikTok">TikTok profile</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-black">Label Text *</label>
                            <input
                              type="text"
                              placeholder="e.g., Join our Telegram Community"
                              value={newSocialLabel}
                              onChange={(e) => setNewSocialLabel(e.target.value)}
                              className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all font-sans"
                              required
                            />
                          </div>

                          <div className="space-y-1.5 text-ellipsis">
                            <label className="block text-[9px] font-mono tracking-widest text-white/40 uppercase font-black">Channel Destination URL *</label>
                            <input
                              type="url"
                              placeholder="e.g., https://t.me/enqoqcash"
                              value={newSocialUrl}
                              onChange={(e) => setNewSocialUrl(e.target.value)}
                              className="w-full bg-white/5 focus:bg-white/10 border border-white/10 focus:border-[#FF1E27]/50 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-all font-mono"
                              required
                            />
                          </div>

                          <button
                            type="submit"
                            className="px-5 py-3 rounded-xl bg-[#FF1E27] hover:bg-[#C90E16] text-white text-[10px] font-mono tracking-widest font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                          >
                            <PlusCircle className="w-4 h-4" />
                            <span>CONNECT PLUG</span>
                          </button>
                        </form>

                        {/* List current socials */}
                        <div className="space-y-4">
                          <h4 className="font-serif italic text-base text-white">Active Social Outposts</h4>
                          {socialsList.length === 0 ? (
                            <p className="text-xs text-white/40 italic font-mono uppercase">[No social channels connected]</p>
                          ) : (
                            <div className="space-y-3">
                              {socialsList.map(soc => (
                                <div key={soc.id} className="p-4 bg-neutral-900/60 border border-white/[0.05] rounded-2xl flex items-center justify-between hover:border-white/10 transition-all">
                                  <div className="space-y-1 max-w-[70%]">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] font-mono text-[#FF1E27] font-black uppercase tracking-wider">{soc.platform}</span>
                                      <div className={`w-1.5 h-1.5 rounded-full ${soc.isActive ? 'bg-green-500 animate-pulse' : 'bg-neutral-600'}`} />
                                    </div>
                                    <span className="text-xs text-white font-medium block truncate select-all">{soc.label}</span>
                                    <span className="text-[9px] font-mono text-white/40 block truncate cursor-pointer">{soc.url}</span>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleToggleSocialActive(soc.id)}
                                      className={`px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold tracking-wider cursor-pointer border transition-colors ${
                                        soc.isActive
                                          ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                                          : "bg-neutral-800 text-white/50 border-neutral-700 hover:bg-neutral-700"
                                      }`}
                                    >
                                      {soc.isActive ? "ACTIVE" : "PAUSED"}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteSocial(soc.id)}
                                      className="p-2 text-[#FF1E27]/80 hover:text-[#FF1E27] hover:bg-[#FF1E27]/10 rounded-lg cursor-pointer transition-colors"
                                      title="Remove link"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;

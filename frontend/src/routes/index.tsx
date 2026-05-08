import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  Sparkles, PlusCircle, Loader2, AlertTriangle,
  ExternalLink, Bookmark, Trash2, ChevronDown, ChevronUp,
  List, Tag, Target, X, MessageSquare, Send, ChevronLeft, ChevronRight, Clock
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kairos — Intelligence Terminal" },
      { name: "description", content: "Command and control for your digital life." },
    ],
  }),
  component: FeedPage,
});

const API_BASE = "";

type Story = {
  id: string; url: string; image: string; title: string;
  summary: string; key_points: string[]; category: string;
  sentiment: string; tags: string[]; topic: string | null;
  relevant_to_topic: string | null; relevant_sections: string[] | null;
  brewed_at: string;
};

const sentimentEmoji: Record<string, string> = {
  Positive: "🟢", Negative: "🔴", Neutral: "🟡",
};

const categoryGradients: Record<string, string> = {
  Tech:          "from-blue-900/80 via-blue-800/60 to-transparent",
  News:          "from-slate-900/80 via-slate-800/60 to-transparent",
  Science:       "from-emerald-900/80 via-emerald-800/60 to-transparent",
  Politics:      "from-red-900/80 via-red-800/60 to-transparent",
  Business:      "from-amber-900/80 via-amber-800/60 to-transparent",
  Sports:        "from-green-900/80 via-green-800/60 to-transparent",
  Entertainment: "from-purple-900/80 via-purple-800/60 to-transparent",
  Other:         "from-stone-900/80 via-stone-800/60 to-transparent",
};

const fallbackBg: Record<string, string> = {
  Tech:          "bg-gradient-to-br from-blue-950 to-blue-800",
  News:          "bg-gradient-to-br from-slate-900 to-slate-700",
  Science:       "bg-gradient-to-br from-emerald-950 to-teal-800",
  Politics:      "bg-gradient-to-br from-red-950 to-rose-800",
  Business:      "bg-gradient-to-br from-amber-950 to-amber-700",
  Sports:        "bg-gradient-to-br from-green-950 to-green-700",
  Entertainment: "bg-gradient-to-br from-purple-950 to-violet-800",
  Other:         "bg-gradient-to-br from-stone-900 to-stone-700",
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso + "Z").getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function StoryChat({ storyId, onClose }: { storyId: string; onClose: () => void }) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState<{ role: "user" | "ai"; text: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  const send = async () => {
    if (!msg.trim() || loading) return;
    const userMsg = msg.trim();
    setMsg("");
    setChat(prev => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story_id: storyId, message: userMsg, stream: true }),
      });

      if (!response.body) throw new Error("No body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let aiResponse = "";
      setChat(prev => [...prev, { role: "ai", text: "" }]);
      setLoading(false);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                aiResponse += data.text;
                setChat(prev => {
                  const last = prev[prev.length - 1];
                  const others = prev.slice(0, -1);
                  return [...others, { ...last, text: aiResponse }];
                });
              }
              if (data.done) break;
            } catch (e) { console.error(e); }
          }
        }
      }
    } catch {
      setChat(prev => [...prev, { role: "ai", text: "Signal lost." }]);
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }}
      className="absolute bottom-24 right-5 z-50 w-[380px] h-[500px] flex flex-col rounded-[2.5rem] bg-black/60 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl shadow-black/50">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Intelligence Agent</span>
        </div>
        <button onClick={onClose} className="text-white/40 hover:text-white"><X className="h-4 w-4" /></button>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {chat.map((c, i) => (
          <div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-[1.8rem] px-5 py-3.5 text-sm leading-relaxed ${
              c.role === "user" ? "bg-white text-espresso-deep font-bold" : "bg-white/10 text-white/90"
            }`}>{c.text}</div>
          </div>
        ))}
        {loading && <div className="bg-white/10 w-fit rounded-full px-5 py-3"><Loader2 className="h-4 w-4 animate-spin text-white/40" /></div>}
      </div>
      <div className="p-5 bg-white/5 border-t border-white/10">
        <div className="relative flex items-center">
          <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Query signal..." className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 pr-14 text-sm text-white placeholder:text-white/20 outline-none focus:border-white/30 transition-all" />
          <button onClick={send} className="absolute right-3 grid h-10 w-10 place-items-center rounded-xl bg-white text-espresso-deep"><Send className="h-4 w-4" /></button>
        </div>
      </div>
    </motion.div>
  );
}

function RecentSignals({ stories, currentId, onSelect }: { stories: Story[]; currentId: string; onSelect: (idx: number) => void }) {
  return (
    <div className="w-80 h-full flex flex-col bg-black/40 backdrop-blur-3xl border-l border-white/10">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <Clock className="h-4 w-4 text-bronze" />
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Recent Signals</span>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {stories.map((s, i) => (
          <button key={s.id} onClick={() => onSelect(i)}
            className={`w-full text-left group p-3 rounded-2xl border transition-all ${
              s.id === currentId ? "bg-white/10 border-white/20" : "border-transparent hover:bg-white/5"
            }`}>
            <p className="text-[9px] font-black uppercase tracking-widest text-bronze/60 mb-1">{s.category} · {timeAgo(s.brewed_at)}</p>
            <h4 className={`text-xs font-bold leading-snug line-clamp-2 transition-colors ${
              s.id === currentId ? "text-white" : "text-white/40 group-hover:text-white/70"
            }`}>{s.title}</h4>
          </button>
        ))}
      </div>
    </div>
  );
}

function StorySlide({ s, index, total, isActive, onDelete }: {
  s: Story; index: number; total: number; isActive: boolean; onDelete: (id: string) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const hasImage = s.image && !imgError;
  const grad = categoryGradients[s.category] ?? categoryGradients.Other;
  const bg   = fallbackBg[s.category] ?? fallbackBg.Other;
  const domain = s.url !== "pasted-text"
    ? (() => { try { return new URL(s.url).hostname.replace("www.", ""); } catch { return ""; } })()
    : "Pasted Text";

  return (
    <div className={`feed-card ${!hasImage ? bg : ""}`}>
      {hasImage && <img src={s.image} alt="" onError={() => setImgError(true)} className="absolute inset-0 w-full h-full object-cover" />}
      <div className={`absolute inset-0 bg-gradient-to-t ${grad} via-40%`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-5">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50">{index + 1} / {total}</span>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white/80">
            <Tag className="h-2.5 w-2.5" />{s.category}
          </span>
          <span className="text-sm">{sentimentEmoji[s.sentiment] ?? "🟡"}</span>
        </div>
      </div>

      <AnimatePresence>
        {chatOpen && <StoryChat storyId={s.id} onClose={() => setChatOpen(false)} />}
      </AnimatePresence>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-8 flex items-end justify-between">
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {!expanded ? (
              <motion.div key="collapsed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: isActive ? 1 : 0.6, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <p className="text-[11px] font-black uppercase tracking-[0.3em] text-bronze mb-3">{domain} · {timeAgo(s.brewed_at)}</p>
                <h2 className="font-display text-3xl md:text-4xl font-black text-white leading-[1.1] mb-4 drop-shadow-lg">{s.title || s.url}</h2>
                <p className="text-base text-white/80 leading-relaxed line-clamp-3 mb-4 max-w-2xl">{s.summary}</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setExpanded(true)} className="flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-white/25 transition-all"><List className="h-3.5 w-3.5" /> Key Points</button>
                  {s.url !== "pasted-text" && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full bg-bronze/80 backdrop-blur-md border border-bronze/40 px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-bronze transition-all"><ExternalLink className="h-3.5 w-3.5" /> Read</a>
                  )}
                  <button onClick={() => onDelete(s.id)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/40 hover:bg-red-500/40 hover:text-white transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </motion.div>
            ) : (
              <motion.div key="expanded" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="bg-black/55 backdrop-blur-xl rounded-3xl border border-white/10 p-6 max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-bronze">Key Points</p>
                  <button onClick={() => setExpanded(false)} className="text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest">✕ Close</button>
                </div>
                <ul className="space-y-3">
                  {s.key_points?.map((pt, i) => (
                    <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 text-sm text-white/85 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-bronze shrink-0" />{pt}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex flex-col items-center gap-3">
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setChatOpen(!chatOpen)}
            className="grid h-16 w-16 place-items-center rounded-[2rem] bg-white text-espresso-deep shadow-2xl transition-all">
            <MessageSquare className={`h-6 w-6 transition-transform duration-500 ${chatOpen ? "rotate-90" : ""}`} />
          </motion.button>
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30">Intelligence</span>
        </div>
      </div>
    </div>
  );
}

function EmptyFeed() {
  return (
    <div className="feed-card bg-gradient-to-br from-espresso-deep to-espresso-mid flex flex-col items-center justify-center gap-6 text-center">
      <Sparkles className="h-12 w-12 text-bronze animate-pulse" />
      <h2 className="font-display text-4xl font-black text-white">Inbox Zero.</h2>
      <Link to="/paste" className="flex items-center gap-2 rounded-full bg-bronze text-white px-8 py-4 text-xs font-black uppercase tracking-widest shadow-xl">
        <PlusCircle className="h-5 w-5" /> Brew Signal
      </Link>
    </div>
  );
}

function FeedPage() {
  const [allStories, setAllStories] = useState<Story[]>([]);
  const [stories,    setStories]    = useState<Story[]>([]);
  const [allTags,    setAllTags]    = useState<string[]>([]);
  const [activeTag,  setActiveTag]  = useState<string | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [current,    setCurrent]    = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [topBarVisible, setTopBarVisible] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const loadStories = useCallback(async () => {
    try {
      const [sRes, tRes] = await Promise.all([fetch(`${API_BASE}/api/stories`), fetch(`${API_BASE}/api/stories/tags`)]);
      const sData = await sRes.json();
      const tData = await tRes.json();
      setAllStories(sData.stories || []);
      setStories(sData.stories || []);
      setAllTags(tData.tags || []);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { 
    loadStories(); 
    // Auto-sync with Backend every 10s
    const interval = setInterval(loadStories, 10000);
    return () => clearInterval(interval);
  }, [loadStories]);

  useEffect(() => {
    if (activeTag) setStories(allStories.filter(s => s.tags?.includes(activeTag)));
    else setStories(allStories);
    setCurrent(0);
    scrollRef.current?.scrollTo({ top: 0 });
  }, [activeTag, allStories]);

  const onScroll = () => {
    if (!scrollRef.current) return;
    const st = scrollRef.current.scrollTop;
    const idx = Math.round(st / scrollRef.current.clientHeight);
    if (idx !== current) setCurrent(idx);

    // Hide topbar when scrolling up (into a card), show when scrolling down
    if (st > lastScrollTop.current + 5) {
      setTopBarVisible(false); // scrolling up through feed (top = 0 is top of page, increasing = going down visually)
    } else if (st < lastScrollTop.current - 5) {
      setTopBarVisible(true);
    }
    lastScrollTop.current = st;
  };

  const jumpTo = (idx: number) => {
    const cards = scrollRef.current?.querySelectorAll(".feed-card");
    if (cards?.[idx]) (cards[idx] as HTMLElement).scrollIntoView({ behavior: "smooth" });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-espresso-deep"><Loader2 className="h-10 w-10 text-bronze animate-spin" /></div>;

  return (
    <div className="relative h-screen overflow-hidden flex bg-black">
      <div className="flex-1 relative h-full">
        <motion.div
          className="absolute top-0 left-0 right-0 z-50"
          animate={{ y: topBarVisible ? 0 : "-100%" }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <TopBar />
        </motion.div>
        <div ref={scrollRef} onScroll={onScroll} className="feed-scroll">
          {stories.length === 0 ? <EmptyFeed /> : stories.map((s, i) => (
            <StorySlide key={s.id} s={s} index={i} total={stories.length} isActive={i === current} onDelete={async (id) => {
              setAllStories(prev => prev.filter(st => st.id !== id));
              await fetch(`${API_BASE}/api/stories/${id}`, { method: "DELETE" });
            }} />
          ))}
        </div>

        {/* Sidebar Toggle */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-50 p-2 bg-white/10 backdrop-blur-md rounded-l-2xl border border-white/10 text-white/50 hover:text-white transition-all">
          {sidebarOpen ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>

        {/* Dot Indicators */}
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
          {stories.map((_, i) => (
            <button key={i} onClick={() => jumpTo(i)} className={`rounded-full transition-all duration-300 ${i === current ? "h-6 w-1.5 bg-bronze" : "h-1.5 w-1.5 bg-white/30"}`} />
          ))}
        </div>
      </div>

      {/* Collapsible Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 320, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}>
            <RecentSignals stories={stories} currentId={stories[current]?.id} onSelect={jumpTo} />
          </motion.div>
        )}
      </AnimatePresence>

      <Link to="/paste" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-bronze text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all">
        <PlusCircle className="h-4 w-4" /> Brew
      </Link>
    </div>
  );
}

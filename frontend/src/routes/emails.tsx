import { useState, useEffect, useCallback, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  RefreshCw, Loader2, AlertTriangle, Zap,
  X, ChevronLeft, ChevronRight, Mail, Archive
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import gsap from "gsap";

export const Route = createFileRoute("/emails")({
  head: () => ({ meta: [{ title: "My Emails — Kairos" }] }),
  component: EmailsPage,
});

const API_BASE = "";

type EmailSummary = {
  id: string; date: string; from: string; subject: string;
  summary: string; category: string; action_needed: string;
  action_item: string; priority: string;
};

const priorityColor: Record<string, string> = {
  High: "#ef4444", Medium: "#f59e0b", Low: "#10b981",
};
const categoryColor: Record<string, string> = {
  Personal: "#8b5cf6", Work: "#3b82f6", Marketing: "#ec4899",
  Newsletter: "#06b6d4", Social: "#6366f1", Spam: "#6b7280", Other: "#78716c",
};

function senderName(f: string) {
  return f.replace(/<.*>/, "").replace(/"/g, "").trim() || f;
}
function senderInitials(f: string) {
  const n = senderName(f), w = n.split(/\s+/);
  return w.length >= 2 ? (w[0][0] + w[1][0]).toUpperCase() : n.slice(0, 2).toUpperCase();
}
function fmtDate(d: string) {
  try { return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }); }
  catch { return ""; }
}

// ── The big card stack ────────────────────────────────────────────────────────
interface StackProps {
  emails: EmailSummary[];
  onOpen: (idx: number) => void;
  onArchive: (id: string) => void;
}

function EmailStack({ emails, onOpen, onArchive }: StackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = emails.length;

  // Reset index when list changes (e.g. filter applied)
  useEffect(() => {
    setCurrentIndex(0);
  }, [emails]);

  const nextCard = useCallback(() => {
    if (total === 0) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Auto-cycle logic
  useEffect(() => {
    const timer = setInterval(nextCard, 5000);
    return () => clearInterval(timer);
  }, [nextCard]);

  return (
    <div className="relative w-full max-w-[600px] h-[400px] mx-auto flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        {emails.slice(currentIndex, currentIndex + 3).map((e, i) => {
          const isTop = i === 0;
          const realIdx = (currentIndex + i) % total;
          
          return (
            <NotificationCard
              key={e.id}
              email={e}
              index={i}
              isTop={isTop}
              onSwipe={nextCard}
              onClick={() => onOpen(realIdx)}
              onArchive={() => onArchive(e.id)}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}

function getDomain(f: string) {
  const m = f.match(/@([\w.-]+)/);
  return m ? m[1] : null;
}

function NotificationCard({ email, index, isTop, onSwipe, onClick, onArchive }: { 
  email: EmailSummary; 
  index: number; 
  isTop: boolean; 
  onSwipe: () => void;
  onClick: () => void;
  onArchive: () => void;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-35, 35]);
  const opacity = useTransform(x, [-300, -200, 0, 200, 300], [0, 1, 1, 1, 0]);
  
  const [logoError, setLogoError] = useState(false);
  const domain = getDomain(email.from);
  const favicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;

  const handleDragEnd = (_: any, info: any) => {
    if (Math.abs(info.offset.x) > 150 || Math.abs(info.offset.y) > 150) {
      onSwipe();
    }
  };

  return (
    <motion.div
      style={{ 
        x, y, rotate, opacity,
        zIndex: 10 - index,
        scale: 1 - index * 0.05,
        y: index * 16,
        willChange: "transform, opacity",
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
      onDragEnd={handleDragEnd}
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ 
        opacity: 1, 
        scale: 1 - index * 0.05, 
        y: index * 16,
        transition: { type: "spring", stiffness: 350, damping: 30, mass: 1, restDelta: 0.001 }
      }}
      exit={{ 
        y: 800, 
        opacity: 0, 
        rotate: x.get() > 0 ? 60 : -60,
        transition: { duration: 0.6, ease: [0.32, 0, 0.67, 0] }
      }}
      whileTap={isTop ? { scale: 0.98, transition: { duration: 0.1 } } : {}}
      onTap={() => {
        if (isTop && Math.abs(x.get()) < 10 && Math.abs(y.get()) < 10) {
          onClick();
        }
      }}
      className={`absolute w-full aspect-[1.7/1] bg-[#FCFAF7] rounded-[3rem] p-10 shadow-[0_30px_70px_-20px_rgba(59,42,36,0.18)] border border-espresso-deep/10 cursor-grab active:cursor-grabbing flex flex-col justify-between group transform-gpu ${!isTop ? 'pointer-events-none' : ''}`}
    >
      {/* Notification Header */}
      <div className="flex items-start gap-6">
        <div className="w-20 h-20 rounded-[2.2rem] bg-white flex items-center justify-center shadow-xl ring-1 ring-espresso-deep/5 overflow-hidden transform-gpu">
          {favicon && !logoError ? (
            <img 
              src={favicon} 
              alt="logo" 
              className="w-10 h-10 object-contain" 
              onError={() => setLogoError(true)}
            />
          ) : (
            <div className="text-2xl font-black text-espresso-deep">{senderInitials(email.from)}</div>
          )}
        </div>
        <div className="flex-1 min-w-0 pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-xl font-display font-black text-espresso-deep truncate">
              {senderName(email.from)}
            </h4>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-espresso-mid/60 font-black uppercase tracking-[0.2em]">
                {fmtDate(email.date)}
              </span>
              {isTop && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onArchive(); }}
                  className="p-2 rounded-xl bg-espresso-deep/5 hover:bg-espresso-deep/10 text-espresso-deep transition-all active:scale-90"
                >
                  <Archive className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          <p className="text-base text-espresso-mid font-semibold truncate opacity-70">
            {email.subject}
          </p>
        </div>
      </div>

      {/* Notification Content */}
      <div className="bg-espresso-deep/[0.03] rounded-[2.5rem] p-8 border border-espresso-deep/5 relative overflow-hidden mt-4 transform-gpu">
        <p className="text-base text-espresso-mid/80 leading-relaxed line-clamp-3 italic font-medium">
          "{email.summary}"
        </p>
      </div>

      {/* Footer Tags */}
      <div className="flex items-center justify-between pt-4">
        <div className="flex gap-3">
          <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-cream-light bg-espresso-deep shadow-md">
            {email.priority}
          </span>
          <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-espresso-deep bg-espresso-deep/5 border border-espresso-deep/10">
            {email.category}
          </span>
        </div>
        {email.action_needed === "Yes" && (
          <div className="flex items-center gap-2 text-[10px] font-black text-espresso-deep uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-espresso-deep/10 shadow-sm">
            <Zap className="h-4 w-4 fill-espresso-deep" /> Action Needed
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── Detail modal ──────────────────────────────────────────────────────────────
function DetailModal({ e, onClose, onPrev, onNext, hasPrev, hasNext, onArchive }: {
  e: EmailSummary; onClose: () => void;
  onPrev: () => void; onNext: () => void;
  hasPrev: boolean; hasNext: boolean;
  onArchive: () => void;
}) {
  const y = useMotionValue(0);
  const opacity = useTransform(y, [0, 220], [1, 0]);
  const scale   = useTransform(y, [0, 220], [1, 0.88]);

  const [logoError, setLogoError] = useState(false);
  const domain = getDomain(e.from);
  const favicon = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128` : null;

  const bind = useDrag(({ last, movement: [, my], velocity: [, vy], cancel }) => {
    if (my < 0) { cancel(); return; }
    y.set(my);
    if (last) {
      if (my > 120 || vy > 0.5) animate(y, 500, { duration: 0.3 }).then(onClose);
      else animate(y, 0, { type: "spring", stiffness: 400, damping: 30 });
    }
  }, { axis: "y", filterTaps: true });

  useEffect(() => {
    const h = (ev: KeyboardEvent) => {
      if (ev.key === "Escape")     onClose();
      if (ev.key === "ArrowRight") onNext();
      if (ev.key === "ArrowLeft")  onPrev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, onNext, onPrev]);

  return (
    <>
      <motion.div className="fixed inset-0 z-40 bg-espresso-deep/40 backdrop-blur-xl transform-gpu"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          {...(bind() as object)}
          style={{ y, opacity, scale, touchAction: "none", willChange: "transform, opacity" }}
          initial={{ y: 60, opacity: 0, scale: 0.92 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 60, opacity: 0, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 350, damping: 35, restDelta: 0.001 }}
          className="pointer-events-auto w-full max-w-lg bg-[#FCFAF7] rounded-[3rem] overflow-hidden shadow-2xl cursor-grab active:cursor-grabbing border border-espresso-deep/10 transform-gpu"
        >
          <div className="flex justify-center pt-4"><div className="w-12 h-1.5 rounded-full bg-espresso-deep/10" /></div>
          <div className="p-8">
            <div className="flex items-start gap-5 mb-8">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[2rem] bg-white shadow-xl ring-1 ring-espresso-deep/5 overflow-hidden transform-gpu">
                {favicon && !logoError ? (
                  <img 
                    src={favicon} 
                    alt="logo" 
                    className="w-8 h-8 object-contain" 
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <div className="text-xl font-black text-espresso-deep">{senderInitials(e.from)}</div>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-[10px] text-espresso-deep font-black uppercase tracking-widest opacity-40 truncate">{e.from}</p>
                <h2 className="font-display text-2xl font-black text-espresso-deep leading-tight mt-1">{e.subject}</h2>
                <p className="text-xs text-espresso-mid font-medium mt-1">{fmtDate(e.date)}</p>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={onClose}
                  className="grid h-10 w-10 place-items-center rounded-2xl bg-espresso-deep/5 hover:bg-espresso-deep/10 transition-all text-espresso-mid shrink-0">
                  <X className="h-5 w-5" />
                </button>
                <button onClick={(ev) => { ev.stopPropagation(); onArchive(); }}
                  className="grid h-10 w-10 place-items-center rounded-2xl bg-espresso-deep/5 hover:bg-espresso-deep/10 transition-all text-espresso-deep shrink-0">
                  <Archive className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="rounded-full text-[10px] font-black px-4 py-1.5 uppercase tracking-widest text-cream-light bg-espresso-deep shadow-sm">
                {e.priority} Priority
              </span>
              <span className="rounded-full text-[10px] font-black px-4 py-1.5 uppercase tracking-widest text-espresso-deep bg-white border border-espresso-deep/10 shadow-sm">
                {e.category}
              </span>
            </div>

            <div className="rounded-[2.5rem] bg-white border border-espresso-deep/5 p-8 mb-6 shadow-sm transform-gpu">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-espresso-deep opacity-40 mb-3">Neural Summary</p>
              <p className="text-espresso-mid text-sm leading-relaxed font-medium">{e.summary}</p>
            </div>

            {e.action_needed === "Yes" && e.action_item && e.action_item !== "None" && (
              <div className="flex items-start gap-4 rounded-[2.5rem] bg-white border border-espresso-deep/10 px-6 py-5 mb-6 shadow-md transform-gpu">
                <Zap className="h-5 w-5 text-espresso-deep shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-espresso-deep opacity-60 mb-1">Action Required</p>
                  <p className="text-espresso-deep text-sm font-bold leading-snug">{e.action_item}</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-espresso-deep/5">
              <button onClick={onPrev} disabled={!hasPrev}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-espresso-deep/40 hover:text-espresso-deep transition-colors disabled:opacity-20">
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <p className="text-[9px] text-espresso-deep/30 font-black uppercase tracking-widest">Swipe Down to close</p>
              <button onClick={onNext} disabled={!hasNext}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-espresso-deep/40 hover:text-espresso-deep transition-colors disabled:opacity-20">
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
function EmailsPage() {
  const [emails,     setEmails]     = useState<EmailSummary[]>([]);
  const [filtered,   setFiltered]   = useState<EmailSummary[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error,      setError]      = useState("");
  const [filter,     setFilter]     = useState<"All" | "Action" | "High">("All");
  const [openIdx,    setOpenIdx]    = useState<number | null>(null);
  const [progress,   setProgress]   = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [startDate,  setStartDate]  = useState("");
  const [endDate,    setEndDate]    = useState("");

  const loadEmails = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`${API_BASE}/api/emails`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setEmails(data.emails ?? []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not reach backend.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { loadEmails(); }, [loadEmails]);

  useEffect(() => {
    let f = emails;
    if (filter === "Action") {
      f = emails.filter(e => e.action_needed?.toLowerCase() === "yes");
    }
    if (filter === "High") {
      f = emails.filter(e => e.priority?.toLowerCase() === "high");
    }
    setFiltered(f);
  }, [filter, emails]);

  const refreshEmails = useCallback(async () => {
    setRefreshing(true); setError(""); setProgress(0); setProgressMsg("Initializing...");
    try {
      const res = await fetch(`${API_BASE}/api/emails/refresh`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          after: startDate || null, 
          before: endDate || null,
          stream: true
        })
      });
      
      if (!res.ok) { 
        const e = await res.json().catch(() => ({ detail: "Refresh failed" })); 
        throw new Error(e.detail); 
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No reader available");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.replace("data: ", "").trim());
              if (data.error) throw new Error(data.error);
              
              if (data.type === "progress") {
                setProgress(data.percent);
                setProgressMsg(data.message);
              } else if (data.type === "done") {
                setProgress(100);
                setProgressMsg("Intelligence Distilled.");
                setEmails(data.emails ?? []);
              }
            } catch (e) {
              console.error("Stream parse error:", e);
            }
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Refresh failed");
    } finally { setRefreshing(false); }
  }, [startDate, endDate]);

  const onArchive = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/emails/${id}/archive`, { method: "DELETE" });
      if (res.ok) {
        setEmails(prev => prev.filter(e => e.id !== id));
        if (openIdx !== null && filtered[openIdx]?.id === id) {
          setOpenIdx(null);
        }
      }
    } catch (err) {
      console.error("Archive failed:", err);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col bg-[#F7F3EE]">
      <TopBar />

      <AnimatePresence>
        {openIdx !== null && filtered[openIdx] && (
          <DetailModal
            e={filtered[openIdx]}
            onClose={() => setOpenIdx(null)}
            onPrev={() => setOpenIdx(i => (i !== null && i > 0 ? i - 1 : i))}
            onNext={() => setOpenIdx(i => (i !== null && i < filtered.length - 1 ? i + 1 : i))}
            hasPrev={openIdx > 0}
            hasNext={openIdx < filtered.length - 1}
            onArchive={() => onArchive(filtered[openIdx].id)}
          />
        )}
      </AnimatePresence>

      <main className="h-screen flex flex-col px-12 md:px-20 py-10 w-full relative z-10 overflow-hidden">
        
        {/* Header Section - Compact & High-Impact */}
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 shrink-0">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: "circOut" }}>
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-4 w-4 text-espresso-deep animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-espresso-deep opacity-40">Neural Extraction Engine v2.5</span>
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-black tracking-tighter text-espresso-deep leading-[0.8] mb-4">Emails.</h1>
            <p className="text-espresso-mid text-lg font-medium opacity-50 max-w-xl leading-snug">
              {emails.length > 0 
                ? `Synthesizing ${emails.length} professional signals into high-fidelity intelligence.` 
                : "Awaiting your information stream synchronization."}
            </p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className="flex items-center gap-4 pb-1">
            
            {/* Progress Visualization */}
            <AnimatePresence>
              {refreshing && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex flex-col items-end mr-6 min-w-[200px]"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest text-espresso-deep opacity-40">{progressMsg}</span>
                    <span className="text-[11px] font-black text-espresso-deep">{progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-espresso-deep/5 rounded-full overflow-hidden border border-espresso-deep/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-espresso-deep shadow-[0_0_10px_rgba(59,42,36,0.3)]"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Date Filtering UI */}
            <div className="flex items-center gap-3 mr-6 bg-white/40 p-3 rounded-[1.8rem] border border-espresso-deep/10 backdrop-blur-md">
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-espresso-deep/40 ml-2">After</span>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent border-none text-[11px] font-bold text-espresso-deep outline-none cursor-pointer"
                />
              </div>
              <div className="h-8 w-px bg-espresso-deep/10 mx-1" />
              <div className="flex flex-col gap-1">
                <span className="text-[8px] font-black uppercase tracking-widest text-espresso-deep/40 ml-2">Before</span>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent border-none text-[11px] font-bold text-espresso-deep outline-none cursor-pointer"
                />
              </div>
            </div>

            <button 
              onClick={refreshEmails} 
              disabled={refreshing || loading}
              className="glass rounded-3xl px-8 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-cream-light bg-espresso-deep hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3 shadow-lg"
            >
              {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              {refreshing ? "Syncing..." : "Sync Intelligence"}
            </button>
          </motion.div>
        </header>

        {/* Compact Dashboard Layout */}
        {!loading && emails.length > 0 && (
          <div className="flex-1 grid lg:grid-cols-12 gap-10 min-h-0 items-stretch mb-6">
            
            {/* Sidebar Navigation - Perfectly Centered Vertically */}
            <aside className="lg:col-span-3 flex items-center">
              <motion.section initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                className="glass-card rounded-[3rem] p-8 border border-espresso-deep/10 shadow-xl bg-white/30 w-full">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-espresso-deep opacity-30 mb-8">Intelligence Feeds</h2>
                <div className="space-y-3">
                  {(["All", "Action", "High"] as const).map(f => {
                    const active = filter === f;
                    const count = f === "All" ? emails.length : 
                                 f === "Action" ? emails.filter(e => e.action_needed?.toLowerCase() === "yes").length :
                                 emails.filter(e => e.priority?.toLowerCase() === "high").length;
                    return (
                      <button 
                        key={f} 
                        onClick={() => setFilter(f)}
                        className={`w-full flex items-center justify-between rounded-2xl p-5 transition-all group relative overflow-hidden ${
                          active ? "bg-espresso-deep text-cream-light shadow-xl scale-[1.02]" : "hover:bg-white/50 border border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {f === "All" && <Mail className={`h-4 w-4 ${active ? "text-cream-light" : "text-espresso-deep opacity-30"}`} />}
                          {f === "Action" && <Zap className={`h-4 w-4 ${active ? "text-cream-light" : "text-espresso-deep opacity-30"}`} />}
                          {f === "High" && <AlertTriangle className={`h-4 w-4 ${active ? "text-cream-light" : "text-espresso-deep opacity-30"}`} />}
                          <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${active ? "text-cream-light" : "text-espresso-deep"}`}>{f} feed</span>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${active ? "bg-white/20" : "bg-espresso-deep/5 text-espresso-deep"}`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.section>
            </aside>

            {/* Main Content Stage - Filling the remainder */}
            <div className="lg:col-span-9">
              <motion.section initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 1, ease: "circOut" }}
                className="relative h-full flex flex-col items-center justify-center rounded-[3.5rem] bg-gradient-to-br from-espresso-deep/[0.03] via-transparent to-espresso-deep/[0.01] border border-espresso-deep/[0.04] shadow-inner overflow-hidden">
                
                {/* Background Atmosphere */}
                <div className="absolute inset-0 pointer-events-none opacity-50">
                   <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-espresso-deep/[0.03] blur-[120px] -translate-y-1/2 translate-x-1/2 rounded-full" />
                   <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-espresso-deep/[0.02] blur-[100px] translate-y-1/2 -translate-x-1/2 rounded-full" />
                </div>

                {/* The Stack Area - Scaled for Viewport */}
                <div className="flex items-center justify-center w-full max-w-4xl relative z-10 py-8">
                  <EmailStack emails={filtered} onOpen={setOpenIdx} onArchive={onArchive} />
                </div>

                {/* Compact Footer Navigation */}
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30 shrink-0">
                  <div className="flex gap-2">
                    {[0, 1, 2].map(i => (
                      <motion.div 
                        key={i} 
                        animate={{ opacity: [0.3, 1, 0.3] }} 
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                        className="h-1 w-8 rounded-full bg-espresso-deep" 
                      />
                    ))}
                  </div>
                  <p className="text-[9px] font-black uppercase tracking-[0.6em] whitespace-nowrap text-espresso-deep">
                    Interactive Workspace
                  </p>
                </div>
              </motion.section>
            </div>

          </div>
        )}

        {/* Loading / Error / Empty States */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative w-16 h-16">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-bronze/10 border-t-bronze" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-bronze animate-spin" />
              </div>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-bronze">Fetching Signals...</p>
          </div>
        )}
        
        {!loading && error && (
          <div className="max-w-xl mx-auto glass-card rounded-[3rem] p-12 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-6" />
            <h2 className="font-display text-2xl font-bold text-espresso-deep mb-3">Sync Interrupted.</h2>
            <p className="text-muted-foreground text-sm mb-8">{error}</p>
            <button onClick={loadEmails} className="px-8 py-4 rounded-2xl bg-espresso-mid text-cream-light font-black uppercase tracking-widest text-xs shadow-lg">Retry Sync</button>
          </div>
        )}

        {!loading && !error && emails.length === 0 && (
          <div className="text-center py-32 opacity-30">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-cream-deep/50 border border-espresso-deep/5 mb-8">
              <Mail className="h-10 w-10 text-espresso-deep" />
            </div>
            <p className="font-display text-2xl font-bold text-espresso-deep">Nothing distilled yet.</p>
            <p className="mt-4 text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">Your professional signals will be preserved here in high-fidelity.</p>
          </div>
        )}

      </main>

      <footer className="py-20 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground leading-relaxed">
          Kairos Information Architecture<br />
          Serial No: E-2026-N7
        </p>
      </footer>
    </div>
  );
}


import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Link2, ClipboardPaste, ArrowRight, Loader2,
  CheckCircle2, BrainCircuit, AlertCircle,
  Tag, MessageSquare, List, Smile, X,
  FileText, Target, Sparkles,
} from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/paste")({
  head: () => ({
    meta: [
      { title: "Distill — Brewed" },
      { name: "description", content: "AI reducing information overload." },
    ],
  }),
  component: PastePage,
});

const API_BASE = "";

type Story = {
  id: string;
  url: string;
  image: string;
  title: string;
  summary: string;
  key_points: string[];
  category: string;
  sentiment: string;
  tags: string[];
  topic: string | null;
  relevant_to_topic: string | null;
  relevant_sections: string[] | null;
  brewed_at: string;
};

const processingSteps = [
  "Fetching content...",
  "Stripping noise...",
  "Detecting key insights...",
  "Analysing topic relevance...",
  "Building 90-second brief...",
];

const sentimentColor: Record<string, string> = {
  Positive: "text-emerald-600 bg-emerald-50 border-emerald-200",
  Negative: "text-red-500 bg-red-50 border-red-200",
  Neutral:  "text-amber-600 bg-amber-50 border-amber-200",
};

type InputMode = "url" | "text";

function PastePage() {
  const navigate = useNavigate();

  // Input state
  const [mode,     setMode]     = useState<InputMode>("url");
  const [url,      setUrl]      = useState("");
  const [rawText,  setRawText]  = useState("");
  const [topic,    setTopic]    = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags,     setTags]     = useState<string[]>([]);

  // Flow state
  const [status,      setStatus]      = useState<"idle" | "processing" | "done" | "error">("idle");
  const [progress,    setProgress]    = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [result,      setResult]      = useState<Story | null>(null);
  const [errorMsg,    setErrorMsg]    = useState("");

  // ── Tag helpers ──────────────────────────────────────────────────────────
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput("");
  };
  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t));

  // ── Paste from clipboard ─────────────────────────────────────────────────
  const onPaste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      if (mode === "url") setUrl(t);
      else setRawText(t);
    } catch {/* ignore */}
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasInput = mode === "url" ? url.trim() : rawText.trim();
    if (!hasInput) return;

    setStatus("processing");
    setProgress(0);
    setProgressMsg("Starting...");
    setResult(null);
    setErrorMsg("");

    try {
      const body: Record<string, unknown> = { tags };
      if (mode === "url")  body.url  = url.trim();
      else                 body.text = rawText.trim();
      if (topic.trim())    body.topic = topic.trim();

      const res = await fetch(`${API_BASE}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Request failed" }));
        throw new Error(err.detail ?? "Request failed");
      }

      const data: Story = await res.json();
      setResult(data);
      setStatus("done");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setStatus("error");
    }
  };

  const reset = () => {
    setStatus("idle");
    setUrl("");
    setRawText("");
    setTopic("");
    setTags([]);
    setTagInput("");
    setResult(null);
    setErrorMsg("");
    setStep(0);
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <TopBar />

      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[10%] w-64 h-80 glass rounded-3xl opacity-10 blur-[1px]" />
        <motion.div animate={{ y: [0, 30, 0], rotate: [0, -5, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] w-72 h-96 glass rounded-[3rem] opacity-5 blur-[2px]" />
      </div>

      <main className="flex-1 mx-auto max-w-3xl px-6 py-16 w-full relative z-10">
        <AnimatePresence mode="wait">

          {/* ── IDLE ─────────────────────────────────────────────────────── */}
          {status === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }} transition={{ duration: 0.7 }}>

              {/* Header */}
              <div className="text-center mb-10">
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 bg-bronze/10 px-4 py-1.5 rounded-full mb-6 border border-bronze/20">
                  <BrainCircuit className="h-4 w-4 text-bronze" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-bronze">Neural Processing</span>
                </motion.div>
                <h1 className="font-display text-5xl md:text-7xl font-black tracking-tighter text-espresso-deep leading-[0.9]">
                  Paste it.<br />
                  <span className="text-bronze italic">Read it.</span>
                </h1>
                <p className="mt-4 text-muted-foreground text-base opacity-70">
                  URL or raw text — we'll turn it into a 90-second brief.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Mode toggle */}
                <div className="flex gap-2 p-1 bg-cream-deep/40 rounded-2xl w-fit mx-auto">
                  {(["url", "text"] as InputMode[]).map(m => (
                    <button key={m} type="button" onClick={() => setMode(m)}
                      className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        mode === m ? "bg-espresso-mid text-cream-light shadow-md" : "text-muted-foreground hover:text-espresso-mid"
                      }`}>
                      {m === "url" ? <Link2 className="h-3.5 w-3.5" /> : <FileText className="h-3.5 w-3.5" />}
                      {m === "url" ? "URL" : "Paste Text"}
                    </button>
                  ))}
                </div>

                {/* URL input */}
                {mode === "url" && (
                  <div className="glass rounded-[2rem] p-4 flex items-center gap-3 cinematic-shadow group focus-within:ring-2 focus-within:ring-bronze/30">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-espresso-mid text-cream-light shadow-lg shrink-0">
                      <Link2 className="h-7 w-7" />
                    </div>
                    <input value={url} onChange={e => setUrl(e.target.value)} type="url"
                      placeholder="https://newsletter.example.com/latest-issue"
                      className="flex-1 bg-transparent outline-none text-lg placeholder:text-muted-foreground/30 px-2 font-medium text-espresso-mid" />
                    <button type="button" onClick={onPaste}
                      className="hidden sm:flex items-center gap-2 rounded-2xl bg-secondary border border-border px-5 py-3 text-xs font-black uppercase tracking-widest text-espresso-mid hover:bg-muted transition-all">
                      <ClipboardPaste className="h-4 w-4" /> Paste
                    </button>
                  </div>
                )}

                {/* Raw text input */}
                {mode === "text" && (
                  <div className="glass rounded-[2rem] p-5 cinematic-shadow group focus-within:ring-2 focus-within:ring-bronze/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-bronze" />
                        <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Newsletter Text</span>
                      </div>
                      <button type="button" onClick={onPaste}
                        className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-bronze hover:text-espresso-mid transition-colors">
                        <ClipboardPaste className="h-3.5 w-3.5" /> Paste
                      </button>
                    </div>
                    <textarea value={rawText} onChange={e => setRawText(e.target.value)} rows={7}
                      placeholder="Paste your newsletter content here — the full text you copied from your email or article..."
                      className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground/30 font-medium text-espresso-mid resize-none leading-relaxed" />
                    {rawText && (
                      <p className="text-[10px] text-muted-foreground opacity-50 mt-2 text-right">
                        {rawText.length} chars
                      </p>
                    )}
                  </div>
                )}

                {/* Topic input */}
                <div className="glass rounded-2xl p-4 flex items-center gap-3 cinematic-shadow group focus-within:ring-2 focus-within:ring-bronze/30">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-bronze/10 text-bronze shrink-0">
                    <Target className="h-5 w-5" />
                  </div>
                  <input value={topic} onChange={e => setTopic(e.target.value)}
                    placeholder="Your interest topic (optional) — e.g. AI, startup funding, climate..."
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/30 font-medium text-espresso-mid" />
                </div>

                {/* Tags input */}
                <div className="glass rounded-2xl p-4 cinematic-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-bronze/10 text-bronze shrink-0">
                      <Tag className="h-5 w-5" />
                    </div>
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                      placeholder="Add tags — press Enter (e.g. ai, finance, health)"
                      className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground/30 font-medium text-espresso-mid" />
                    {tagInput && (
                      <button type="button" onClick={addTag}
                        className="text-[10px] font-black uppercase tracking-widest text-bronze hover:text-espresso-mid transition-colors">
                        Add
                      </button>
                    )}
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pl-[52px]">
                      {tags.map(t => (
                        <span key={t} className="flex items-center gap-1.5 rounded-full bg-bronze/10 text-bronze text-[10px] font-black px-3 py-1 border border-bronze/20">
                          #{t}
                          <button type="button" onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors">
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button type="submit"
                  disabled={mode === "url" ? !url.trim() : !rawText.trim()}
                  className="w-full flex items-center justify-center gap-3 rounded-2xl bg-espresso-mid text-cream-light py-5 font-black uppercase tracking-widest text-sm hover:bg-bronze transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed">
                  <Sparkles className="h-5 w-5" />
                  Brew It
                  <ArrowRight className="h-5 w-5" />
                </button>

              </form>
            </motion.div>
          )}

          {/* ── PROCESSING ───────────────────────────────────────────────── */}
          {status === "processing" && (
            <motion.div key="processing" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }} className="text-center py-24">
              <div className="relative mx-auto w-24 h-24 mb-12">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-bronze/20 border-t-bronze" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-bronze animate-spin" />
                </div>
              </div>
              <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className="text-xl font-display font-bold text-espresso-mid mb-4">
                {progressMsg}
              </motion.p>
              <div className="max-w-xs mx-auto h-2 bg-espresso-deep/5 rounded-full overflow-hidden border border-espresso-deep/5 flex items-center justify-between px-1 relative">
                <motion.div initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="absolute left-0 h-full bg-bronze transition-all duration-300 shadow-[0_0_10px_rgba(182,141,64,0.4)]" />
              </div>
              <p className="mt-4 text-xs font-black text-bronze uppercase tracking-[0.2em]">{progress}% Complete</p>
              {topic && (
                <p className="mt-6 text-sm text-muted-foreground opacity-60">
                  Targeting <strong className="text-bronze">"{topic}"</strong>...
                </p>
              )}
            </motion.div>
          )}

          {/* ── ERROR ────────────────────────────────────────────────────── */}
          {status === "error" && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto glass-card rounded-[3rem] p-12 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-8 flex items-center justify-center">
                <AlertCircle className="h-10 w-10 text-red-500" />
              </div>
              <h2 className="font-display text-3xl font-bold text-espresso-deep mb-3">Brew Failed.</h2>
              <p className="text-muted-foreground mb-8">{errorMsg}</p>
              <button onClick={reset}
                className="px-8 py-4 rounded-2xl bg-espresso-mid text-cream-light font-black uppercase tracking-widest text-xs hover:bg-espresso-deep transition-all shadow-lg">
                Try Again
              </button>
            </motion.div>
          )}

          {/* ── DONE ─────────────────────────────────────────────────────── */}
          {status === "done" && result && (
            <motion.div key="done" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="max-w-2xl mx-auto w-full">

              {/* Success header */}
              <div className="flex items-center gap-4 mb-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 12 }}
                  className="w-14 h-14 bg-bronze rounded-full flex items-center justify-center shadow-lg shadow-bronze/20 shrink-0">
                  <CheckCircle2 className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <h2 className="font-display text-3xl font-bold text-espresso-deep">Brew Complete.</h2>
                  {result.url !== "pasted-text" && (
                    <p className="text-muted-foreground text-sm mt-1 truncate max-w-xs opacity-60">{result.url}</p>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-[2.5rem] p-8 space-y-6">

                {/* Title */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-bronze mb-2">Title</p>
                  <h3 className="font-display text-2xl font-bold text-espresso-deep leading-snug">{result.title}</h3>
                </div>

                {/* Badges row */}
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 rounded-full bg-bronze/10 text-bronze text-[10px] font-black px-3 py-1 uppercase tracking-[0.15em] border border-bronze/10">
                    <Tag className="h-3 w-3" />{result.category}
                  </span>
                  <span className={`flex items-center gap-1.5 rounded-full text-[10px] font-black px-3 py-1 uppercase tracking-[0.15em] border ${sentimentColor[result.sentiment] ?? sentimentColor.Neutral}`}>
                    <Smile className="h-3 w-3" />{result.sentiment}
                  </span>
                  {result.tags?.map(t => (
                    <span key={t} className="rounded-full bg-espresso-mid/10 text-espresso-mid text-[10px] font-black px-3 py-1 uppercase tracking-[0.15em] border border-espresso-mid/10">
                      #{t}
                    </span>
                  ))}
                </div>

                {/* Topic relevance */}
                {result.topic && (
                  <div className={`rounded-2xl border px-4 py-3 ${
                    result.relevant_to_topic === "Yes"
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-stone-50 border-stone-200"
                  }`}>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-1.5 text-muted-foreground">
                      <Target className="h-3 w-3" /> Topic: {result.topic}
                    </p>
                    {result.relevant_to_topic === "Yes" ? (
                      <>
                        <p className="text-xs font-bold text-emerald-700 mb-2">✓ Relevant to your topic</p>
                        {result.relevant_sections && result.relevant_sections.length > 0 && (
                          <ul className="space-y-1.5">
                            {result.relevant_sections.map((s, i) => (
                              <li key={i} className="flex items-start gap-2 text-xs text-emerald-800">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />{s}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <p className="text-xs text-stone-500">Not directly relevant to this topic.</p>
                    )}
                  </div>
                )}

                {/* Summary */}
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2 flex items-center gap-1.5">
                    <MessageSquare className="h-3 w-3" /> Summary
                  </p>
                  <p className="text-espresso-mid leading-relaxed">{result.summary}</p>
                </div>

                {/* Key points */}
                {result.key_points?.length > 0 && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-3 flex items-center gap-1.5">
                      <List className="h-3 w-3" /> Key Points
                    </p>
                    <ul className="space-y-2">
                      {result.key_points.map((pt, i) => (
                        <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }} className="flex items-start gap-3 text-sm text-espresso-mid">
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-bronze shrink-0" />{pt}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button onClick={reset}
                  className="flex-1 px-6 py-4 rounded-2xl bg-secondary text-espresso-mid font-black uppercase tracking-widest text-xs hover:bg-muted transition-all">
                  Brew Another
                </button>
                <button onClick={() => navigate({ to: "/" })}
                  className="flex-1 px-6 py-4 rounded-2xl bg-espresso-mid text-cream-light font-black uppercase tracking-widest text-xs hover:bg-bronze transition-all shadow-lg">
                  View in Feed →
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <footer className="py-10 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-30">Clarity over Volume.</p>
      </footer>
    </div>
  );
}

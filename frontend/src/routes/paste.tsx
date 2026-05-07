import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Link2, Sparkles, ClipboardPaste, ArrowRight, Zap, Loader2, CheckCircle2, ShieldCheck, BrainCircuit } from "lucide-react";
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

const processingSteps = [
  "Analyzing structure...",
  "Detecting key insights...",
  "Reducing cognitive load...",
  "Building 90-second brief...",
  "Highlighting relevant sections...",
];

function PastePage() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "completed">("idle");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (status === "processing") {
      const interval = setInterval(() => {
        setStep((s) => {
          if (s >= processingSteps.length - 1) {
            clearInterval(interval);
            setTimeout(() => setStatus("completed"), 1000);
            return s;
          }
          return s + 1;
        });
      }, 1200);
      return () => clearInterval(interval);
    }
  }, [status]);

  const onPaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch {/* ignore */}
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <TopBar />

      {/* Cinematic Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] left-[10%] w-64 h-80 glass rounded-3xl opacity-10 border-bronze/20 blur-[1px]"
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] right-[10%] w-72 h-96 glass rounded-[3rem] opacity-5 border-bronze/10 blur-[2px]"
        />
      </div>

      <main className="flex-1 mx-auto max-w-4xl px-6 py-24 w-full relative z-10 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {status === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 bg-bronze/10 px-4 py-1.5 rounded-full mb-8 border border-bronze/20 shadow-inner"
              >
                <BrainCircuit className="h-4 w-4 text-bronze" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-bronze">Neural Processing</span>
              </motion.div>

              <div className="space-y-4 mb-12">
                <motion.h1 
                  className="font-display text-5xl md:text-8xl font-black tracking-tighter text-espresso-deep leading-[0.9]"
                >
                  {["Paste", "a", "link."].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.1, duration: 0.8 }}
                      className="inline-block mr-4"
                    >
                      {word}
                    </motion.span>
                  ))}
                  <br />
                  {["Read", "the", "story."].map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: 0.4 + i * 0.1, duration: 0.8 }}
                      className="inline-block mr-4 text-bronze italic"
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.h1>
              </div>

              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (url.trim()) setStatus("processing");
                }}
                className="max-w-3xl mx-auto relative group"
              >
                <div className="glass rounded-[2rem] p-4 flex items-center gap-4 cinematic-shadow transition-all duration-500 group-focus-within:ring-2 group-focus-within:ring-bronze/30 group-focus-within:bg-cream-light/80">
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-espresso-mid text-cream-light shadow-xl">
                    <Link2 className="h-8 w-8" />
                  </div>
                  <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    type="url"
                    placeholder="https://newsletter.example.com/latest-issue"
                    className="flex-1 bg-transparent outline-none text-xl placeholder:text-muted-foreground/30 px-2 font-medium text-espresso-mid"
                  />
                  <button
                    type="button"
                    onClick={onPaste}
                    className="hidden sm:flex items-center gap-2 rounded-2xl bg-secondary border border-border px-6 py-4 text-xs font-black uppercase tracking-widest text-espresso-mid hover:bg-muted transition-all magnetic-button"
                  >
                    <ClipboardPaste className="h-4 w-4" />
                    Paste
                  </button>
                  <button
                    type="submit"
                    className="grid h-16 w-16 place-items-center rounded-2xl bg-bronze text-white hover:scale-105 active:scale-95 transition-all shadow-lg group-hover:shadow-bronze/20"
                  >
                    <ArrowRight className="h-8 w-8" />
                  </button>
                </div>
              </motion.form>
            </motion.div>
          ) : status === "processing" ? (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
              className="text-center relative py-20"
            >
              {/* Particles/Insight collapse animation */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: (Math.random() - 0.5) * 600, 
                      y: (Math.random() - 0.5) * 600,
                      opacity: 0,
                      scale: 0.5
                    }}
                    animate={{ 
                      x: 0, 
                      y: 0,
                      opacity: [0, 0.4, 0],
                      scale: [0.5, 1, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: Math.random() * 2,
                      ease: "circIn"
                    }}
                    className="w-1 h-1 bg-bronze rounded-full"
                  />
                ))}
              </div>

              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="mx-auto w-24 h-24 rounded-full border-4 border-bronze/10 border-t-bronze relative mb-12 flex items-center justify-center"
              >
                <Zap className="h-10 w-10 text-bronze animate-pulse" />
              </motion.div>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={step}
                    initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                    className="text-xl font-display font-bold text-espresso-mid"
                  >
                    {processingSteps[step]}
                  </motion.p>
                </AnimatePresence>
                
                <div className="max-w-xs mx-auto h-1.5 bg-espresso-deep/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / processingSteps.length) * 100}%` }}
                    className="h-full bg-bronze"
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto glass-card rounded-[3rem] p-12 text-center"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-20 h-20 bg-bronze rounded-full mx-auto mb-8 flex items-center justify-center shadow-lg shadow-bronze/20"
              >
                <CheckCircle2 className="h-10 w-10 text-white" />
              </motion.div>
              
              <h2 className="font-display text-4xl font-bold text-espresso-deep mb-4">Brew Complete.</h2>
              <p className="text-muted-foreground mb-8 text-lg">We've distilled the content into a 90-second brief. It's now live in your feed.</p>
              
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setStatus("idle")}
                  className="px-8 py-4 rounded-2xl bg-secondary text-espresso-mid font-black uppercase tracking-widest text-xs hover:bg-muted transition-all"
                >
                  Brew Another
                </button>
                <button className="px-8 py-4 rounded-2xl bg-espresso-mid text-cream-light font-black uppercase tracking-widest text-xs hover:bg-espresso-deep transition-all shadow-lg">
                  View Feed
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-30">Clarity over Volume.</p>
      </footer>
    </div>
  );
}

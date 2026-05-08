import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Mail, Lock, Github, Sparkles, Zap, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Kairos — Entry" },
      { name: "description", content: "Enter the world of intentional information." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<"splash" | "auth">("splash");

  useEffect(() => {
    // Splash sequence: 3s show, 1.5s melt/transition
    const timer = setTimeout(() => {
      setStage("auth");
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-full bg-[#FCFAF7] overflow-hidden relative font-sans text-espresso-deep">
      
      {/* Isolated Cinematic Background - 3D Neural Motion */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-[#FCFAF7] isolate"
        style={{ perspective: "2000px" }}
      >
        
        {/* 3D Atmospheric Orbs - Espresso Tones */}
        <motion.div 
          animate={{ 
            rotateX: [0, 45, -45, 0],
            rotateY: [0, -45, 45, 0],
            z: [-800, -400, -800],
            scale: [1, 1.4, 0.8, 1],
          }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[15%] -left-[10%] w-[1000px] h-[1000px] bg-[#3B2A24]/[0.08] blur-[180px] rounded-full"
        />
        <motion.div 
          animate={{ 
            rotateX: [0, -60, 60, 0],
            rotateY: [0, 60, -60, 0],
            z: [-600, -1000, -600],
            scale: [1, 1.3, 1.1, 1],
          }} 
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[15%] -right-[10%] w-[1200px] h-[1200px] bg-[#3B2A24]/[0.06] blur-[200px] rounded-full"
        />

        {/* 3D Neural Particles - Swirling Signals */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ 
              x: Math.random() * 2000 - 500, 
              y: Math.random() * 2000 - 500,
              z: Math.random() * -800 - 200,
              opacity: Math.random() * 0.4 + 0.1,
            }}
            animate={{ 
              x: [null, Math.random() * 2000 - 500],
              y: [null, Math.random() * 2000 - 500],
              z: [null, Math.random() * -800 - 200],
              rotateX: [0, 360],
              rotateY: [0, 360],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{ 
              duration: Math.random() * 25 + 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute w-2 h-2 bg-[#3B2A24] rounded-full shadow-[0_0_15px_rgba(59,42,36,0.6)]"
            style={{ transformStyle: "preserve-3d" }}
          />
        ))}

        {/* 3D Glass Fragments - Geometric Volume in Distance */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={`frag-${i}`}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              z: Math.random() * -500 - 300 
            }}
            animate={{ 
              rotateX: [0, 180, 360],
              rotateY: [0, 180, 360],
              rotateZ: [0, 90, 0],
              z: [-600, -300, -600],
              opacity: [0.03, 0.12, 0.03]
            }}
            transition={{ 
              duration: Math.random() * 20 + 20, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 2
            }}
            className="absolute glass-card w-48 h-48 rounded-[3rem] border border-[#3B2A24]/20 shadow-2xl"
            style={{ transformStyle: "preserve-3d" }}
          />
        ))}

        {/* Cinematic Neural Fog (Depth) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FCFAF7]/60 via-transparent to-[#FCFAF7]/60 pointer-events-none" />
      </div>

      <AnimatePresence mode="wait">
        {stage === "splash" ? (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              filter: "blur(60px) contrast(300%) brightness(1.5)",
              y: 200,
              scale: 1.1,
              transition: { duration: 2.5, ease: [0.76, 0, 0.24, 1] }
            }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FCFAF7]/40 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="text-center relative z-10"
            >
              <div className="relative mb-10">
                <motion.h1 
                  initial={{ letterSpacing: "1em", opacity: 0 }}
                  animate={{ letterSpacing: "0.2em", opacity: 1 }}
                  transition={{ duration: 2.5, ease: "circOut" }}
                  className="text-9xl font-display font-black tracking-[0.2em] text-[#3B2A24] glass-text-hero"
                >
                  KAIROS
                </motion.h1>
                <motion.div 
                  exit={{ y: 50, opacity: 0, filter: "blur(20px)" }}
                  transition={{ duration: 2 }}
                  className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-full -z-10 scale-150 opacity-50" 
                />
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                transition={{ delay: 1.5, duration: 2 }}
                className="text-xl font-bold tracking-[0.6em] uppercase text-[#3B2A24]"
              >
                Reading the right thing at the right moment
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, scale: 0.85, filter: "blur(30px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="flex h-full w-full relative z-10 p-10 md:p-16 gap-10"
          >
            {/* Left Side: Auth Portal */}
            <div className="w-full lg:w-[45%] h-full flex items-center justify-center">
              <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.2, delay: 0.5 }}
                className="glass-card-portal rounded-[4rem] p-16 md:p-20 w-full max-w-2xl border border-white/40 shadow-[0_40px_80px_rgba(59,42,36,0.08)] relative overflow-hidden bg-white/40 backdrop-blur-2xl"
              >
                {/* Subtle highlight */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                
                <div className="flex items-center gap-5 mb-16">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-[#2A1A08] shadow-2xl overflow-hidden">
                    <svg viewBox="0 0 100 100" fill="none" className="h-10 w-10">
                      <polygon points="24,20 36,20 36,80 24,80" fill="#F5F0DC" />
                      <polygon points="36,50 36,20 70,20 56,50" fill="#F5F0DC" />
                      <polygon points="36,50 56,50 74,80 60,80" fill="#F5F0DC" />
                      <polygon points="36,44 52,44 44,50 36,56" fill="#2A1A08" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-display font-black tracking-tighter text-[#3B2A24] uppercase">KAIROS</h2>
                </div>

                <div className="mb-14">
                  <h3 className="text-6xl font-display font-black tracking-tight text-[#3B2A24] mb-5 leading-[0.9]">Welcome Back.</h3>
                  <p className="text-[#3B2A24]/60 text-lg font-medium opacity-60">Join the circle of intentional intelligence.</p>
                </div>

                <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/" }); }}>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.5em] text-[#3B2A24] opacity-30 ml-2">Identity Signature</label>
                    <div className="glass-input rounded-3xl p-6 flex items-center gap-5 border border-white/40 focus-within:border-[#3B2A24]/30 transition-all shadow-inner bg-[#FCFAF7]/40 backdrop-blur-xl">
                      <Mail className="h-6 w-6 text-[#3B2A24]/20" />
                      <input 
                        type="email" 
                        placeholder="curator@kairos.ai" 
                        className="bg-transparent outline-none flex-1 font-bold text-[#3B2A24] placeholder:text-[#3B2A24]/10 text-lg"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[11px] font-black uppercase tracking-[0.5em] text-[#3B2A24] opacity-30 ml-2">Secret Protocol</label>
                    <div className="glass-input rounded-3xl p-6 flex items-center gap-5 border border-white/40 focus-within:border-[#3B2A24]/30 transition-all shadow-inner bg-[#FCFAF7]/40 backdrop-blur-xl">
                      <Lock className="h-6 w-6 text-[#3B2A24]/20" />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="bg-transparent outline-none flex-1 font-bold text-[#3B2A24] placeholder:text-[#3B2A24]/10 text-lg"
                      />
                    </div>
                  </div>

                  <button className="w-full h-20 rounded-3xl bg-[#3B2A24] text-[#FCFAF7] font-black uppercase tracking-[0.3em] text-xs hover:shadow-3xl hover:-translate-y-1.5 transition-all flex items-center justify-center gap-5 group relative overflow-hidden shadow-2xl">
                    <span className="relative z-10">Access Dashboard</span>
                    <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-3 transition-transform" />
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>

                  <div className="relative py-6 flex items-center gap-6">
                    <div className="h-px flex-1 bg-[#3B2A24]/10" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#3B2A24]/20">or bridge with</span>
                    <div className="h-px flex-1 bg-[#3B2A24]/10" />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <button className="h-16 rounded-2xl border border-white/60 bg-white/20 backdrop-blur-lg flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-widest text-[#3B2A24] hover:bg-white hover:shadow-xl transition-all">
                      <Github className="h-5 w-5" /> Github
                    </button>
                    <button className="h-16 rounded-2xl border border-white/60 bg-white/20 backdrop-blur-lg flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-widest text-[#3B2A24] hover:bg-white hover:shadow-xl transition-all">
                      <Sparkles className="h-5 w-5" /> Google
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>

            {/* Right Side: Cinematic Launch Film Area */}
            <div className="hidden lg:block flex-1 h-full">
              <motion.div 
                initial={{ x: 60, opacity: 0, scale: 0.95 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.7, ease: "circOut" }}
                className="h-full w-full rounded-[4rem] overflow-hidden relative shadow-3xl border-[12px] border-white/30 bg-espresso-deep/5 backdrop-blur-sm group"
              >
                {/* Cinematic Launch Film Video - Gemini Generated Official Version */}
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  preload="auto"
                  poster="/splash_poster.png"
                  className="absolute inset-0 h-full w-full object-cover scale-105"
                >
                  <source src="https://lh3.googleusercontent.com/gg/AEir0wImf-fc5cBwBnQBROIFiiVu_hqYlTmt4rFVeZ4Yy1jCpj-a-tA0pLuBwi8O3f7NIcMCzkmrWFj9DRD7gpfsA5OEPlBCfvdHYiEcqAnOZ7-dOpp7_UZrMvK0KVx3eBRl3bEgVSJrDleVcH4W0tVi8vIJXT6lmcFkX44EACzvfUSbmnNoyN6J=mm,22,18,15" type="video/mp4" />
                </video>
                
                {/* 35mm Film Treatment Overlay */}
                <div className="absolute inset-0 bg-espresso-deep/20 backdrop-blur-[1px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/80 via-espresso-deep/20 to-transparent" />
                <div className="absolute inset-0 ring-inset ring-[1px] ring-white/10" />

                {/* Director's Cut Badge */}
                <div className="absolute top-12 left-12 flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-[9px] font-black uppercase tracking-[0.3em] text-white/60">
                    Director's Cut
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">REC</span>
                  </div>
                </div>

                <div className="absolute bottom-20 left-20 right-20">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="flex items-center gap-4 mb-8"
                  >
                    <div className="h-px w-24 bg-white/40" />
                    <span className="text-[12px] font-black uppercase tracking-[0.6em] text-white/80">Launch Film</span>
                  </motion.div>

                  <h4 className="text-7xl font-display font-black text-white tracking-tighter leading-[0.85] mb-10">
                    Transform <br />
                    Noise into <br />
                    <span className="italic font-medium text-white/40">Intelligence.</span>
                  </h4>

                  <div className="flex items-center gap-16">
                    <div className="flex flex-col gap-2">
                      <span className="text-4xl font-display font-black text-white">90s</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Distillation Speed</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-4xl font-display font-black text-white">100%</span>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Local Privacy</span>
                    </div>
                  </div>
                </div>

                {/* Play/View Storyboard Button Overlay on Hover */}
                <div className="absolute inset-0 bg-espresso-deep/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-20 w-20 rounded-full border border-white/20 bg-white/10 backdrop-blur-xl flex items-center justify-center">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/80">Experience the Vision</span>
                  </div>
                </div>

              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .glass-text {
          background: linear-gradient(135deg, #3B2A24 0%, #B08968 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 10px 20px rgba(59, 42, 36, 0.1));
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
}

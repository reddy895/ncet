import { createFileRoute } from "@tanstack/react-router";
import { Settings, Bookmark, User, Mail, Newspaper, ChevronRight, Zap, ShieldCheck, CreditCard } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { motion } from "framer-motion";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Your Profile — Brewed" },
      { name: "description", content: "Manage your professional knowledge stream." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="min-h-screen relative flex flex-col">
      <TopBar />

      <main className="flex-1 px-12 md:px-20 py-24 w-full relative z-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="h-5 w-5 text-espresso-deep animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-espresso-deep opacity-40">Identity Verified & Secured</span>
            </div>
            <h1 className="font-display text-7xl md:text-9xl font-black tracking-tighter text-espresso-deep leading-[0.8] mb-6">Profile.</h1>
            <p className="text-espresso-mid text-xl font-medium opacity-50 max-w-2xl leading-relaxed">Architecting your intentional information stream and professional identity.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <button className="glass rounded-[2.5rem] px-10 py-5 text-[12px] font-black uppercase tracking-[0.2em] text-espresso-mid hover:bg-cream-light hover:shadow-xl transition-all active:scale-95">
              Sync Neural Account
            </button>
            <button className="grid h-16 w-16 place-items-center rounded-[2rem] bg-espresso-deep text-cream-light hover:scale-110 active:scale-90 transition-all shadow-2xl">
              <Settings className="h-6 w-6" />
            </button>
          </motion.div>
        </header>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            {/* Account Card */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-[3rem] p-10 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="h-32 w-32 text-espresso-deep" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-espresso-deep mb-8">Neural Integration</h2>
              <ul className="space-y-6 mb-10">
                {[
                  { icon: User, text: "Personalized professional news feed", detail: "Synchronized across all desktop devices" },
                  { icon: Bookmark, text: "Cross-device curation state", detail: "End-to-end encrypted archive" },
                  { icon: Mail, text: "Direct newsletter extraction", detail: "Auto-distill incoming information" },
                ].map((item, i) => (
                  <li key={i} className="flex gap-5 items-start">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-bronze/10 text-bronze shadow-inner">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-espresso-mid font-bold leading-tight">{item.text}</span>
                      <span className="block text-xs text-muted-foreground mt-1 font-medium opacity-60">{item.detail}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-2xl bg-espresso-mid text-cream-light py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-espresso-deep hover:shadow-2xl transition-all active:scale-[0.98] cinematic-shadow">
                Activate Professional Tier
              </button>
            </motion.section>

            {/* Archive Section */}
            <motion.section 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-card rounded-[3rem] p-10"
            >
              <div className="flex items-baseline justify-between border-b border-espresso-deep/5 pb-8 mb-10">
                <h2 className="font-display text-3xl font-bold text-espresso-deep">The Archive.</h2>
                <button className="text-[10px] font-black uppercase tracking-[0.2em] text-bronze hover:underline">Clear History</button>
              </div>
              <div className="text-center py-20 opacity-30">
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-cream-deep/50 border border-espresso-deep/5 mb-8">
                  <Bookmark className="h-10 w-10 text-espresso-deep" />
                </div>
                <p className="font-display text-2xl font-bold text-espresso-deep">Nothing distilled yet.</p>
                <p className="mt-4 text-muted-foreground max-w-sm mx-auto font-medium leading-relaxed">Your future insights will be preserved here in high-fidelity.</p>
              </div>
            </motion.section>
          </div>

          <div className="space-y-12">
            {/* Subscriptions */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card rounded-[3rem] p-8"
            >
              <div className="flex items-baseline justify-between border-b border-espresso-deep/5 pb-6 mb-8">
                <h2 className="text-xl font-display font-bold text-espresso-deep">Stream Sources.</h2>
                <button className="text-[9px] font-black uppercase tracking-[0.2em] text-bronze hover:underline">Settings</button>
              </div>
              <ul className="space-y-3">
                {[
                  { t: "Stratechery", d: "Tech Strategy", icon: Zap },
                  { t: "Morning Brew", d: "Business Daily", icon: Newspaper },
                  { t: "The Pragmatic Engineer", d: "Software Insights", icon: ShieldCheck },
                ].map((e) => (
                  <li key={e.t}>
                    <button className="w-full flex items-center justify-between rounded-2xl bg-cream-deep/20 border border-transparent p-4 hover:border-bronze/10 hover:bg-white transition-all group">
                      <div className="flex items-center gap-4 text-left">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-espresso-mid text-cream-light group-hover:scale-110 group-hover:bg-bronze transition-all">
                          <e.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="block font-bold text-espresso-mid text-sm">{e.t}</span>
                          <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5 opacity-60">{e.d}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground opacity-30 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                    </button>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full py-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-bronze transition-all border-t border-espresso-deep/5 pt-8">
                + Expand Information Stream
              </button>
            </motion.section>

            {/* Billing */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="glass rounded-[2.5rem] p-8 border-bronze/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-2 w-2 rounded-full bg-bronze animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-bronze">Premium Active</span>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-cream-deep">
                  <CreditCard className="h-5 w-5 text-espresso-deep" />
                </div>
                <div>
                  <p className="text-xs font-bold text-espresso-deep">Billing renews May 2026</p>
                  <p className="text-[10px] text-muted-foreground font-medium">Standard Subscription Plan</p>
                </div>
              </div>
              <button className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-espresso-deep transition-colors text-center border border-espresso-deep/10 rounded-xl py-3">
                Manage Billing
              </button>
            </motion.section>
          </div>
        </div>
      </main>

      <footer className="py-20 text-center opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground leading-relaxed">
          Brewed Professional Dashboard<br />
          Serial No: B-2026-X9
        </p>
      </footer>
    </div>
  );
}

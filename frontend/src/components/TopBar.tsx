import { Link, useLocation } from "@tanstack/react-router";
import { Settings, Bookmark, Mail, Newspaper, Sparkles, Star, Flame, Link2, Home, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Feed", Icon: Home },
  { to: "/paste", label: "Paste Link", Icon: Link2 },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

const tabs = [
  { label: "My News", Icon: Newspaper, tone: "bg-accent/15 text-accent" },
  { label: "My Emails", Icon: Mail, tone: "bg-cream text-espresso" },
  { label: "Top Stories", Icon: Star, tone: "bg-cream-soft text-espresso" },
  { label: "Trending", Icon: Flame, tone: "bg-accent text-cream" },
];

import { useState, useEffect } from "react";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "framer-motion";

export function TopBar() {
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Only show the navbar at the absolute top of the page
    if (latest <= 10) {
      setHidden(false);
    } else {
      setHidden(true);
    }
  });

  return (
    <motion.header 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: -100, opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-4 z-50 mx-auto max-w-5xl px-4 pointer-events-none"
    >
      <div className="glass rounded-full px-6 py-3 flex items-center justify-between pointer-events-auto cinematic-shadow transition-all duration-500 hover:scale-[1.01]">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-espresso-mid text-cream-light shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-12">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-xl font-bold leading-none tracking-tight text-espresso-mid">Brewed</p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground mt-0.5 font-bold opacity-70">Knowledge Distilled</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-6">
          {navItems.map(({ to, label, Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-2 px-3 py-1.5 text-xs font-bold transition-all hover:text-bronze ${
                  active ? "text-bronze" : "text-muted-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
                {active && (
                  <motion.span 
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-bronze" 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/profile" className="hidden lg:flex items-center gap-2 rounded-full bg-espresso-mid px-4 py-2 text-[11px] font-black text-cream-light hover:bg-espresso-deep transition-all shadow-md active:scale-95">
            <Bookmark className="h-3.5 w-3.5" />
            Saved
          </Link>
          <button className="grid h-9 w-9 place-items-center rounded-full bg-secondary border border-border hover:bg-muted transition-all magnetic-button">
            <Settings className="h-4.5 w-4.5 text-espresso-mid" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {!hidden && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 flex gap-2 overflow-x-auto no-scrollbar py-2 pointer-events-auto"
          >
            {tabs.map(({ label, Icon, tone }, i) => (
              <button
                key={label}
                className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-1.5 text-[10px] font-black tracking-wider uppercase transition-all hover:shadow-md ${tone} border border-transparent hover:border-bronze/20 active:scale-95`}
              >
                <Icon className="h-3 w-3" />
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

import { Link, useLocation } from "@tanstack/react-router";
import { Settings, Mail, Link2, Home, User } from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { to: "/",        label: "Feed",      Icon: Home  },
  { to: "/emails",  label: "Emails",    Icon: Mail  },
  { to: "/paste",   label: "Brew",      Icon: Link2 },
  { to: "/profile", label: "Profile",   Icon: User  },
] as const;

export function TopBar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-espresso-deep/5 bg-[#F7F3EE]/40 backdrop-blur-3xl">
      <div className="px-12 md:px-20 h-28 flex items-center justify-between gap-12">
 
        {/* Logo - Expansive */}
        <Link to="/" className="flex items-center gap-5 shrink-0 group">
          <div className="relative grid h-14 w-14 place-items-center">
            {/* Kairos K-mark logo — circle */}
            <svg viewBox="0 0 100 100" fill="none" className="h-14 w-14 transform group-hover:scale-105 transition-transform duration-500">
              <circle cx="50" cy="50" r="50" fill="#2A1A08" />
              {/* Left vertical bar */}
              <polygon points="24,20 36,20 36,80 24,80" fill="#F5F0DC" />
              {/* Upper arm */}
              <polygon points="36,50 36,20 70,20 56,50" fill="#F5F0DC" />
              {/* Lower arm */}
              <polygon points="36,50 56,50 74,80 60,80" fill="#F5F0DC" />
              {/* Inner notch */}
              <polygon points="36,44 52,44 44,50 36,56" fill="#2A1A08" />
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-3xl font-black tracking-tighter text-espresso-deep uppercase">KAIROS</p>
            <p className="text-[10px] font-bold text-espresso-deep opacity-40 tracking-wide">
              Reading the right thing at the right moment.
            </p>
          </div>
        </Link>
 
        {/* Nav - Large & Professional */}
        <nav className="flex items-center gap-4 bg-espresso-deep/5 p-1.5 rounded-[2rem] border border-espresso-deep/5 shadow-inner">
          {navItems.map(({ to, label, Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  active
                    ? "text-cream-light"
                    : "text-espresso-deep opacity-40 hover:opacity-100 hover:bg-white"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={active ? 3 : 2} />
                <span className="hidden lg:inline">{label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-[1.5rem] bg-espresso-deep -z-10 shadow-xl"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
 
        {/* Right - Profile/Settings */}
        <div className="flex items-center gap-4">
          <button className="grid h-14 w-14 place-items-center rounded-2xl bg-white border border-espresso-deep/5 text-espresso-deep hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95">
            <Settings className="h-6 w-6" strokeWidth={2.5} />
          </button>
        </div>
 
      </div>
    </header>
  );
}

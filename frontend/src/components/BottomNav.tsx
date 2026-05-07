import { Link, useLocation } from "@tanstack/react-router";
import { Link2, Home, User } from "lucide-react";

const items = [
  { to: "/paste", label: "Paste", Icon: Link2 },
  { to: "/", label: "Feed", Icon: Home },
  { to: "/profile", label: "Profile", Icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed left-0 inset-y-0 z-50 w-20 border-r border-border bg-primary text-primary-foreground backdrop-blur-md flex flex-col justify-center">
      <ul className="flex flex-col items-center gap-8 py-6">
        {items.map(({ to, label, Icon }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 text-[11px] font-medium transition-all ${
                  active ? "text-accent scale-110" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Icon className="h-6 w-6" strokeWidth={active ? 2.5 : 1.75} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

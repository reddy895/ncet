import { useEffect, useRef, useState } from "react";

export function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      setOffset(Math.max(-40, Math.min(40, -center * 0.08)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={ref} className="relative h-72 overflow-hidden rounded-2xl bg-muted">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-[120%] w-full object-cover transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: `translateY(${offset}px) scale(1.05)` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-cream/40 via-transparent to-transparent" style={{ background: "linear-gradient(to top, oklch(0.97 0.025 85 / 0.45), transparent 50%)" }} />
    </div>
  );
}

import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bookmark, Share2, Sparkles, MessageSquare, Zap, ChevronUp, ChevronDown } from "lucide-react";
import { TopBar } from "@/components/TopBar";
import { ParallaxImage } from "@/components/ParallaxImage";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import news1 from "@/assets/news-1.jpg";
import news2 from "@/assets/news-2.jpg";
import news3 from "@/assets/news-3.jpg";
import news4 from "@/assets/news-4.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Brewed — knowledge Distilled" },
      { name: "description", content: "A calm intelligence layer between humans and information overload." },
    ],
  }),
  component: FeedPage,
});

type Story = {
  source: string;
  title: string;
  body: string;
  meta: string;
  image: string;
  tag: string;
};

const stories: Story[] = [
  {
    source: "Brewed Daily",
    tag: "Tech",
    title: "AI newsletters are quietly replacing the morning paper",
    body: "A new wave of curation tools turns hour-long reading lists into 60-second scrolls. Editors call it 'concise journalism' — concentrated and intentional.",
    meta: "2h ago · Brewed Editorial",
    image: news1,
  },
  {
    source: "City Wire",
    tag: "World",
    title: "Skylines glow as cities pilot 'golden hour' energy grids",
    body: "Five megacities are timing peak-load to sunset, cutting emissions by up to 12%. Residents say the warm light makes the savings feel earned.",
    meta: "4h ago · Reuters",
    image: news2,
  },
  {
    source: "The Slow Press",
    tag: "Culture",
    title: "Print is back — and it's reading like a novel again",
    body: "Long-form weeklies are out-selling daily tabloids for the first time in a decade. Readers say they want fewer notifications and more paragraphs.",
    meta: "Yesterday · The Slow Press",
    image: news3,
  },
  {
    source: "Brewed Markets",
    tag: "Finance",
    title: "Coffee futures hit a 9-year high as harvests dwindle",
    body: "Climate volatility in Brazil and Vietnam pushes Arabica prices past $4/lb. Roasters warn your morning latte is about to taste a lot more expensive.",
    meta: "6h ago · Bloomberg",
    image: news4,
  },
];

const floatingInsights = [
  "AI agents replacing workflows",
  "Memory is the next moat",
  "Open-source AI accelerating",
  "Synthesizing cognitive load",
];

function StoryCard({ s, index }: { s: Story; index: number }) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="group glass-card rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row h-full md:h-[22rem] relative isolate"
    >
      <div className="w-full md:w-[40%] h-56 md:h-full relative overflow-hidden">
        <ParallaxImage src={s.image} alt={s.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-deep/40 to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
      </div>
      
      <div className="flex-1 p-8 md:p-10 flex flex-col justify-between relative">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <motion.span 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="rounded-full bg-bronze/10 text-bronze text-[10px] font-black px-3 py-1 uppercase tracking-[0.15em] border border-bronze/10"
            >
              {s.tag}
            </motion.span>
            <span className="text-[11px] text-muted-foreground font-bold tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">{s.source}</span>
          </div>
          
          <h2 className="font-display text-2xl md:text-3xl font-bold leading-[1.1] text-espresso-mid group-hover:text-bronze transition-colors duration-500">
            {s.title}
          </h2>
          
          <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground line-clamp-2 md:line-clamp-3 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
            {s.body}
          </p>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-espresso-deep/5 pt-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-black opacity-60">{s.meta}</span>
          </div>
          
          <div className="flex gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-cream-deep/30 hover:bg-bronze hover:text-white transition-all duration-500 magnetic-button border border-transparent hover:border-bronze/20 shadow-sm">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-cream-deep/30 hover:bg-bronze hover:text-white transition-all duration-500 magnetic-button border border-transparent hover:border-bronze/20 shadow-sm">
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function FeedPage() {
  const { scrollYProgress } = useScroll();
  const [atBottom, setAtBottom] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100;
      const isAtTop = window.scrollY < 100;
      setAtBottom(isAtBottom);
      setAtTop(isAtTop);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollDown = () => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });

  return (
    <div className="relative isolate">
      <TopBar />
      
      <main className="relative z-10">
        {stories.map((s, i) => (
          <section key={i} className="snap-item w-full">
            <StoryCard s={s} index={i} />
          </section>
        ))}

        {/* Floating Scroll Controls */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-full p-2 flex items-center gap-2 cinematic-shadow border border-white/20"
          >
            <AnimatePresence mode="wait">
              {!atTop && (
                <motion.button
                  key="up"
                  initial={{ opacity: 0, scale: 0.8, x: 10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 10 }}
                  onClick={scrollToTop}
                  className="grid h-12 w-12 place-items-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-espresso-mid hover:bg-white/40 transition-all magnetic-button"
                >
                  <ChevronUp className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!atBottom && (
                <motion.button
                  key="down"
                  initial={{ opacity: 0, scale: 0.8, x: -10 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: -10 }}
                  onClick={scrollDown}
                  className="grid h-12 w-12 place-items-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-espresso-mid hover:bg-white/40 transition-all magnetic-button"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Floating Insights */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {floatingInsights.map((text, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{ 
                opacity: [0, 0.1, 0.1, 0],
                y: [100, -200],
                x: [0, (i % 2 === 0 ? 50 : -50)]
              }}
              transition={{ 
                duration: 20 + i * 5, 
                repeat: Infinity, 
                ease: "linear",
                delay: i * 4 
              }}
              style={{
                position: 'absolute',
                left: `${15 + i * 20}%`,
                top: '60%',
              }}
              className="text-[10px] font-black uppercase tracking-[0.5em] text-espresso-mid whitespace-nowrap"
            >
              {text}
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

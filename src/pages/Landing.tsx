import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue } from "framer-motion";
import { CursorFollower } from "@/components/CursorFollower";
import { MagneticButton } from "@/components/MagneticButton";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import {
  Plane, Smile, Palette, Shield, Zap, Headphones, ShoppingCart, ArrowRight,
  Phone, Mail, MapPin, ChevronDown, Lightbulb, ArrowRightIcon, Mic2, Globe,
  Settings2, ThumbsUp, ExternalLink
} from "lucide-react";
import { useTheme } from "next-themes";

/* ───── data ───── */

const FEATURES = [
  { icon: Plane, title: "Speedy Development", desc: "We did most of the heavy lifting for you to provide wonderful products that incorporate our custom components. Additionally, we always refrain time to bring the best experience working with us." },
  { icon: Smile, title: "User Experience", desc: "By utilizing problems and needs of Clients, we were able to create a framework that incorporates components and working that provide more feedback to users." },
  { icon: Palette, title: "Wonderful Designs", desc: "We did most of the heavy lifting for you to provide default stylings that incorporate our custom components." },
  { icon: Shield, title: "Data Security", desc: "We always provide detailed documentation as well as specific examples to help clients to get started. We are also always open to feedback and can answer any questions." },
  { icon: Zap, title: "Powered by Google", desc: "We always provide detailed documentation as well as specific examples to help clients to get started. We are also always open to feedback and can answer any questions." },
  { icon: Headphones, title: "Instant Support", desc: "It's easy to work with us — we provide support on chat, call, e-mail, Skype, Slack, TeamViewer etc." },
];

const PRODUCTS = [
  {
    title: "School Management System",
    tags: ["ERP", "Android", "Web"],
    desc: "An interactive easy-to-use management system that enhances school-to-institute/staff/parent/student communication by providing the latest information at their fingertips.",
    bullets: [
      "Smart tool for institutes — saves much of school's energy by automating tasks",
      "Even better for Parents/Students — keeping parents informed of all activities",
    ],
    link: "https://ameegolabs.com/eschool.html",
    linkLabel: "Learn More",
  },
  {
    title: "Chidya Udd Game",
    tags: ["Game", "Android"],
    desc: "Fun multiplayer game for all ages filled with fun, laughter, learning and excitement. An ideal multiplayer game requiring your aptitude on identifying flying and non-flying objects.",
    bullets: [
      "4 game modes: Classic, Deathmatch, Rapidfire and Custom",
      "Play with up to 5 people in multiplayer mode",
      "Add your own set of words for mind-blowing experience",
    ],
    link: "https://ameegolabs.com/",
    linkLabel: "Play Store",
  },
  {
    title: "Khabar Club",
    tags: ["News", "Android"],
    desc: "News in English, Hindi, Tamil, Malayalam, Kannada, Telugu, Marathi, Bangla, Gujarati, Urdu, Oriya & Punjabi from leading newspapers of India. Breaking news, daily videos, headlines & updates.",
    bullets: [],
    link: "https://play.google.com/store/apps/details?id=com.ameegolabs.khabarclub",
    linkLabel: "Play Store",
  },
  {
    title: "eCommerce Platform",
    tags: ["WordPress", "Web"],
    desc: "An e-commerce platform made for you. Whether you sell online, on social media, or in store — we have you covered.",
    bullets: [
      "ORDERS — List, Fulfill, or archive orders",
      "PRODUCTS — Add and edit products, variants, comments, reviews",
      "PAYMENTS — Accept payments instantly from Credit/Debit Card to PayPal to Netbanking",
    ],
    link: "http://www.theglam.in/",
    linkLabel: "View",
  },
  {
    title: "Inventory Control",
    tags: ["Inventory", "Billing", "Web", "Stock Management"],
    desc: "Inventory control is about knowing where all stock is and ensuring everything is accounted for at any given time. A computerized inventory system for managing and locating objects or materials.",
    bullets: [],
    link: "https://stock.ameegolabs.com/",
    linkLabel: "View",
  },
  {
    title: "ReviewMagic",
    tags: ["Google Business Profile", "Review Management", "AI Automation", "SaaS"],
    desc: "Google Business Profile management SaaS platform that helps schools, clinics, and local businesses manage reviews, automate replies using AI, and schedule posts.",
    bullets: [
      "Review Monitoring & Replies — Respond to all Google reviews from one place",
      "AI Auto Reply — Smart, policy-compliant automated responses",
      "Post Scheduling — Publish Google Business Profile posts on autopilot",
      "Multi-location Dashboard — Manage all your locations in one view",
    ],
    link: "https://reviewmagic.in/",
    linkLabel: "Visit ReviewMagic",
  },
  {
    title: "Real Estate Platform",
    tags: ["Property Posting", "Property Listing", "Admin Management"],
    desc: "Property Listing Software. Growing your real estate business and making it more profitable is very important. Get your property listing software for your business.",
    bullets: [],
    link: "https://nirmalaproperties.com/",
    linkLabel: "View",
  },
];

const SERVICES = [
  { icon: Globe, title: "Web Development", desc: "We create customized web-based applications enriched with UI/UX. The designs encourage customers to interact with you." },
  { icon: Zap, title: "App Development", desc: "By utilizing problems and needs of Clients, we create frameworks that incorporate components providing more feedback to users." },
  { icon: Palette, title: "Mobile & Web UI/UX", desc: "For better ROI we offer awesome design with effective usability — wireframe prototypes, interaction design, graphics, visuals, colors, layouts, typography." },
  { icon: Mic2, title: "Workshop, Training & Placement", desc: "We love to make this world a better place. Come and join us to create this world a wonderful place." },
  { icon: Settings2, title: "SEO & Digital Marketing", desc: "Utilizing client needs to create frameworks that incorporate components providing more feedback and visibility to users." },
  { icon: Lightbulb, title: "Graphics, Logo & Branding", desc: "Awesome design with effective usability — wireframe prototypes, interaction design, graphics, visuals, colors, layouts, typography." },
];

const PROCESS = ["Understand", "Consult", "Plan", "Implement", "Support"];

const WHY_US = [
  "Transparency",
  "Great Support",
  "Maximal Satisfaction",
  "Integrity and Reliability",
  "Non-Disclosure Agreement",
  "Multiple Engagement Models",
];

const CLIENTS = [
  { name: "Technowledge India", url: "http://technoledgeindia.com/" },
  { name: "Mudrika", url: "#" },
  { name: "Flora Water", url: "https://florawater.in/" },
  { name: "BMEF Colleges", url: "http://www.bmefcolleges.edu.in/" },
  { name: "Neocent Design", url: "#" },
  { name: "NomadsEdu", url: "#" },
  { name: "Lourdes Convent", url: "https://lourdesgzp.com/" },
  { name: "Mother Mariam", url: "#" },
  { name: "Imperial School", url: "#" },
  { name: "Exhort Montessori", url: "#" },
  { name: "Finatoz", url: "https://www.finatoz.com/" },
  { name: "Truelancer", url: "https://www.truelancer.com/" },
];

const TESTIMONIALS = [
  {
    name: "Sr. Alphonsa",
    role: "Principal",
    company: "Lourdes Convent",
    quote: "Right set of people knowing exactly what they are doing! Absolutely no second thoughts on doing business with them.",
  },
  {
    name: "Umair",
    role: "Lead Developer",
    company: "Accenture London UK",
    quote: "These guys know what they are doing!!! One of the technically competent fast growing group of professionals. Their turn around time vs quality of their products is top notch.",
  },
];

/* ───── Tilt card ───── */
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(py * -8);
    y.set(px * 8);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: x, rotateY: y, transformPerspective: 800 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ───── Spotlight card (cursor glow) ───── */
function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHover, setIsHover] = useState(false);

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      className={`relative overflow-hidden ${className}`}
    >
      {isHover && (
        <div
          className="pointer-events-none absolute -inset-px opacity-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, hsl(var(--primary) / 0.35), transparent 60%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

/* ───── Nav link with underline ───── */
function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="relative text-[13px] text-muted-foreground hover:text-foreground transition-colors py-1 group"
    >
      {label}
      <span className="absolute bottom-0 left-0 w-full h-px bg-foreground origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </a>
  );
}

/* ═════════ MAIN LANDING ═════════ */
const Landing = () => {
  const { theme, setTheme } = useTheme();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", query: "" });

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden cursor-none md:cursor-none">
      <CursorFollower />

      {/* ── NAV ── */}
      <nav className="fixed top-0 z-50 w-full backdrop-blur-xl bg-background/80 border-b border-border/50">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-3 group" data-cursor-hover>
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Lightbulb className="h-4 w-4 text-primary" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">Ameego Labs</span>
          </a>
          <div className="hidden md:flex items-center gap-6">
            <NavItem href="#products" label="Products" />
            <NavItem href="#services" label="Services" />
            <NavItem href="#reviewmagic" label="ReviewMagic" />
            <NavItem href="#clients" label="Clients" />
            <NavItem href="#contact" label="Contact" />
          </div>
          <div className="flex items-center gap-2">
            <MagneticButton strength={0.2}>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 flex items-center justify-center rounded-full border border-border hover:bg-accent transition-colors"
                data-cursor-hover
              >
                <span className="text-xs">{theme === "dark" ? "☀️" : "🌙"}</span>
              </button>
            </MagneticButton>
            <MagneticButton strength={0.2}>
              <a
                href="#contact"
                className="hidden sm:inline-flex h-9 px-4 items-center text-[13px] font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                data-cursor-hover
              >
                Get in Touch
              </a>
            </MagneticButton>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center justify-center pt-16 overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: "hsl(var(--primary))" }}
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
          style={{ background: "hsl(var(--primary))" }}
          animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/60 bg-card/50 backdrop-blur-sm mb-8 text-[12px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              Break through with Ameego Technology
            </div>
          </motion.div>
          <motion.h1
            className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.04em]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              AMEEGO LABS
            </span>
          </motion.h1>
          <motion.p
            className="mt-4 text-lg md:text-xl text-muted-foreground font-light tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            to infinity and beyond
          </motion.p>
          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <MagneticButton>
              <a
                href="#products"
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-[14px] font-medium bg-foreground text-background rounded-full hover:opacity-90 transition-opacity"
                data-cursor-hover
              >
                Explore Products
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </MagneticButton>
            <MagneticButton>
              <a
                href="#services"
                className="group inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-medium border border-border rounded-full hover:bg-accent transition-colors"
                data-cursor-hover
              >
                Our Services
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground/50" />
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Why choose us</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.03em] max-w-xl leading-tight">
              Everything you need to build great products
            </h2>
          </RevealOnScroll>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <RevealOnScroll key={f.title} delay={i * 0.08}>
                <SpotlightCard className="h-full rounded-xl border border-border bg-card p-7 hover:border-primary/30 transition-colors duration-300">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2">{f.title}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{f.desc}</p>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCTS ── */}
      <section id="products" className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Our Products</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.03em] max-w-xl leading-tight">
              Solutions that drive results
            </h2>
          </RevealOnScroll>
          <div className="mt-16 space-y-6">
            {PRODUCTS.map((p, i) => (
              <RevealOnScroll key={p.title} delay={0.05}>
                <TiltCard className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/20 transition-colors duration-500">
                  <div className="p-8 md:p-10 flex flex-col md:flex-row gap-6 md:gap-10">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {p.tags.map(t => (
                          <span key={t} className="text-[11px] px-2.5 py-0.5 rounded-full border border-border bg-accent/50 text-muted-foreground">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{p.title}</h3>
                      <p className="text-[13px] leading-relaxed text-muted-foreground mb-4">{p.desc}</p>
                      {p.bullets.length > 0 && (
                        <ul className="space-y-2">
                          {p.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-2 text-[13px] text-muted-foreground">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="flex items-end md:items-center shrink-0">
                      <MagneticButton as="a" href={p.link} strength={0.25}>
                        <span className="inline-flex items-center gap-2 text-[13px] font-medium text-primary hover:underline" data-cursor-hover>
                          {p.linkLabel}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </span>
                      </MagneticButton>
                    </div>
                  </div>
                </TiltCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-24 px-6 border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Services</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.03em] max-w-xl leading-tight">
              We offer IT-enabled business solutions
            </h2>
            <p className="mt-4 text-[15px] text-muted-foreground max-w-lg">
              A complete range of services to help you grow
            </p>
          </RevealOnScroll>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <RevealOnScroll key={s.title} delay={i * 0.08}>
                <SpotlightCard className="h-full rounded-xl border border-border bg-background p-7 hover:border-primary/30 transition-colors duration-300">
                  <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-[15px] font-semibold mb-2">{s.title}</h3>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
                </SpotlightCard>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-7xl">
          <RevealOnScroll>
            <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-medium mb-3">How we do it</p>
            <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.03em] max-w-xl leading-tight">
              Our proven process
            </h2>
            <p className="mt-4 text-[15px] text-muted-foreground max-w-2xl">
              We strive to provide clients with a solution that works best for them. They experience complete transparency in the entire process as they are in direct contact with the team.
            </p>
          </RevealOnScroll>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            {PROCESS.map((step, i) => (
              <RevealOnScroll key={step} delay={i * 0.1} direction="none">
                <div className="flex items-center gap-4">
                  <MagneticButton>
                    <div className="flex flex-col items-center gap-3 group" data-cursor-hover>
                      <div className="h-16 w-16 rounded-2xl border border-border bg-card flex items-center justify-center text-xl font-bold text-primary group-hover:bg-primary/10 group-hover:border-primary/30 transition-colors duration-300">
                        {i + 1}
                      </div>
                      <span className="text-[13px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        {step}
                      </span>
                    </div>
                  </MagneticButton>
                  {i < PROCESS.length - 1 && (
                    <ArrowRightIcon className="h-4 w-4 text-border hidden sm:block" />
                  )}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-24 px-6 border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16">
            <RevealOnScroll direction="left">
              <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Why clients love us</p>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.03em] leading-tight mb-8">
                Built on trust &<br />delivered with excellence
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {WHY_US.map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border/50 bg-background"
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  >
                    <ThumbsUp className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-[13px]">{item}</span>
                  </motion.div>
                ))}
              </div>
            </RevealOnScroll>
            <RevealOnScroll direction="right">
              <div className="flex flex-col justify-center">
                <div className="space-y-6">
                  {TESTIMONIALS.map((t, i) => (
                    <TiltCard key={i} className="p-6 rounded-xl border border-border bg-background">
                      <p className="text-[14px] leading-relaxed text-foreground/85 italic mb-4">
                        "{t.quote}"
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-[12px] font-bold text-primary">
                          {t.name[0]}
                        </div>
                        <div>
                          <span className="text-[13px] font-medium block">{t.name}</span>
                          <span className="text-[11px] text-muted-foreground">{t.role}, {t.company}</span>
                        </div>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section id="clients" className="py-24 px-6 border-t border-border/50">
        <div className="mx-auto max-w-7xl text-center">
          <RevealOnScroll>
            <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Clients & Partners</p>
            <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-[-0.03em]">
              Trusted by leading organizations
            </h2>
          </RevealOnScroll>
          <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {CLIENTS.map((c, i) => (
              <RevealOnScroll key={c.name} delay={i * 0.04} direction="none">
                <MagneticButton as="a" href={c.url !== "#" ? c.url : undefined} strength={0.15}>
                  <div
                    className="h-20 rounded-xl border border-border bg-card flex items-center justify-center px-4 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    data-cursor-hover
                  >
                    <span className="text-[12px] font-medium text-muted-foreground text-center leading-tight">
                      {c.name}
                    </span>
                  </div>
                </MagneticButton>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 px-6 border-t border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16">
            <RevealOnScroll direction="left">
              <p className="text-[12px] uppercase tracking-[0.2em] text-primary font-medium mb-3">Contact Us</p>
              <h2 className="text-[clamp(1.8rem,3.5vw,2.8rem)] font-semibold tracking-[-0.03em] leading-tight mb-8">
                Let's build something<br />great together
              </h2>
              <div className="space-y-5">
                <div>
                  <h4 className="text-[13px] font-medium mb-1">Registered Office</h4>
                  <p className="text-[13px] text-muted-foreground flex items-start gap-2">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    Ward No. 23, Town Hall, Ghazipur, Uttar Pradesh, India, 233001
                  </p>
                </div>
                <div>
                  <h4 className="text-[13px] font-medium mb-1">Corporate Office</h4>
                  <p className="text-[13px] text-muted-foreground flex items-start gap-2">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    3/38, Vinamra Khand, Gomti Nagar, Lucknow, Uttar Pradesh 226028
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <a href="tel:+917007901057" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-cursor-hover>
                    <Phone className="h-4 w-4" /> +91 7007 901 057
                  </a>
                  <a href="mailto:info@ameegolabs.com" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2" data-cursor-hover>
                    <Mail className="h-4 w-4" /> info@ameegolabs.com
                  </a>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll direction="right">
              <div className="rounded-xl border border-border bg-background p-8">
                <h3 className="text-lg font-semibold mb-6">Send us a message</h3>
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label className="text-[12px] text-muted-foreground mb-1.5 block">Name</label>
                    <input
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border border-border bg-card text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12px] text-muted-foreground mb-1.5 block">Phone</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg border border-border bg-card text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
                        placeholder="Contact number"
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-muted-foreground mb-1.5 block">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg border border-border bg-card text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] text-muted-foreground mb-1.5 block">Query</label>
                    <textarea
                      value={contactForm.query}
                      onChange={(e) => setContactForm(f => ({ ...f, query: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-[13px] focus:outline-none focus:ring-1 focus:ring-primary/50 transition-shadow resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>
                  <MagneticButton>
                    <button
                      type="submit"
                      className="w-full h-11 bg-foreground text-background rounded-lg text-[13px] font-medium hover:opacity-90 transition-opacity"
                      data-cursor-hover
                    >
                      Submit
                    </button>
                  </MagneticButton>
                </form>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Lightbulb className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-[13px] font-semibold">Ameego Labs Pvt Ltd</span>
          </div>
          <div className="flex items-center gap-4 text-[12px] text-muted-foreground">
            <a href="https://ameegolabs.com/privacy-policy.html" className="hover:text-foreground transition-colors" data-cursor-hover>Privacy Policy</a>
            <span>·</span>
            <a href="https://ameegolabs.com/terms-of-service.html" className="hover:text-foreground transition-colors" data-cursor-hover>Terms of Service</a>
            <span>·</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

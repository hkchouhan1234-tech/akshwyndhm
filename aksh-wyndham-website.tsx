import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Menu, X, Phone, Mail, MapPin, Instagram, ChevronRight, ChevronLeft,
  Plus, Trash2, Pencil, Save, Lock, LogOut, ArrowRight, ArrowUpRight,
  ShieldCheck, Globe2, Package, Award, Ship, Leaf, Flame, Sprout,
  Calendar, User, Inbox, Settings as SettingsIcon, LayoutGrid,
  BookOpen, MapIcon, SlidersHorizontal, CheckCircle2, AlertCircle,
  Eye, EyeOff, Loader2
} from "lucide-react";

/* ----------------------------------------------------------------------
   AKSH WYNDHAM — Indian Spice Export House
   Single-file site + built-in editable back office (Control Room)
   Content persists via window.storage (shared across all visitors)
------------------------------------------------------------------------- */

const STORAGE_KEY = "aksh-wyndham-site-content-v1";
const ADMIN_PASSCODE = "spice2026"; // demo-level gate, see note in Control Room login

const ICONS = {
  ShieldCheck, Globe2, Package, Award, Ship, Leaf, Flame, Sprout, CheckCircle2
};

const uid = () => Math.random().toString(36).slice(2, 10);

const DEFAULT_DATA = {
  settings: {
    brandName: "Aksh Wyndham",
    brandSuffix: "Exports",
    tagline: "Pure spice. Direct from India.",
    established: "2014",
    countries: "40+",
    varieties: "25+",
    tonnage: "5,000+ MT",
    heroEyebrow: "Merchant Exporters of Indian Spices",
    heroTitle: "From the soil of India,\nto tables of the world.",
    heroSubtitle:
      "Aksh Wyndham sources, tests and ships whole spices, ground spices and custom blends direct from India's growing belts to importers, retailers and food manufacturers worldwide.",
    aboutEyebrow: "Who we are",
    aboutTitle: "A trading house built on the spice route",
    aboutText:
      "Aksh Wyndham is a merchant export house working directly with growers, mandis and processing units across India. We handle sourcing, lab testing, packaging and export documentation end to end, so importers receive consistent, traceable spice shipments without managing multiple vendors on the ground.\n\nEvery lot is sampled and tested before it leaves India, and every shipment carries the certificates your customs and food-safety authorities expect.",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    email: "export@akshwyndham.com",
    address: "204, Silver Trade Tower, Ashram Road, Ahmedabad, Gujarat 380009, India",
    instagram: "https://www.instagram.com/aksh.wyndham",
    mapQuery: "Ashram Road, Ahmedabad, Gujarat, India"
  },
  products: [
    { id: uid(), name: "Turmeric", latin: "Curcuma longa", category: "Whole & Powder", hsCode: "0910 30", origin: "Andhra Pradesh & Tamil Nadu", color: "#D9971C", description: "High-curcumin turmeric fingers and powder, sun-dried and polished, available in Salem, Erode and Nizamabad grades." },
    { id: uid(), name: "Red Chilli", latin: "Capsicum annuum", category: "Whole & Powder", hsCode: "0904 21", origin: "Guntur, Andhra Pradesh", color: "#A6321D", description: "Guntur Sannam and Teja varieties, graded for colour value and pungency, whole pods or fine powder." },
    { id: uid(), name: "Black Pepper", latin: "Piper nigrum", category: "Whole Spices", hsCode: "0904 11", origin: "Idukki & Wayanad, Kerala", color: "#3B3226", description: "Malabar garbled black pepper, steam-sterilised, 500-570 g/l bulk density on request." },
    { id: uid(), name: "Green Cardamom", latin: "Elettaria cardamomum", category: "Whole Spices", hsCode: "0908 31", origin: "Idukki, Kerala", color: "#4B5D3A", description: "Bold, hand-picked 7mm+ and 8mm+ cardamom from Kerala's high ranges, auction-sourced and re-graded." },
    { id: uid(), name: "Cumin Seeds", latin: "Cuminum cyminum", category: "Seeds", hsCode: "0909 31", origin: "Unjha, Gujarat", color: "#B8892B", description: "Singapore-quality cumin from the Unjha mandi, machine-cleaned to under 1% admixture." },
    { id: uid(), name: "Coriander Seeds", latin: "Coriandrum sativum", category: "Seeds", hsCode: "0909 21", origin: "Rajasthan & Gujarat", color: "#8A8C4F", description: "Eagle and split coriander, high volatile-oil content, sourced direct from Rajasthan mandis." },
    { id: uid(), name: "Fennel Seeds", latin: "Foeniculum vulgare", category: "Seeds", hsCode: "0909 61", origin: "Unjha, Gujarat", color: "#6F8B5E", description: "Bold green fennel with natural sweetness, cleaned and graded for size uniformity." },
    { id: uid(), name: "Fenugreek Seeds", latin: "Trigonella foenum-graecum", category: "Seeds", hsCode: "0910 99", origin: "Rajasthan", color: "#9C7A3C", description: "Golden fenugreek seeds, low moisture, packed to resist clumping on long sea transit." },
    { id: uid(), name: "Mustard Seeds", latin: "Brassica juncea", category: "Seeds", hsCode: "1207 99", origin: "Rajasthan & Madhya Pradesh", color: "#7A6A2E", description: "Yellow and brown mustard seed, oil-content tested, food and sowing grades available." },
    { id: uid(), name: "Garam Masala", latin: "House blend", category: "Blends", hsCode: "0910 91", origin: "Blended in Ahmedabad", color: "#8C3A22", description: "Our signature 12-spice blend, formulated to a fixed recipe so every batch tastes the same, anywhere in the world." }
  ],
  regions: [
    { id: uid(), state: "Gujarat", hub: "Unjha Mandi", specialty: "Cumin, fennel & fenugreek", description: "Asia's largest spice trading market — our home base for seed spices, sourced within a day of auction." },
    { id: uid(), state: "Rajasthan", hub: "Kota & Baran", specialty: "Coriander & fenugreek", description: "Arid-belt growing regions producing high-oil-content coriander prized by European buyers." },
    { id: uid(), state: "Kerala", hub: "Idukki Highlands", specialty: "Cardamom & black pepper", description: "The original Malabar spice coast — cool hill estates producing India's finest cardamom and pepper." },
    { id: uid(), state: "Andhra Pradesh", hub: "Guntur", specialty: "Red chilli & turmeric", description: "India's chilli capital, known for deep colour value and consistent pungency across seasons." },
    { id: uid(), state: "Tamil Nadu", hub: "Erode & Salem", specialty: "Turmeric", description: "High-curcumin turmeric belt with dedicated polishing and grading units near our packing partners." }
  ],
  features: [
    { id: uid(), icon: "ShieldCheck", title: "Lab-tested, every lot", description: "Independent lab reports for pesticide residue, aflatoxin and microbial load accompany every shipment." },
    { id: uid(), icon: "Ship", title: "Full export documentation", description: "Phytosanitary certificates, certificate of origin, fumigation and FSSAI paperwork handled in-house." },
    { id: uid(), icon: "Globe2", title: "40+ countries served", description: "Established lanes to the Middle East, Europe, North America and Southeast Asia, FCL and LCL." },
    { id: uid(), icon: "Package", title: "Custom private labelling", description: "Retail pouches, bulk sacks or your own branded packaging, filled to your specification." },
    { id: uid(), icon: "Leaf", title: "Traceable sourcing", description: "Direct relationships with growers and mandis mean we can trace a shipment back to its region of origin." },
    { id: uid(), icon: "Award", title: "Consistent grading", description: "Fixed grading standards batch to batch, so what you sample is what you receive at scale." }
  ],
  blogPosts: [
    {
      id: uid(),
      title: "Guntur chilli: why Andhra's red gold leads global demand",
      excerpt: "A look at what makes Guntur Sannam and Teja chillies the benchmark grade for importers worldwide.",
      content: "Guntur, in Andhra Pradesh, produces some of the most sought-after chilli varieties in the world. Sannam chillies are prized for their deep red colour value, while Teja varieties bring higher pungency for markets that want more heat.\n\nColour value and Scoville rating are tested on every lot before it leaves our warehouse, and we hold back stock that doesn't meet the grade a buyer has ordered rather than substitute a lower grade at the same price.\n\nFor importers building a private-label chilli powder line, we recommend starting with a small trial shipment so your kitchen or QA team can benchmark colour and heat before committing to a full container.",
      date: "2026-05-12",
      author: "Aksh Wyndham Desk",
      tag: "Sourcing"
    },
    {
      id: uid(),
      title: "Understanding HS codes for spice exporters",
      excerpt: "A short, practical guide to the harmonised system codes that matter most when importing Indian spices.",
      content: "Every spice shipment needs the correct HS code for customs clearance, and getting it wrong can delay a container at port. Turmeric generally falls under 0910, chillies under 0904, and seed spices like cumin and coriander under 0909.\n\nWithin each heading there are sub-codes for whole versus crushed or ground product, so a powder and a whole spice of the same plant can carry different codes.\n\nWe include the correct HS code on every invoice and packing list, and our export desk is happy to confirm codes against your country's own tariff schedule before you place an order.",
      date: "2026-04-02",
      author: "Aksh Wyndham Desk",
      tag: "Export Guide"
    },
    {
      id: uid(),
      title: "The journey of cardamom, from Idukki to your kitchen",
      excerpt: "How hand-picked cardamom moves from Kerala's high ranges to a sealed container bound for export.",
      content: "Cardamom is harvested by hand across the hill estates of Idukki, then cured in controlled-temperature drying units to preserve its oil content and green colour.\n\nAfter curing, the pods are graded by size, 8mm bold, 7mm bold and mixed grades, at auction centres before we re-sort them to the specification a buyer needs.\n\nFrom our facility, cardamom is vacuum-packed or nitrogen-flushed depending on transit time, to protect the volatile oils that give it its aroma long after it reaches your kitchen.",
      date: "2026-02-20",
      author: "Aksh Wyndham Desk",
      tag: "Behind the Scenes"
    }
  ],
  messages: []
};

/* ---------------- Reveal-on-scroll wrapper ---------------- */
function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(18px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s cubic-bezier(.2,.7,.3,1) ${delay}s`
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- Toast ---------------- */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div
      className="fixed bottom-5 right-5 z-[200] flex items-center gap-2 rounded-lg px-4 py-3 shadow-xl text-sm font-medium"
      style={{ background: "#17140F", color: "#EFE7D6", border: "1px solid #3a3527" }}
    >
      {toast.type === "error" ? <AlertCircle size={16} color="#D97757" /> : <CheckCircle2 size={16} color="#8FBF7A" />}
      {toast.text}
    </div>
  );
}

/* ================================================================== */

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("site"); // site | blog | admin
  const [activePost, setActivePost] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [productFilter, setProductFilter] = useState("All");
  const [highlightId, setHighlightId] = useState(null);
  const [toast, setToast] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const showToast = useCallback((text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 2600);
  }, []);

  // Load content
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, true);
        if (res && res.value) {
          setData(JSON.parse(res.value));
        } else {
          setData(DEFAULT_DATA);
          await window.storage.set(STORAGE_KEY, JSON.stringify(DEFAULT_DATA), true);
        }
      } catch (e) {
        setData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = useCallback(async (nextData, msg = "Saved") => {
    setData(nextData);
    try {
      const res = await window.storage.set(STORAGE_KEY, JSON.stringify(nextData), true);
      if (!res) throw new Error("no result");
      showToast(msg);
    } catch (e) {
      showToast("Could not save — try again", "error");
    }
  }, [showToast]);

  const scrollTo = (id) => {
    setView("site");
    setMenuOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  if (loading || !data) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center" style={{ background: "#17140F" }}>
        <Loader2 className="animate-spin" color="#D9971C" size={28} />
      </div>
    );
  }

  if (view === "admin") {
    return (
      <ControlRoom
        data={data}
        persist={persist}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        onExit={() => setView("site")}
        showToast={showToast}
      />
    );
  }

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", background: "#FBF8F1", color: "#17140F" }} className="min-h-screen w-full">
      <FontStyles />
      <Nav data={data} view={view} setView={setView} scrollTo={scrollTo} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {view === "site" && (
        <>
          <Hero data={data} onExplore={() => scrollTo("products")} onSwatch={(p) => { scrollTo("products"); setHighlightId(p.id); setProductFilter("All"); setTimeout(() => setHighlightId(null), 2200); }} />
          <About data={data} />
          <Products data={data} filter={productFilter} setFilter={setProductFilter} highlightId={highlightId} />
          <SpiceRoute data={data} />
          <WhyChooseUs data={data} />
          <BlogPreview data={data} onOpenBlog={() => setView("blog")} onOpenPost={(p) => { setView("blog"); setActivePost(p); }} />
          <Contact data={data} persist={persist} showToast={showToast} />
        </>
      )}

      {view === "blog" && (
        <BlogPage
          data={data}
          activePost={activePost}
          setActivePost={setActivePost}
        />
      )}

      <Footer data={data} scrollTo={scrollTo} setView={setView} />
      <Toast toast={toast} />
    </div>
  );
}

function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,500&family=Work+Sans:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
      .font-display { font-family: 'Fraunces', serif; }
      .font-mono { font-family: 'IBM Plex Mono', monospace; }
      html { scroll-behavior: smooth; }
      ::selection { background: #D9971C; color: #17140F; }
      .noscroll-x::-webkit-scrollbar { height: 6px; }
      .noscroll-x::-webkit-scrollbar-thumb { background: #d8cba9; border-radius: 10px; }
    `}</style>
  );
}

/* ---------------- Nav ---------------- */
function Nav({ data, setView, scrollTo, menuOpen, setMenuOpen }) {
  const links = [
    { label: "About", id: "about" },
    { label: "Spices", id: "products" },
    { label: "Sourcing", id: "route" },
    { label: "Why Us", id: "why" },
  ];
  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b" style={{ background: "rgba(251,248,241,0.9)", borderColor: "#e7dcc0" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 h-[68px] flex items-center justify-between">
        <button onClick={() => scrollTo("top")} className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-full flex items-center justify-center font-display font-semibold text-sm" style={{ background: "#17140F", color: "#D9971C" }}>
            {data.settings.brandName.charAt(0)}
          </span>
          <span className="font-display text-lg tracking-tight" style={{ color: "#17140F" }}>
            {data.settings.brandName} <span style={{ color: "#A6321D" }}>{data.settings.brandSuffix}</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="hover:opacity-60 transition-opacity">{l.label}</button>
          ))}
          <button onClick={() => setView("blog")} className="hover:opacity-60 transition-opacity">Journal</button>
          <button onClick={() => scrollTo("contact")} className="px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "#A6321D", color: "#FBF8F1" }}>
            Get a Quote
          </button>
        </nav>

        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-3 text-sm font-medium" style={{ background: "#FBF8F1" }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="text-left py-1">{l.label}</button>
          ))}
          <button onClick={() => { setView("blog"); setMenuOpen(false); }} className="text-left py-1">Journal</button>
          <button onClick={() => scrollTo("contact")} className="text-left py-2 rounded-full px-4 font-semibold w-fit" style={{ background: "#A6321D", color: "#FBF8F1" }}>Get a Quote</button>
        </div>
      )}
    </header>
  );
}

/* ---------------- Hero ---------------- */
function Hero({ data, onExplore, onSwatch }) {
  const s = data.settings;
  return (
    <section id="top" className="relative overflow-hidden" style={{ background: "#17140F", color: "#FBF8F1" }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 50% at 80% 0%, rgba(217,151,28,0.25), transparent 60%), radial-gradient(ellipse 50% 40% at 10% 100%, rgba(166,50,29,0.2), transparent 60%)"
      }} />
      <div className="max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-10 md:pt-24 md:pb-16 relative">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-5" style={{ color: "#D9971C" }}>
            {s.heroEyebrow} · Est. {s.established}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="font-display font-medium leading-[1.05] text-[2.4rem] sm:text-5xl md:text-6xl lg:text-[4.2rem] max-w-4xl whitespace-pre-line">
            {s.heroTitle}
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-6 max-w-xl text-base md:text-lg" style={{ color: "#cdc4ac" }}>{s.heroSubtitle}</p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button onClick={onExplore} className="group inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-sm" style={{ background: "#D9971C", color: "#17140F" }}>
              Explore our spices
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a href={s.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#EFE7D6" }}>
              <Instagram size={17} /> Follow our journey
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-14 flex gap-8 md:gap-14 flex-wrap font-mono">
            {[["Countries served", s.countries], ["Spice varieties", s.varieties], ["Exported yearly", s.tonnage], ["Trading since", s.established]].map(([label, val]) => (
              <div key={label}>
                <div className="text-2xl md:text-3xl font-semibold" style={{ color: "#D9971C" }}>{val}</div>
                <div className="text-xs mt-1" style={{ color: "#9c9382" }}>{label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Spice index strip — signature interactive element */}
      <div className="relative border-t" style={{ borderColor: "#2b2719" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 flex gap-3 overflow-x-auto noscroll-x">
          {data.products.slice(0, 8).map((p) => (
            <button
              key={p.id}
              onClick={() => onSwatch(p)}
              className="shrink-0 flex items-center gap-2 rounded-full pl-1.5 pr-4 py-1.5 border transition-transform hover:-translate-y-0.5"
              style={{ borderColor: "#332e20" }}
              title={`Jump to ${p.name}`}
            >
              <span className="w-6 h-6 rounded-full" style={{ background: p.color }} />
              <span className="text-xs font-medium whitespace-nowrap" style={{ color: "#EFE7D6" }}>{p.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- About ---------------- */
function About({ data }) {
  const s = data.settings;
  return (
    <section id="about" className="max-w-7xl mx-auto px-5 md:px-8 py-20 md:py-28 grid md:grid-cols-12 gap-10">
      <Reveal className="md:col-span-4">
        <p className="font-mono text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#A6321D" }}>{s.aboutEyebrow}</p>
        <h2 className="font-display text-3xl md:text-4xl leading-tight">{s.aboutTitle}</h2>
      </Reveal>
      <Reveal delay={0.1} className="md:col-span-7 md:col-start-6">
        {s.aboutText.split("\n\n").map((para, i) => (
          <p key={i} className="text-base md:text-lg leading-relaxed mb-4" style={{ color: "#413c2f" }}>{para}</p>
        ))}
      </Reveal>
    </section>
  );
}

/* ---------------- Products ---------------- */
function Products({ data, filter, setFilter, highlightId }) {
  const categories = ["All", ...Array.from(new Set(data.products.map((p) => p.category)))];
  const filtered = filter === "All" ? data.products : data.products.filter((p) => p.category === filter);
  return (
    <section id="products" className="py-20 md:py-28" style={{ background: "#F2E9D5" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#A6321D" }}>Our catalogue</p>
            <h2 className="font-display text-3xl md:text-4xl">Whole spices, ground spices &amp; blends</h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button key={c} onClick={() => setFilter(c)}
                className="text-xs font-semibold px-4 py-2 rounded-full border transition-colors"
                style={filter === c ? { background: "#17140F", color: "#EFE7D6", borderColor: "#17140F" } : { borderColor: "#c9bb92", color: "#5c5643" }}>
                {c}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.06}>
              <div
                id={`prod-${p.id}`}
                className="rounded-2xl p-6 h-full flex flex-col transition-shadow"
                style={{
                  background: "#FBF8F1",
                  boxShadow: highlightId === p.id ? `0 0 0 3px ${p.color}` : "0 1px 2px rgba(0,0,0,0.04)"
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: p.color + "22" }}>
                    <span className="w-5 h-5 rounded-full" style={{ background: p.color }} />
                  </span>
                  <span className="font-mono text-[11px] px-2 py-1 rounded-full" style={{ background: "#EFE7D6", color: "#6b6450" }}>HS {p.hsCode}</span>
                </div>
                <h3 className="font-display text-xl mb-0.5">{p.name}</h3>
                <p className="text-xs italic mb-3" style={{ color: "#8a8267" }}>{p.latin}</p>
                <p className="text-sm leading-relaxed flex-1" style={{ color: "#514c3d" }}>{p.description}</p>
                <div className="mt-4 pt-4 border-t flex items-center gap-1.5 text-xs font-medium" style={{ borderColor: "#e7dcc0", color: "#7a734f" }}>
                  <MapPin size={13} /> {p.origin}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Spice Route (regions, horizontal scroller) ---------------- */
function SpiceRoute({ data }) {
  const scrollerRef = useRef(null);
  const scroll = (dir) => scrollerRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  return (
    <section id="route" className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#A6321D" }}>The spice route</p>
            <h2 className="font-display text-3xl md:text-4xl max-w-xl">Five growing regions, one export desk</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: "#d8cba9" }}><ChevronLeft size={18} /></button>
            <button onClick={() => scroll(1)} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: "#d8cba9" }}><ChevronRight size={18} /></button>
          </div>
        </Reveal>
      </div>
      <div ref={scrollerRef} className="flex gap-5 overflow-x-auto noscroll-x px-5 md:px-8 pb-4 max-w-7xl mx-auto">
        {data.regions.map((r, i) => (
          <div key={r.id} className="shrink-0 w-[300px] rounded-2xl p-6 relative overflow-hidden" style={{ background: "#17140F", color: "#EFE7D6" }}>
            <div className="font-mono text-xs mb-6" style={{ color: "#D9971C" }}>{String(i + 1).padStart(2, "0")} / {String(data.regions.length).padStart(2, "0")}</div>
            <h3 className="font-display text-2xl mb-1">{r.state}</h3>
            <p className="text-xs uppercase tracking-wide mb-4" style={{ color: "#9c9382" }}>{r.hub}</p>
            <p className="text-sm font-semibold mb-2" style={{ color: "#D9971C" }}>{r.specialty}</p>
            <p className="text-sm leading-relaxed" style={{ color: "#c9c0ab" }}>{r.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- Why choose us ---------------- */
function WhyChooseUs({ data }) {
  return (
    <section id="why" className="py-20 md:py-28" style={{ background: "#F2E9D5" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="mb-12">
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#A6321D" }}>Why importers work with us</p>
          <h2 className="font-display text-3xl md:text-4xl max-w-xl">Built for buyers who can't inspect the harvest themselves</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.features.map((f, i) => {
            const Icon = ICONS[f.icon] || ShieldCheck;
            return (
              <Reveal key={f.id} delay={(i % 3) * 0.06}>
                <div className="p-6 rounded-2xl h-full" style={{ background: "#FBF8F1" }}>
                  <Icon size={22} color="#A6321D" />
                  <h3 className="font-display text-lg mt-4 mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#514c3d" }}>{f.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Blog preview ---------------- */
function BlogPreview({ data, onOpenBlog, onOpenPost }) {
  return (
    <section className="py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <Reveal className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#A6321D" }}>From the export desk</p>
            <h2 className="font-display text-3xl md:text-4xl">The Journal</h2>
          </div>
          <button onClick={onOpenBlog} className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: "#A6321D" }}>
            View all articles <ArrowUpRight size={15} />
          </button>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {data.blogPosts.slice(0, 3).map((post, i) => (
            <Reveal key={post.id} delay={i * 0.08}>
              <button onClick={() => onOpenPost(post)} className="text-left block rounded-2xl p-6 h-full w-full" style={{ background: "#F2E9D5" }}>
                <span className="font-mono text-[11px] px-2 py-1 rounded-full" style={{ background: "#e7dcc0", color: "#6b6450" }}>{post.tag}</span>
                <h3 className="font-display text-xl mt-4 mb-2 leading-snug">{post.title}</h3>
                <p className="text-sm leading-relaxed mb-4" style={{ color: "#514c3d" }}>{post.excerpt}</p>
                <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#8a8267" }}>
                  <Calendar size={13} /> {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Blog page (list + detail) ---------------- */
function BlogPage({ data, activePost, setActivePost }) {
  if (activePost) {
    const p = activePost;
    return (
      <article className="max-w-3xl mx-auto px-5 md:px-8 py-16 md:py-24">
        <button onClick={() => setActivePost(null)} className="inline-flex items-center gap-1 text-sm font-semibold mb-8" style={{ color: "#A6321D" }}>
          <ChevronLeft size={16} /> Back to Journal
        </button>
        <span className="font-mono text-[11px] px-2 py-1 rounded-full" style={{ background: "#F2E9D5", color: "#6b6450" }}>{p.tag}</span>
        <h1 className="font-display text-3xl md:text-4xl mt-5 mb-4 leading-tight">{p.title}</h1>
        <div className="flex items-center gap-4 text-xs font-medium mb-10" style={{ color: "#8a8267" }}>
          <span className="flex items-center gap-1.5"><User size={13} />{p.author}</span>
          <span className="flex items-center gap-1.5"><Calendar size={13} />{new Date(p.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
        </div>
        {p.content.split("\n\n").map((para, i) => (
          <p key={i} className="text-base md:text-lg leading-relaxed mb-5" style={{ color: "#413c2f" }}>{para}</p>
        ))}
      </article>
    );
  }
  return (
    <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-24">
      <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#A6321D" }}>From the export desk</p>
      <h1 className="font-display text-3xl md:text-5xl mb-12">The Journal</h1>
      <div className="grid md:grid-cols-2 gap-6">
        {data.blogPosts.map((post) => (
          <button key={post.id} onClick={() => setActivePost(post)} className="text-left rounded-2xl p-7" style={{ background: "#F2E9D5" }}>
            <span className="font-mono text-[11px] px-2 py-1 rounded-full" style={{ background: "#e7dcc0", color: "#6b6450" }}>{post.tag}</span>
            <h2 className="font-display text-2xl mt-4 mb-2 leading-snug">{post.title}</h2>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "#514c3d" }}>{post.excerpt}</p>
            <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: "#8a8267" }}>
              <Calendar size={13} /> {new Date(post.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </div>
          </button>
        ))}
        {data.blogPosts.length === 0 && <p style={{ color: "#8a8267" }}>No articles published yet.</p>}
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact({ data, persist, showToast }) {
  const s = data.settings;
  const [form, setForm] = useState({ name: "", email: "", company: "", country: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { showToast("Please fill in name, email and message", "error"); return; }
    setSending(true);
    const next = { ...data, messages: [{ id: uid(), ...form, date: new Date().toISOString() }, ...data.messages] };
    await persist(next, "Enquiry sent — we'll be in touch soon");
    setForm({ name: "", email: "", company: "", country: "", message: "" });
    setSending(false);
  };

  return (
    <section id="contact" className="py-20 md:py-28" style={{ background: "#17140F", color: "#FBF8F1" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 grid md:grid-cols-2 gap-12">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] uppercase mb-3" style={{ color: "#D9971C" }}>Get in touch</p>
          <h2 className="font-display text-3xl md:text-4xl mb-6 max-w-md">Request a quote or sample</h2>
          <p className="mb-8 max-w-md" style={{ color: "#c9c0ab" }}>Tell us the spices, quantity and destination port — our export desk replies within one business day.</p>
          <div className="space-y-4 text-sm">
            <a href={`tel:${s.phone.replace(/\s/g, "")}`} className="flex items-center gap-3"><Phone size={17} color="#D9971C" /> {s.phone}</a>
            <a href={`mailto:${s.email}`} className="flex items-center gap-3"><Mail size={17} color="#D9971C" /> {s.email}</a>
            <div className="flex items-start gap-3"><MapPin size={17} color="#D9971C" className="mt-0.5 shrink-0" /> <span>{s.address}</span></div>
            <a href={s.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-3"><Instagram size={17} color="#D9971C" /> Follow @{s.instagram.split("/").filter(Boolean).pop()}</a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <form onSubmit={submit} className="grid grid-cols-2 gap-4 p-6 md:p-8 rounded-2xl" style={{ background: "#211d14" }}>
            <input className="col-span-2 sm:col-span-1 rounded-lg px-4 py-3 text-sm" style={{ background: "#17140F", color: "#EFE7D6", border: "1px solid #332e20" }} placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className="col-span-2 sm:col-span-1 rounded-lg px-4 py-3 text-sm" style={{ background: "#17140F", color: "#EFE7D6", border: "1px solid #332e20" }} placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="col-span-2 sm:col-span-1 rounded-lg px-4 py-3 text-sm" style={{ background: "#17140F", color: "#EFE7D6", border: "1px solid #332e20" }} placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <input className="col-span-2 sm:col-span-1 rounded-lg px-4 py-3 text-sm" style={{ background: "#17140F", color: "#EFE7D6", border: "1px solid #332e20" }} placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            <textarea className="col-span-2 rounded-lg px-4 py-3 text-sm min-h-[110px]" style={{ background: "#17140F", color: "#EFE7D6", border: "1px solid #332e20" }} placeholder="Spices, quantity, destination port..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button disabled={sending} className="col-span-2 rounded-full py-3 font-semibold text-sm inline-flex items-center justify-center gap-2" style={{ background: "#D9971C", color: "#17140F" }}>
              {sending ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />} Send enquiry
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer({ data, scrollTo, setView }) {
  const s = data.settings;
  return (
    <footer className="py-12" style={{ background: "#100E09", color: "#8f8873" }}>
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <p className="font-display text-lg" style={{ color: "#EFE7D6" }}>{s.brandName} {s.brandSuffix}</p>
          <p className="text-xs mt-1">{s.tagline}</p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs">
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("products")}>Spices</button>
          <button onClick={() => setView("blog")}>Journal</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
          <button onClick={() => setView("admin")} className="opacity-50 hover:opacity-90">Control Room</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 md:px-8 mt-8 pt-6 border-t text-[11px]" style={{ borderColor: "#221f16" }}>
        © {new Date().getFullYear()} {s.brandName} {s.brandSuffix}. All rights reserved.
      </div>
    </footer>
  );
}

/* ================================================================
   CONTROL ROOM — back-office admin portal
================================================================= */
function ControlRoom({ data, persist, isAdmin, setIsAdmin, onExit, showToast }) {
  const [tab, setTab] = useState("settings");

  if (!isAdmin) {
    return <AdminLogin onSuccess={() => setIsAdmin(true)} onExit={onExit} />;
  }

  const tabs = [
    { id: "settings", label: "Site Settings", icon: SettingsIcon },
    { id: "products", label: "Spices", icon: LayoutGrid },
    { id: "regions", label: "Sourcing Regions", icon: MapIcon },
    { id: "features", label: "Why Choose Us", icon: SlidersHorizontal },
    { id: "blog", label: "Journal / Blog", icon: BookOpen },
    { id: "messages", label: `Enquiries${data.messages.length ? ` (${data.messages.length})` : ""}`, icon: Inbox },
  ];

  return (
    <div className="min-h-screen w-full flex" style={{ background: "#F2E9D5", fontFamily: "'Work Sans', sans-serif" }}>
      <FontStyles />
      <aside className="w-64 shrink-0 hidden md:flex flex-col justify-between py-6 px-4" style={{ background: "#17140F", color: "#EFE7D6" }}>
        <div>
          <div className="flex items-center gap-2 px-2 mb-8">
            <span className="w-8 h-8 rounded-full flex items-center justify-center font-display font-semibold text-sm" style={{ background: "#D9971C", color: "#17140F" }}>
              {data.settings.brandName.charAt(0)}
            </span>
            <div>
              <p className="font-display text-sm leading-tight">Control Room</p>
              <p className="text-[11px]" style={{ color: "#9c9382" }}>{data.settings.brandName}</p>
            </div>
          </div>
          <nav className="space-y-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={tab === t.id ? { background: "#2b2717", color: "#D9971C" } : { color: "#c9c0ab" }}>
                <t.icon size={16} /> {t.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={onExit} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium" style={{ color: "#c9c0ab" }}>
          <LogOut size={16} /> Back to website
        </button>
      </aside>

      {/* mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 h-14" style={{ background: "#17140F", color: "#EFE7D6" }}>
        <span className="font-display text-sm">Control Room</span>
        <button onClick={onExit} className="text-xs flex items-center gap-1"><LogOut size={14} /> Exit</button>
      </div>
      <div className="md:hidden fixed top-14 left-0 right-0 z-30 flex overflow-x-auto noscroll-x px-2 gap-1 py-2" style={{ background: "#211d14" }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className="shrink-0 text-xs px-3 py-1.5 rounded-full font-medium"
            style={tab === t.id ? { background: "#D9971C", color: "#17140F" } : { background: "#2b2717", color: "#c9c0ab" }}>
            {t.label}
          </button>
        ))}
      </div>

      <main className="flex-1 overflow-y-auto px-5 md:px-10 py-8 md:py-10 mt-24 md:mt-0">
        {tab === "settings" && <SettingsTab data={data} persist={persist} />}
        {tab === "products" && <ProductsTab data={data} persist={persist} />}
        {tab === "regions" && <RegionsTab data={data} persist={persist} />}
        {tab === "features" && <FeaturesTab data={data} persist={persist} />}
        {tab === "blog" && <BlogTab data={data} persist={persist} />}
        {tab === "messages" && <MessagesTab data={data} persist={persist} showToast={showToast} />}
      </main>
    </div>
  );
}

function AdminLogin({ onSuccess, onExit }) {
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASSCODE) onSuccess();
    else setError("Incorrect passcode. Try again.");
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5" style={{ background: "#17140F" }}>
      <FontStyles />
      <form onSubmit={submit} className="w-full max-w-sm p-8 rounded-2xl" style={{ background: "#211d14" }}>
        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "#D9971C22" }}>
          <Lock size={20} color="#D9971C" />
        </div>
        <h1 className="font-display text-2xl mb-2" style={{ color: "#EFE7D6" }}>Control Room</h1>
        <p className="text-sm mb-6" style={{ color: "#9c9382" }}>Enter the passcode to edit site content.</p>
        <div className="relative mb-2">
          <input
            type={show ? "text" : "password"}
            value={pass}
            onChange={(e) => { setPass(e.target.value); setError(""); }}
            placeholder="Passcode"
            className="w-full rounded-lg px-4 py-3 text-sm pr-10"
            style={{ background: "#17140F", color: "#EFE7D6", border: "1px solid #332e20" }}
          />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#8f8873" }}>
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && <p className="text-xs mb-3" style={{ color: "#e08a75" }}>{error}</p>}
        <button className="w-full rounded-full py-3 font-semibold text-sm mt-3" style={{ background: "#D9971C", color: "#17140F" }}>Enter</button>
        <button type="button" onClick={onExit} className="w-full text-center text-xs mt-4" style={{ color: "#8f8873" }}>← Back to website</button>
        <p className="text-[11px] mt-6 leading-relaxed" style={{ color: "#6b6450" }}>
          Demo passcode: <span className="font-mono">spice2026</span>. This is a lightweight content gate for previewing the editor — connect real authentication before taking this live.
        </p>
      </form>
    </div>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="flex items-start justify-between flex-wrap gap-4 mb-7">
      <div>
        <h1 className="font-display text-2xl md:text-3xl mb-1">{title}</h1>
        {description && <p className="text-sm" style={{ color: "#6b6450" }}>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="block text-xs font-semibold uppercase tracking-wide mb-1.5" style={{ color: "#7a734f" }}>{label}</span>
      {children}
    </label>
  );
}
const inputCls = "w-full rounded-lg px-3.5 py-2.5 text-sm border";
const inputStyle = { background: "#FBF8F1", borderColor: "#e0d4ae" };

function SaveBar({ onSave, savedLabel = "Save changes" }) {
  return (
    <button onClick={onSave} className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm" style={{ background: "#17140F", color: "#EFE7D6" }}>
      <Save size={15} /> {savedLabel}
    </button>
  );
}

/* ---- Settings tab ---- */
function SettingsTab({ data, persist }) {
  const [s, setS] = useState(data.settings);
  useEffect(() => setS(data.settings), [data.settings]);
  const set = (k, v) => setS({ ...s, [k]: v });
  const save = () => persist({ ...data, settings: s });

  return (
    <div className="max-w-3xl">
      <SectionHeader title="Site settings" description="Brand details, homepage copy and contact information shown across the site." action={<SaveBar onSave={save} />} />
      <div className="bg-white rounded-2xl p-6 mb-6" style={{ background: "#FBF8F1" }}>
        <h3 className="font-display text-lg mb-4">Brand</h3>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Brand name"><input className={inputCls} style={inputStyle} value={s.brandName} onChange={(e) => set("brandName", e.target.value)} /></Field>
          <Field label="Brand suffix"><input className={inputCls} style={inputStyle} value={s.brandSuffix} onChange={(e) => set("brandSuffix", e.target.value)} /></Field>
          <Field label="Tagline"><input className={inputCls} style={inputStyle} value={s.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
          <Field label="Established year"><input className={inputCls} style={inputStyle} value={s.established} onChange={(e) => set("established", e.target.value)} /></Field>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6" style={{ background: "#FBF8F1" }}>
        <h3 className="font-display text-lg mb-4">Homepage hero</h3>
        <Field label="Eyebrow label"><input className={inputCls} style={inputStyle} value={s.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} /></Field>
        <Field label="Headline (use a line break for two lines)"><textarea className={inputCls + " min-h-[70px]"} style={inputStyle} value={s.heroTitle} onChange={(e) => set("heroTitle", e.target.value)} /></Field>
        <Field label="Subheading"><textarea className={inputCls + " min-h-[90px]"} style={inputStyle} value={s.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} /></Field>
        <div className="grid sm:grid-cols-3 gap-x-4">
          <Field label="Countries served"><input className={inputCls} style={inputStyle} value={s.countries} onChange={(e) => set("countries", e.target.value)} /></Field>
          <Field label="Spice varieties"><input className={inputCls} style={inputStyle} value={s.varieties} onChange={(e) => set("varieties", e.target.value)} /></Field>
          <Field label="Tonnage exported"><input className={inputCls} style={inputStyle} value={s.tonnage} onChange={(e) => set("tonnage", e.target.value)} /></Field>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6" style={{ background: "#FBF8F1" }}>
        <h3 className="font-display text-lg mb-4">About section</h3>
        <Field label="Eyebrow label"><input className={inputCls} style={inputStyle} value={s.aboutEyebrow} onChange={(e) => set("aboutEyebrow", e.target.value)} /></Field>
        <Field label="Heading"><input className={inputCls} style={inputStyle} value={s.aboutTitle} onChange={(e) => set("aboutTitle", e.target.value)} /></Field>
        <Field label="Body text (blank line = new paragraph)"><textarea className={inputCls + " min-h-[130px]"} style={inputStyle} value={s.aboutText} onChange={(e) => set("aboutText", e.target.value)} /></Field>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-10" style={{ background: "#FBF8F1" }}>
        <h3 className="font-display text-lg mb-4">Contact details</h3>
        <div className="grid sm:grid-cols-2 gap-x-4">
          <Field label="Phone"><input className={inputCls} style={inputStyle} value={s.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="WhatsApp number (digits only, country code)"><input className={inputCls} style={inputStyle} value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></Field>
          <Field label="Email"><input className={inputCls} style={inputStyle} value={s.email} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Instagram URL"><input className={inputCls} style={inputStyle} value={s.instagram} onChange={(e) => set("instagram", e.target.value)} /></Field>
        </div>
        <Field label="Office address"><textarea className={inputCls + " min-h-[70px]"} style={inputStyle} value={s.address} onChange={(e) => set("address", e.target.value)} /></Field>
      </div>
    </div>
  );
}

/* ---- Products tab ---- */
function emptyProduct() { return { id: uid(), name: "", latin: "", category: "Whole Spices", hsCode: "", origin: "", color: "#D9971C", description: "" }; }

function ProductsTab({ data, persist }) {
  const [items, setItems] = useState(data.products);
  const [openId, setOpenId] = useState(null);
  useEffect(() => setItems(data.products), [data.products]);

  const save = (list) => persist({ ...data, products: list });
  const update = (id, patch) => setItems((list) => list.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const addNew = () => { const p = emptyProduct(); setItems((l) => [p, ...l]); setOpenId(p.id); };
  const remove = (id) => { const list = items.filter((p) => p.id !== id); setItems(list); save(list); };

  return (
    <div className="max-w-3xl">
      <SectionHeader title="Spices" description="Everything shown in the product catalogue on the website." action={
        <div className="flex gap-2">
          <button onClick={addNew} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-sm border" style={{ borderColor: "#c9bb92" }}><Plus size={15} /> Add spice</button>
          <SaveBar onSave={() => save(items)} />
        </div>
      } />
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl overflow-hidden" style={{ background: "#FBF8F1" }}>
            <button onClick={() => setOpenId(openId === p.id ? null : p.id)} className="w-full flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{ background: p.color }} />
                <span className="font-medium">{p.name || "Untitled spice"}</span>
                <span className="text-xs" style={{ color: "#8a8267" }}>{p.category}</span>
              </div>
              <Pencil size={14} style={{ color: "#8a8267" }} />
            </button>
            {openId === p.id && (
              <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: "#e7dcc0" }}>
                <div className="grid sm:grid-cols-2 gap-x-4">
                  <Field label="Name"><input className={inputCls} style={inputStyle} value={p.name} onChange={(e) => update(p.id, { name: e.target.value })} /></Field>
                  <Field label="Latin / botanical name"><input className={inputCls} style={inputStyle} value={p.latin} onChange={(e) => update(p.id, { latin: e.target.value })} /></Field>
                  <Field label="Category"><input className={inputCls} style={inputStyle} value={p.category} onChange={(e) => update(p.id, { category: e.target.value })} /></Field>
                  <Field label="HS code"><input className={inputCls} style={inputStyle} value={p.hsCode} onChange={(e) => update(p.id, { hsCode: e.target.value })} /></Field>
                  <Field label="Origin / region"><input className={inputCls} style={inputStyle} value={p.origin} onChange={(e) => update(p.id, { origin: e.target.value })} /></Field>
                  <Field label="Accent colour">
                    <input type="color" className="w-full h-[42px] rounded-lg border" style={inputStyle} value={p.color} onChange={(e) => update(p.id, { color: e.target.value })} />
                  </Field>
                </div>
                <Field label="Description"><textarea className={inputCls + " min-h-[80px]"} style={inputStyle} value={p.description} onChange={(e) => update(p.id, { description: e.target.value })} /></Field>
                <div className="flex justify-between mt-2">
                  <button onClick={() => remove(p.id)} className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "#A6321D" }}><Trash2 size={14} /> Delete spice</button>
                  <button onClick={() => save(items)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full" style={{ background: "#17140F", color: "#EFE7D6" }}><Save size={14} /> Save</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p style={{ color: "#8a8267" }}>No spices yet — add your first one.</p>}
      </div>
    </div>
  );
}

/* ---- Regions tab ---- */
function emptyRegion() { return { id: uid(), state: "", hub: "", specialty: "", description: "" }; }

function RegionsTab({ data, persist }) {
  const [items, setItems] = useState(data.regions);
  useEffect(() => setItems(data.regions), [data.regions]);
  const save = (list) => persist({ ...data, regions: list });
  const update = (id, patch) => setItems((l) => l.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const addNew = () => setItems((l) => [...l, emptyRegion()]);
  const remove = (id) => { const list = items.filter((r) => r.id !== id); setItems(list); save(list); };

  return (
    <div className="max-w-3xl">
      <SectionHeader title="Sourcing regions" description="The 'Spice Route' strip showing where each spice is grown." action={
        <div className="flex gap-2">
          <button onClick={addNew} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-sm border" style={{ borderColor: "#c9bb92" }}><Plus size={15} /> Add region</button>
          <SaveBar onSave={() => save(items)} />
        </div>
      } />
      <div className="space-y-4">
        {items.map((r) => (
          <div key={r.id} className="rounded-2xl p-5" style={{ background: "#FBF8F1" }}>
            <div className="grid sm:grid-cols-2 gap-x-4">
              <Field label="State"><input className={inputCls} style={inputStyle} value={r.state} onChange={(e) => update(r.id, { state: e.target.value })} /></Field>
              <Field label="Hub / mandi"><input className={inputCls} style={inputStyle} value={r.hub} onChange={(e) => update(r.id, { hub: e.target.value })} /></Field>
            </div>
            <Field label="Specialty"><input className={inputCls} style={inputStyle} value={r.specialty} onChange={(e) => update(r.id, { specialty: e.target.value })} /></Field>
            <Field label="Description"><textarea className={inputCls + " min-h-[70px]"} style={inputStyle} value={r.description} onChange={(e) => update(r.id, { description: e.target.value })} /></Field>
            <button onClick={() => remove(r.id)} className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "#A6321D" }}><Trash2 size={14} /> Delete region</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Features tab ---- */
const ICON_OPTIONS = Object.keys(ICONS);
function emptyFeature() { return { id: uid(), icon: "ShieldCheck", title: "", description: "" }; }

function FeaturesTab({ data, persist }) {
  const [items, setItems] = useState(data.features);
  useEffect(() => setItems(data.features), [data.features]);
  const save = (list) => persist({ ...data, features: list });
  const update = (id, patch) => setItems((l) => l.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  const addNew = () => setItems((l) => [...l, emptyFeature()]);
  const remove = (id) => { const list = items.filter((f) => f.id !== id); setItems(list); save(list); };

  return (
    <div className="max-w-3xl">
      <SectionHeader title="Why choose us" description="Trust features shown before the Journal section." action={
        <div className="flex gap-2">
          <button onClick={addNew} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-sm border" style={{ borderColor: "#c9bb92" }}><Plus size={15} /> Add feature</button>
          <SaveBar onSave={() => save(items)} />
        </div>
      } />
      <div className="space-y-4">
        {items.map((f) => (
          <div key={f.id} className="rounded-2xl p-5" style={{ background: "#FBF8F1" }}>
            <div className="grid sm:grid-cols-[140px_1fr] gap-x-4">
              <Field label="Icon">
                <select className={inputCls} style={inputStyle} value={f.icon} onChange={(e) => update(f.id, { icon: e.target.value })}>
                  {ICON_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </Field>
              <Field label="Title"><input className={inputCls} style={inputStyle} value={f.title} onChange={(e) => update(f.id, { title: e.target.value })} /></Field>
            </div>
            <Field label="Description"><textarea className={inputCls + " min-h-[70px]"} style={inputStyle} value={f.description} onChange={(e) => update(f.id, { description: e.target.value })} /></Field>
            <button onClick={() => remove(f.id)} className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "#A6321D" }}><Trash2 size={14} /> Delete feature</button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- Blog tab ---- */
function emptyPost() { return { id: uid(), title: "", excerpt: "", content: "", date: new Date().toISOString().slice(0, 10), author: "Aksh Wyndham Desk", tag: "News" }; }

function BlogTab({ data, persist }) {
  const [items, setItems] = useState(data.blogPosts);
  const [openId, setOpenId] = useState(null);
  useEffect(() => setItems(data.blogPosts), [data.blogPosts]);
  const save = (list) => persist({ ...data, blogPosts: list });
  const update = (id, patch) => setItems((l) => l.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const addNew = () => { const p = emptyPost(); setItems((l) => [p, ...l]); setOpenId(p.id); };
  const remove = (id) => { const list = items.filter((p) => p.id !== id); setItems(list); save(list); };

  return (
    <div className="max-w-3xl">
      <SectionHeader title="Journal / Blog" description="Articles shown on the homepage preview and the full Journal page." action={
        <div className="flex gap-2">
          <button onClick={addNew} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-semibold text-sm border" style={{ borderColor: "#c9bb92" }}><Plus size={15} /> New post</button>
          <SaveBar onSave={() => save(items)} />
        </div>
      } />
      <div className="space-y-3">
        {items.map((p) => (
          <div key={p.id} className="rounded-2xl overflow-hidden" style={{ background: "#FBF8F1" }}>
            <button onClick={() => setOpenId(openId === p.id ? null : p.id)} className="w-full flex items-center justify-between px-5 py-4 text-left">
              <div>
                <span className="font-medium">{p.title || "Untitled post"}</span>
                <span className="text-xs ml-3" style={{ color: "#8a8267" }}>{p.date}</span>
              </div>
              <Pencil size={14} style={{ color: "#8a8267" }} />
            </button>
            {openId === p.id && (
              <div className="px-5 pb-5 pt-1 border-t" style={{ borderColor: "#e7dcc0" }}>
                <Field label="Title"><input className={inputCls} style={inputStyle} value={p.title} onChange={(e) => update(p.id, { title: e.target.value })} /></Field>
                <div className="grid sm:grid-cols-3 gap-x-4">
                  <Field label="Tag"><input className={inputCls} style={inputStyle} value={p.tag} onChange={(e) => update(p.id, { tag: e.target.value })} /></Field>
                  <Field label="Author"><input className={inputCls} style={inputStyle} value={p.author} onChange={(e) => update(p.id, { author: e.target.value })} /></Field>
                  <Field label="Date"><input type="date" className={inputCls} style={inputStyle} value={p.date} onChange={(e) => update(p.id, { date: e.target.value })} /></Field>
                </div>
                <Field label="Excerpt (shown in preview cards)"><textarea className={inputCls + " min-h-[60px]"} style={inputStyle} value={p.excerpt} onChange={(e) => update(p.id, { excerpt: e.target.value })} /></Field>
                <Field label="Full article (blank line = new paragraph)"><textarea className={inputCls + " min-h-[160px]"} style={inputStyle} value={p.content} onChange={(e) => update(p.id, { content: e.target.value })} /></Field>
                <div className="flex justify-between mt-2">
                  <button onClick={() => remove(p.id)} className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "#A6321D" }}><Trash2 size={14} /> Delete post</button>
                  <button onClick={() => save(items)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full" style={{ background: "#17140F", color: "#EFE7D6" }}><Save size={14} /> Save</button>
                </div>
              </div>
            )}
          </div>
        ))}
        {items.length === 0 && <p style={{ color: "#8a8267" }}>No posts yet — write your first article.</p>}
      </div>
    </div>
  );
}

/* ---- Messages / Enquiries tab ---- */
function MessagesTab({ data, persist, showToast }) {
  const remove = (id) => {
    const list = data.messages.filter((m) => m.id !== id);
    persist({ ...data, messages: list }, "Enquiry removed");
  };
  return (
    <div className="max-w-3xl">
      <SectionHeader title="Enquiries" description="Messages submitted through the website's contact form." />
      <div className="space-y-3">
        {data.messages.map((m) => (
          <div key={m.id} className="rounded-2xl p-5" style={{ background: "#FBF8F1" }}>
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
              <p className="font-semibold">{m.name} <span className="font-normal text-sm" style={{ color: "#8a8267" }}>· {m.company || "—"} · {m.country || "—"}</span></p>
              <button onClick={() => remove(m.id)} style={{ color: "#A6321D" }}><Trash2 size={15} /></button>
            </div>
            <a href={`mailto:${m.email}`} className="text-sm block mb-2" style={{ color: "#6b6450" }}>{m.email}</a>
            <p className="text-sm leading-relaxed mb-2">{m.message}</p>
            <p className="text-xs" style={{ color: "#8a8267" }}>{new Date(m.date).toLocaleString()}</p>
          </div>
        ))}
        {data.messages.length === 0 && (
          <div className="rounded-2xl p-10 text-center" style={{ background: "#FBF8F1" }}>
            <Inbox size={26} className="mx-auto mb-3" style={{ color: "#c9bb92" }} />
            <p style={{ color: "#8a8267" }}>No enquiries yet. They'll appear here as visitors submit the contact form.</p>
          </div>
        )}
      </div>
    </div>
  );
}

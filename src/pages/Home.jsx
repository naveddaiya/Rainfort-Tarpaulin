import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeCheck, HeadphonesIcon, Package,
  TrendingUp, ChevronLeft, ChevronRight, ArrowRight,
  Phone, MessageCircle,
} from 'lucide-react';
import { QuoteModal } from '@/components/ui/quote-modal';
import { useCategories } from '@/hooks/useCategories';

/* ─────────────────────────── Data ─────────────────────────── */

const SLIDES = [
  { src: '/images/products/coated.webp',      alt: 'PVC Coated Tarpaulin',      label: 'PVC Coated Tarpaulin',    sub: 'Heavy-duty industrial grade' },
  { src: '/images/products/truck.webp',       alt: 'Truck Transport Tarpaulin', label: 'Truck & Transport Cover', sub: 'All-weather road protection' },
  { src: '/images/products/bioflock.webp',    alt: 'Bioflock Pond Liner',       label: 'Biofloc Pond Liner',      sub: 'Aquaculture & farming' },
  { src: '/images/products/white.webp',       alt: 'White Heavy Duty Tarpaulin',label: 'White Heavy Duty',        sub: 'Multi-purpose outdoor cover' },
  { src: '/images/products/tent-pagoda.webp', alt: 'Tent Pagoda Tarpaulin',     label: 'Tent & Pagoda Cover',     sub: 'Events & temporary structures' },
];

const TRUST_ITEMS = [
  { icon: BadgeCheck,     label: 'ISO 9001 Certified', sub: 'Quality Assured' },
  { icon: TrendingUp,     label: '8+ Years Experience', sub: 'Since 2016' },
  { icon: Package,        label: '800+ Projects',       sub: 'Delivered Pan-India' },
  { icon: HeadphonesIcon, label: '24/7 Support',        sub: '+91 83850 11488' },
];

const MARQUEE_ITEMS = [
  'Construction & Civil Works',
  'Agriculture & Crop Storage',
  'Truck & Transport Covers',
  'Aquaculture & Biofloc',
  'Events & Tent Structures',
  'Cold Storage & Warehousing',
  'Mining & Quarrying',
  'Export & Cargo Packaging',
  'Disaster Relief Operations',
  'Industrial Shade Solutions',
];

const CategorySkeleton = () => (
  <div className="animate-pulse bg-muted" style={{ aspectRatio: '4/3' }} />
);

/* ─────────────────────────── Component ─────────────────────── */

const Home = () => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [heroReady, setHeroReady] = useState(false);

  const carouselRef = useRef(null);
  const touchStartX = useRef(0);
  const [cardW, setCardW] = useState(300);
  const GAP = 12;

  const { categories, loading: catLoading } = useCategories();

  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const measure = () => setCardW(Math.round(el.clientWidth * 0.86));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const prev = () => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length);
  const next = () => setSlide(s => (s + 1) % SLIDES.length);

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const heroStyle = (delay) => ({
    opacity: heroReady ? 1 : 0,
    transform: heroReady ? 'none' : 'translateY(22px)',
    transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
  });

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const handleTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    setPaused(false);
  };

  return (
    <div id="home" className="min-h-screen">

      {/* ════════════════════════════════════════════
          HERO
         ════════════════════════════════════════════ */}
      <section className="bg-background overflow-hidden">

        {/* ── DESKTOP: editorial split layout ── */}
        <div className="hidden lg:flex mt-20 min-h-[calc(100vh-5rem)]">

          {/* Left: text + controls */}
          <div className="w-[42%] xl:w-[40%] flex flex-col justify-center px-10 xl:px-14 2xl:px-20 py-10 relative overflow-hidden">

            {/* Watermark slide number */}
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 font-hero leading-none select-none pointer-events-none"
              style={{ fontSize: '28vw', color: 'var(--foreground)', opacity: 0.028 }}
              aria-hidden="true"
            >
              {String(slide + 1).padStart(2, '0')}
            </div>

            <div className="relative z-10">
              {/* Badge */}
              <div style={heroStyle(0)} className="flex items-center gap-2.5 mb-5">
                <div className="h-[2px] w-6 bg-safety-500 flex-shrink-0" />
                <span className="text-safety-500 text-[10px] font-bold uppercase tracking-[0.22em]">
                  ISO 9001 · Est. 2016
                </span>
              </div>

              {/* Headline */}
              <h1
                style={{ fontSize: 'clamp(38px, 4.5vw, 70px)', ...heroStyle(80) }}
                className="font-hero text-foreground uppercase leading-[0.88] mb-5"
              >
                Premium<br />
                <span className="text-safety-500">Protection</span><br />
                Every Season
              </h1>

              {/* Description */}
              <p style={heroStyle(160)} className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-8">
                Heavy-duty, waterproof tarpaulins engineered for construction,
                agriculture, and transportation across India.
              </p>

              {/* CTAs */}
              <div style={heroStyle(200)} className="flex items-center gap-3 mb-10">
                <button
                  onClick={scrollToProducts}
                  className="group flex items-center gap-2 bg-safety-500 hover:bg-safety-600 text-white px-6 py-3.5 font-bold uppercase tracking-wide text-xs transition-all duration-200 shadow-[0_4px_14px_rgba(255,107,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.4)] active:scale-[0.97]"
                >
                  View Products
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
                <button
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="flex items-center gap-2 border border-border text-foreground hover:border-safety-500/50 hover:text-safety-500 px-6 py-3.5 font-bold uppercase tracking-wide text-xs transition-all duration-200"
                >
                  Get Quote
                </button>
              </div>

              {/* Now showing divider */}
              <div style={heroStyle(220)} className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-8 bg-border flex-shrink-0" />
                <span className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/45">Now Showing</span>
              </div>

              {/* Current slide info */}
              <div style={heroStyle(240)} className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-safety-500 mb-1.5">
                  {SLIDES[slide].sub}
                </p>
                <p className="text-lg font-display text-foreground leading-tight">
                  {SLIDES[slide].label}
                </p>
              </div>

              {/* Dots + arrows */}
              <div style={heroStyle(260)} className="flex items-center gap-3">
                <div className="flex gap-1.5 items-center">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                      className={`rounded-full transition-all duration-300 ${
                        i === slide
                          ? 'w-5 h-[5px] bg-safety-500 shadow-[0_0_6px_rgba(255,107,0,0.6)]'
                          : 'w-[5px] h-[5px] bg-foreground/20 hover:bg-foreground/40'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-1.5 ml-2">
                  <button
                    onClick={prev}
                    aria-label="Previous slide"
                    className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:border-safety-500/50 hover:text-safety-500 hover:bg-safety-500/5 transition-all duration-200"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next slide"
                    className="w-8 h-8 flex items-center justify-center border border-border text-muted-foreground hover:border-safety-500/50 hover:text-safety-500 hover:bg-safety-500/5 transition-all duration-200"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: full-height crossfade carousel */}
          <div className="flex-1 py-6 pr-8 xl:py-8 xl:pr-10">
          <div
            className="relative overflow-hidden cursor-pointer rounded-3xl h-full"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Left edge blend */}
            <div className="absolute left-0 top-0 bottom-0 w-28 bg-gradient-to-r from-background/25 to-transparent z-10 pointer-events-none" />

            {/* Slides — crossfade */}
            {SLIDES.map((s, i) => (
              <div
                key={s.src}
                className="absolute inset-0 transition-opacity duration-[650ms] ease-in-out"
                style={{ opacity: i === slide ? 1 : 0 }}
              >
                <img
                  src={s.src}
                  alt={s.alt}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    transform: i === slide ? 'scale(1.06)' : 'scale(1.01)',
                    transition: 'transform 6s ease-out',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/15 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />
              </div>
            ))}

            {/* Featured pill */}
            <div className="absolute top-7 left-12 z-20">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/80 bg-black/50 backdrop-blur-sm px-2.5 py-1 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-safety-500 shadow-[0_0_5px_rgba(255,107,0,0.9)]" />
                Featured Product
              </span>
            </div>

            {/* Slide counter */}
            <div className="absolute top-7 right-7 z-20">
              <span className="text-[10px] font-mono font-bold text-white/40 bg-black/35 backdrop-blur-sm px-2.5 py-1">
                {String(slide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
              </span>
            </div>

            {/* Vertical brand text */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20 select-none pointer-events-none">
              <p
                className="text-[8px] font-bold uppercase text-white/15 tracking-[0.4em]"
                style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
              >
                RAINFORT TARPAULINS
              </p>
            </div>

            {/* Bottom content + progress */}
            <div className="absolute bottom-0 left-0 right-0 z-20 px-10 py-8">
              <div className="h-[2px] bg-white/10 mb-5 overflow-hidden">
                <div
                  key={`bar-${slide}`}
                  className="h-full bg-safety-500 origin-left"
                  style={{
                    animation: 'progressSweep 5s linear forwards',
                    animationPlayState: paused ? 'paused' : 'running',
                  }}
                />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-safety-400 mb-2">
                Rainfort Tarpaulins
              </p>
              <h3 className="text-3xl lg:text-4xl font-bold text-white uppercase leading-tight">
                {SLIDES[slide].label}
              </h3>
              <p className="text-sm text-white/45 mt-1.5">{SLIDES[slide].sub}</p>
            </div>
          </div>
          </div>
        </div>

        {/* ── MOBILE: original stacked layout ── */}
        <div className="lg:hidden pt-20">

          {/* Brand Headline */}
          <div className="px-4 sm:px-6 pt-6 sm:pt-10 pb-5 sm:pb-6">
            <div className="flex items-center gap-2.5 mb-2.5" style={heroStyle(0)}>
              <div className="h-[2px] w-6 bg-safety-500 flex-shrink-0" />
              <span className="text-safety-500 text-[10px] font-bold uppercase tracking-[0.22em]">
                ISO 9001 · Est. 2016
              </span>
            </div>

            <h1
              className="font-hero text-foreground uppercase leading-[0.9] mb-3"
              style={{ fontSize: 'clamp(34px, 8vw, 80px)', ...heroStyle(80) }}
            >
              Premium<br />
              <span className="text-safety-500">Protection</span><br />
              Every Season
            </h1>

            <p
              className="text-muted-foreground text-sm leading-relaxed max-w-md mb-4"
              style={heroStyle(160)}
            >
              Heavy-duty, waterproof tarpaulins engineered for construction,
              agriculture, and transportation. Industrial strength that outlasts
              the competition — guaranteed.
            </p>

            <div
              className="flex items-center gap-2.5 flex-wrap sm:hidden mb-1"
              style={heroStyle(220)}
            >
              <a
                href="tel:+918385011488"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-foreground border border-border rounded-full px-3.5 py-1.5 hover:border-safety-500/50 hover:text-safety-500 transition-all duration-200"
              >
                <Phone className="h-3 w-3 flex-shrink-0" />
                Call Now
              </a>
              <a
                href="https://wa.me/918385011488"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-white bg-[#25D366] rounded-full px-3.5 py-1.5 hover:bg-[#1da851] transition-colors duration-200 shadow-[0_2px_10px_rgba(37,211,102,0.3)]"
              >
                <MessageCircle className="h-3 w-3 flex-shrink-0" />
                WhatsApp
              </a>
            </div>
          </div>

          {/* Card Peek Carousel */}
          <div
            ref={carouselRef}
            className="overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex pl-4 sm:pl-6 transition-transform duration-[480ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              style={{ transform: `translateX(${-slide * (cardW + GAP)}px)` }}
            >
              {SLIDES.map((s, i) => (
                <div
                  key={s.src}
                  className={`flex-shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden relative cursor-pointer transition-opacity duration-300 ${
                    i === slide ? 'opacity-100' : 'opacity-50 hover:opacity-75'
                  }`}
                  style={{ width: cardW, aspectRatio: '16/10', marginRight: GAP }}
                  onClick={() => setSlide(i)}
                >
                  <img
                    src={s.src}
                    alt={s.alt}
                    fetchPriority={i === 0 ? 'high' : 'low'}
                    decoding="async"
                    className="w-full h-full object-cover"
                    style={{
                      transform: i === slide ? 'scale(1.05)' : 'scale(1)',
                      transition: 'transform 5.5s ease-out',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/20 to-black/5" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                    <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/80 bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
                      <span className="w-1.5 h-1.5 rounded-full bg-safety-500 shadow-[0_0_5px_rgba(255,107,0,0.9)]" />
                      Featured
                    </span>
                  </div>

                  {i === slide && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <span className="text-[10px] font-mono font-bold text-white/50 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                        {String(slide + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-5">
                    <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-safety-400 mb-0.5 sm:mb-1">
                      Rainfort Tarpaulins
                    </p>
                    <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-white uppercase leading-tight mb-0.5">
                      {s.label}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-white/50 hidden sm:block">{s.sub}</p>
                  </div>

                  {i === slide && (
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10">
                      <div
                        key={`bar-${slide}`}
                        className="h-full bg-safety-500 origin-left"
                        style={{
                          animation: 'progressSweep 5s linear forwards',
                          animationPlayState: paused ? 'paused' : 'running',
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Dots + Nav + CTA row */}
          <div
            className="px-4 sm:px-6 pt-3.5 pb-7 sm:pb-9 flex items-center justify-between gap-3"
            style={heroStyle(200)}
          >
            <div className="flex gap-1.5 items-center flex-shrink-0">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlide(i)}
                  aria-label={`Slide ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === slide
                      ? 'w-5 h-[5px] bg-safety-500 shadow-[0_0_6px_rgba(255,107,0,0.6)]'
                      : 'w-[5px] h-[5px] bg-foreground/20 hover:bg-foreground/40'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:border-safety-500/50 hover:text-safety-500 hover:bg-safety-500/5 transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:border-safety-500/50 hover:text-safety-500 hover:bg-safety-500/5 transition-all duration-200"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <button
                onClick={scrollToProducts}
                className="group ml-1 flex items-center gap-1.5 bg-safety-500 hover:bg-safety-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-bold uppercase tracking-wide text-xs transition-all duration-200 shadow-[0_4px_14px_rgba(255,107,0,0.3)] hover:shadow-[0_6px_20px_rgba(255,107,0,0.4)] active:scale-[0.97]"
              >
                View Products
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>

              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 border border-border text-foreground hover:border-safety-500/50 hover:text-safety-500 px-5 py-2.5 rounded-full font-bold uppercase tracking-wide text-xs transition-all duration-200"
              >
                Get Quote
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          TRUST STRIP
         ════════════════════════════════════════════ */}
      <section className="relative bg-slate-900 dark:bg-slate-950 border-y border-slate-700/40 overflow-hidden">
        <div className="absolute inset-0 diagonal-stripe opacity-25" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {TRUST_ITEMS.map(({ icon: Icon, label, sub }, idx) => (
              <div
                key={label}
                className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-5 sm:py-6 group border-slate-700/40 ${
                  idx === 0 ? 'border-r border-b sm:border-b-0' :
                  idx === 1 ? 'border-b sm:border-b-0 sm:border-r' :
                  idx === 2 ? 'border-r' :
                  ''
                }`}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-safety-500/10 border border-safety-500/20 group-hover:bg-safety-500/20 transition-colors">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-safety-400" />
                </div>
                <div>
                  <p className="text-[12px] sm:text-[13px] font-bold text-white leading-tight">{label}</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          INDUSTRY MARQUEE TICKER
         ════════════════════════════════════════════ */}
      <div className="py-3 bg-navy-900 border-b border-navy-800/60 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee-scroll">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-3 px-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400/70 flex-shrink-0"
            >
              <span className="w-1 h-1 rounded-full bg-safety-500/60 flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════
          CATEGORIES — dynamic, admin-managed
         ════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-10 lg:mb-14 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-10 bg-safety-500 flex-shrink-0" />
                <span className="text-safety-500 text-xs font-bold uppercase tracking-[0.22em]">
                  Browse by Product Type
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display text-foreground leading-none">
                Shop by <span className="text-safety-500">Category</span>
              </h2>
              <p className="text-sm text-muted-foreground mt-3 max-w-sm leading-relaxed sm:hidden">
                From truck covers to biofloc tanks — find the right tarpaulin for your industry.
              </p>
            </div>
            <button
              onClick={scrollToProducts}
              className="hidden sm:flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-safety-500 transition-colors group flex-shrink-0"
            >
              View All Products
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {catLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {Array.from({ length: 4 }).map((_, i) => <CategorySkeleton key={i} />)}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16 border-2 border-dashed border-border">
              <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground font-medium">
                No categories yet. Add them from the Admin panel.
              </p>
            </div>
          ) : (
            <div className={`grid gap-4 lg:gap-5 ${
              categories.length === 1 ? 'grid-cols-1 max-w-sm' :
              categories.length === 2 ? 'grid-cols-2 max-w-lg' :
              categories.length === 3 ? 'grid-cols-2 sm:grid-cols-3' :
              'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
            }`}>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.id}`}
                  className="group relative overflow-hidden block focus:outline-none focus-visible:ring-2 focus-visible:ring-safety-500"
                  style={{ aspectRatio: '3/4' }}
                >
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-navy-700 to-slate-900" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/5 group-hover:from-black/80 transition-colors duration-500" />
                  <div className="absolute inset-0 p-4 lg:p-5 flex flex-col justify-end">
                    <h3 className="text-xl lg:text-2xl font-display text-white uppercase leading-tight mb-1 group-hover:text-safety-400 transition-colors duration-300">
                      {cat.name}
                    </h3>
                    {cat.description && (
                      <p className="text-[11px] text-white/55 leading-relaxed line-clamp-2 mb-3">
                        {cat.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-white/50 group-hover:text-safety-400 transition-colors duration-300">
                      Shop Now
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="sm:hidden mt-6 text-center">
            <button
              onClick={scrollToProducts}
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-safety-500 border border-safety-500/30 px-6 py-3 hover:bg-safety-500/5 transition-colors"
            >
              View All Products <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CTA — Ready to Protect Your Assets
         ════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 dark:from-slate-950 dark:via-navy-950 dark:to-slate-950">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-safety-500/8 rounded-full blur-3xl pointer-events-none" style={{ animation: 'float 9s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-[320px] h-[320px] bg-navy-400/10 rounded-full blur-3xl pointer-events-none" style={{ animation: 'float 11s ease-in-out infinite', animationDelay: '1.5s' }} />
        <div className="absolute inset-0 diagonal-stripe opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[2px] w-10 bg-safety-500/55 flex-shrink-0" />
                <span className="text-safety-400 text-xs font-bold uppercase tracking-[0.25em]">Get Started Today</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-display text-white leading-none mb-3">
                Ready to <span className="text-safety-500">Protect</span><br />Your Assets?
              </h2>
              <p className="text-white/60 text-sm leading-relaxed max-w-md">
                Get a custom quote in 2 hours. Our team will find the perfect tarpaulin
                for your exact requirements and budget.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="group flex items-center gap-3 bg-safety-500 hover:bg-safety-600 text-white px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all duration-200 hover:shadow-[0_0_36px_rgba(230,82,0,0.28)] active:scale-[0.98]"
              >
                Request a Quote
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => { globalThis.location.href = 'tel:+918385011488'; }}
                className="border-2 border-white/25 text-white hover:border-white/50 hover:bg-white/8 px-8 py-4 font-bold uppercase tracking-wider text-sm transition-all duration-200"
              >
                +91 83850 11488
              </button>
            </div>
          </div>
        </div>
      </section>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
};

export default Home;

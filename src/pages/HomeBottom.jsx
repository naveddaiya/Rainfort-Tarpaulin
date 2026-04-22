import { useState } from 'react';
import {
  Shield, Droplets, TrendingUp, Award, Star,
  BadgeCheck, Mail, ArrowRight, MapPin,
} from 'lucide-react';
import { QuoteModal } from '@/components/ui/quote-modal';

/* ─────────────────────────── Data ─────────────────────────── */

const STATS = [
  { value: '15,000+', label: 'Orders Delivered',  sub: 'Pan-India shipping' },
  { value: '50+',     label: 'Product Variants',   sub: 'Custom sizes available' },
  { value: '800+',    label: 'Enterprise Clients', sub: 'Across 20+ industries' },
  { value: '4.9★',   label: 'Customer Rating',    sub: 'Google & IndiaMART' },
];

const FEATURES = [
  {
    icon: Shield,
    title: 'Heavy-Duty Protection',
    description: 'Industrial-grade materials built to withstand the harshest conditions — rain, UV, abrasion, and more.',
    badge: 'Premium Build',
  },
  {
    icon: Droplets,
    title: '100% Waterproof',
    description: 'Multi-layer PVC coating delivers complete water resistance for all-weather reliability.',
    badge: 'Guaranteed',
  },
  {
    icon: TrendingUp,
    title: 'Long-Lasting',
    description: 'High-tenacity weave and UV stabilisation ensure years of performance without degradation.',
    badge: 'Proven',
  },
  {
    icon: Award,
    title: 'ISO Certified',
    description: 'Manufactured to meet international quality, safety, and environmental standards.',
    badge: 'Certified',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ramesh Patel',
    role: 'Site Supervisor',
    company: 'Patel Construction Pvt. Ltd.',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    review: 'RainFort tarpaulins have been our go-to for 3 years. They withstand harsh monsoons and UV without tearing. Excellent bulk pricing and on-time delivery every single time.',
    initial: 'R',
    colorClass: 'bg-navy-600',
  },
  {
    name: 'Sukhwinder Singh',
    role: 'Farm Owner',
    company: 'Singh Agro Farms',
    location: 'Ludhiana, Punjab',
    rating: 5,
    review: 'Ordered 200 pieces for crop storage and got exactly what was promised — heavy duty, 100% waterproof. The custom size option saved us a lot. Will reorder every season.',
    initial: 'S',
    colorClass: 'bg-safety-500',
  },
  {
    name: 'Arjun Mehra',
    role: 'Fleet Manager',
    company: 'Mehra Transport Co.',
    location: 'Delhi NCR',
    rating: 5,
    review: 'We cover 50+ trucks daily. Their truck tarpaulins handle highways, dust, and rains perfectly. Lasted 2 full years without replacement. Great after-sales support too.',
    initial: 'A',
    colorClass: 'bg-charcoal-600',
  },
  {
    name: 'Kavita Joshi',
    role: 'Procurement Head',
    company: 'BuildTech India',
    location: 'Pune, Maharashtra',
    rating: 5,
    review: 'We compare quotes from 5 suppliers each quarter. RainFort consistently wins on price AND quality. ISO certification gave us the compliance tick we needed.',
    initial: 'K',
    colorClass: 'bg-navy-700',
  },
  {
    name: 'Mohammed Iqbal',
    role: 'Warehouse Manager',
    company: 'Iqbal Cold Storage',
    location: 'Hyderabad, Telangana',
    rating: 4,
    review: 'The fire-retardant tarpaulins passed our safety audit without any issue. Quick delivery and responsive customer support. Highly recommend for industrial use.',
    initial: 'M',
    colorClass: 'bg-safety-600',
  },
  {
    name: 'Deepak Sharma',
    role: 'Owner',
    company: 'Sharma Exports',
    location: 'Jaipur, Rajasthan',
    rating: 5,
    review: 'Export-quality finish at a domestic price. We use these for covering export shipments and have had zero complaints from overseas buyers about packaging quality.',
    initial: 'D',
    colorClass: 'bg-navy-600',
  },
];

/* ─────────────────────────── Component ─────────────────────── */

const HomeBottom = () => {
  const [newsletterEmail, setNewsletterEmail]         = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen]       = useState(false);

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) setNewsletterSubmitted(true);
  };

  return (
    <>
      {/* ════════════════════════════════════════════
          STATS COUNTER — social proof numbers
         ════════════════════════════════════════════ */}
      <section className="relative bg-slate-900 dark:bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 diagonal-stripe opacity-20 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-white/8">
            {STATS.map(({ value, label, sub }) => (
              <div
                key={label}
                className="group flex flex-col items-center justify-center text-center px-6 py-10 lg:py-14 hover:bg-white/3 transition-colors duration-300"
              >
                <p
                  className="font-hero text-white leading-none mb-1.5 group-hover:text-safety-400 transition-colors duration-300"
                  style={{ fontSize: 'clamp(30px, 5vw, 56px)' }}
                >
                  {value}
                </p>
                <p className="text-[12px] sm:text-[13px] font-bold text-white/80 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          WHY CHOOSE US — feature grid
         ════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 bg-background relative overflow-hidden">
        <div className="absolute inset-0 dot-grid pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-14 lg:mb-16">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-[2px] w-10 bg-safety-500 flex-shrink-0" />
              <span className="text-safety-500 text-xs font-bold uppercase tracking-[0.22em]">Why Choose Us</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display text-foreground leading-none mb-5">
              Built for{' '}<span className="text-safety-500">Extreme</span>
              <br className="hidden sm:block" />{' '}Conditions
            </h2>
            <p className="text-[1.05rem] text-muted-foreground max-w-2xl leading-relaxed">
              Every RainFort product is engineered with industrial-grade materials, tested
              for unmatched protection across monsoon fields, desert highways, and
              open construction sites.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, index) => (
              <div
                key={index}
                className="group relative border border-border hover:border-safety-500/40 bg-card p-7 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                <span className="absolute -bottom-3 -right-1 text-[96px] font-display font-bold leading-none text-border/35 select-none group-hover:text-safety-500/8 transition-colors duration-300 pointer-events-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-safety-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-center" />

                <div className="relative z-10">
                  <div className="w-14 h-14 flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 bg-gradient-to-br from-navy-600 to-navy-800 dark:from-navy-500 dark:to-navy-700 group-hover:from-safety-600 group-hover:to-navy-700">
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-display text-foreground mb-3">{feature.title}</h3>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-5">{feature.description}</p>
                  <div className="pt-4 border-t border-border">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-safety-500">{feature.badge}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          CLIENT REVIEWS — testimonials
         ════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-muted/25 dark:bg-muted/10">
        <div className="absolute inset-0 diagonal-stripe opacity-35 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-[2px] w-10 bg-safety-500 flex-shrink-0" />
              <span className="text-safety-500 text-xs font-bold uppercase tracking-[0.22em]">Client Reviews</span>
              <div className="h-[2px] w-10 bg-safety-500 flex-shrink-0" />
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display text-foreground leading-none">
              Trusted by{' '}<span className="text-safety-500">Industry</span>
              <br className="hidden sm:block" />{' '}Leaders
            </h2>
            <p className="text-sm text-muted-foreground mt-4 max-w-xl mx-auto leading-relaxed">
              From construction sites to fish farms, thousands of businesses across India
              rely on RainFort for consistent quality and reliable on-time delivery.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div
                key={t.name}
                className="group bg-card border border-border hover:border-safety-500/30 p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-safety-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="text-[80px] leading-none text-safety-500/18 font-serif mb-2 select-none -mt-1" aria-hidden="true">"</div>

                <div className="flex gap-0.5 mb-4">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} className={`h-4 w-4 ${s <= t.rating ? 'fill-amber-400 text-amber-400' : 'text-border'}`} />
                  ))}
                </div>

                <p className="text-[13.5px] text-muted-foreground leading-relaxed flex-1 mb-6">{t.review}</p>

                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <div className={`w-10 h-10 ${t.colorClass} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                    {t.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold truncate">{t.name}</p>
                    <p className="text-[11.5px] text-muted-foreground truncate">{t.role}, {t.company}</p>
                    <p className="text-[10.5px] text-muted-foreground/60 mt-0.5 flex items-center gap-1">
                      <MapPin className="h-2.5 w-2.5 flex-shrink-0" />
                      {t.location}
                    </p>
                  </div>
                  <div className="ml-auto flex-shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/25 px-2 py-0.5">
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Aggregate rating — full-width band */}
          <div className="mt-12 bg-card border border-border shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-center divide-y sm:divide-y-0 sm:divide-x divide-border">
              <div className="flex flex-col items-center justify-center px-10 py-8 gap-2">
                <p className="text-5xl font-bold text-foreground leading-none">4.9</p>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-[11px] text-muted-foreground">Average Rating</p>
              </div>
              <div className="flex flex-col items-center justify-center px-10 py-8 gap-1">
                <p className="text-3xl font-bold text-foreground">200+</p>
                <p className="text-[12px] font-bold text-foreground/80">Verified Reviews</p>
                <p className="text-[11px] text-muted-foreground">Google · IndiaMART · Trade India</p>
              </div>
              <div className="flex flex-col items-center justify-center px-10 py-8 gap-1">
                <p className="text-3xl font-bold text-foreground">98%</p>
                <p className="text-[12px] font-bold text-foreground/80">Would Recommend</p>
                <p className="text-[11px] text-muted-foreground">Based on repeat purchase data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          NEWSLETTER — subscription
         ════════════════════════════════════════════ */}
      <section className="py-14 lg:py-16 border-y border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <div className="text-center lg:text-left max-w-xl flex-1">
              <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                <Mail className="h-4 w-4 text-safety-500" />
                <span className="text-safety-500 text-xs font-bold uppercase tracking-[0.22em]">Stay Connected</span>
              </div>
              <h3 className="text-3xl lg:text-5xl font-display text-foreground leading-none mb-3">
                Get Exclusive <span className="text-safety-500">Deals</span>
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto lg:mx-0">
                Subscribe for bulk discounts, new product launches, and industrial
                insights. Be first to hear about seasonal offers. No spam — ever.
              </p>
            </div>

            <div className="w-full max-w-md flex-shrink-0">
              {!newsletterSubmitted ? (
                <form onSubmit={handleNewsletter}>
                  <div className="flex gap-0 border-2 border-border focus-within:border-safety-500 transition-colors duration-200">
                    <input
                      type="email"
                      value={newsletterEmail}
                      onChange={e => setNewsletterEmail(e.target.value)}
                      placeholder="Enter your business email"
                      required
                      className="flex-1 px-5 py-4 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none text-sm border-0"
                    />
                    <button type="submit" className="bg-safety-500 hover:bg-safety-600 text-white px-6 py-4 font-bold uppercase tracking-wider text-[12px] transition-colors duration-200 flex-shrink-0 flex items-center gap-2 group">
                      <span className="hidden sm:block">Subscribe</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2.5 pl-1">
                    Join 1,200+ industrial buyers. Unsubscribe anytime.
                  </p>
                </form>
              ) : (
                <div className="flex items-center gap-3 p-5 border-2 border-emerald-500/40 bg-emerald-500/5">
                  <BadgeCheck className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">You're in! Exclusive deals incoming.</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">Check {newsletterEmail} for a welcome offer.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          DARK CTA — dramatic close
         ════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 dark:from-slate-950 dark:via-navy-950 dark:to-slate-950">
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-safety-500/8 rounded-full blur-3xl pointer-events-none" style={{ animation: 'float 9s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-navy-400/10 rounded-full blur-3xl pointer-events-none" style={{ animation: 'float 11s ease-in-out infinite', animationDelay: '1.5s' }} />
        <div className="absolute inset-0 diagonal-stripe opacity-20 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-7">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[2px] w-10 bg-safety-500/55 flex-shrink-0" />
            <span className="text-safety-400 text-xs font-bold uppercase tracking-[0.25em]">Get Started Today</span>
            <div className="h-[2px] w-10 bg-safety-500/55 flex-shrink-0" />
          </div>

          <h2 className="text-5xl lg:text-8xl font-display text-white leading-none">
            Ready to{' '}<span className="text-safety-500">Protect</span><br />Your Assets?
          </h2>

          <p className="text-[1.1rem] text-white/65 max-w-2xl mx-auto leading-relaxed">
            Get a custom quote for your project. Our team is ready to help you find
            the perfect tarpaulin solution — delivered anywhere in India within 72 hours.
          </p>

          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="group flex items-center gap-3 bg-safety-500 hover:bg-safety-600 text-white px-10 py-5 font-bold uppercase tracking-wider text-base transition-all duration-200 hover:shadow-[0_0_36px_rgba(230,82,0,0.28)] active:scale-[0.98]"
            >
              Request a Quote
              <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
            </button>
            <button
              onClick={() => { globalThis.location.href = 'tel:+918385011488'; }}
              className="border-2 border-white/25 text-white hover:border-white/50 hover:bg-white/8 px-10 py-5 font-bold uppercase tracking-wider text-base transition-all duration-200"
            >
              Call: +91 83850 11488
            </button>
          </div>
        </div>
      </section>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </>
  );
};

export default HomeBottom;

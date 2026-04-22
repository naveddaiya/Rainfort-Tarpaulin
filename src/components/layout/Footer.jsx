import { Link } from 'react-router-dom';
import { Linkedin, Facebook, Instagram, Phone, Mail, MapPin, Clock } from 'lucide-react';

/* ─────────── Social links ─────────── */
const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    href: 'https://www.linkedin.com/company/rainfort',
    label: 'Follow us on LinkedIn',
    hoverBg: 'hover:bg-[#0A66C2] hover:border-[#0A66C2]',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    href: 'https://www.facebook.com/share/17CUhuuK89/',
    label: 'Like us on Facebook',
    hoverBg: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    href: 'https://www.instagram.com/rainfort_tarpaulin',
    label: 'Follow us on Instagram',
    hoverBg: 'hover:bg-[#E1306C] hover:border-[#E1306C]',
  },
  {
    name: 'WhatsApp',
    icon: null, // custom SVG below
    href: 'https://wa.me/918385011488',
    label: 'Chat with us on WhatsApp',
    hoverBg: 'hover:bg-[#25D366] hover:border-[#25D366]',
  },
];

const WhatsAppIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ─────────── Navigation data ─────────── */
const SECTION_LINKS = [
  { href: '#home',         label: 'Home',         scrollId: 'home' },
  { href: '#products',     label: 'Products',     scrollId: 'products' },
  { href: '#applications', label: 'Applications', scrollId: 'applications' },
  { href: '#about',        label: 'About',        scrollId: 'about' },
  { href: '#contact',      label: 'Contact',      scrollId: 'contact' },
];

const PAGE_LINKS = [
  { to: '/cart',     label: 'My Cart' },
  { to: '/orders',   label: 'My Orders' },
  { to: '/wishlist', label: 'Wishlist' },
  { to: '/profile',  label: 'My Profile' },
];

const CONTACT_ITEMS = [
  { icon: Phone,   text: '+91 83850 11488', href: 'tel:+918385011488' },
  { icon: Mail,    text: 'enquiry@rainfort.in', href: 'mailto:enquiry@rainfort.in' },
  { icon: MapPin,  text: 'Sujangarh, Rajasthan, India', href: null },
  { icon: Clock,   text: 'Mon – Sun: 9:00 AM – 6:00 PM', href: null },
];

const handleSectionClick = (e, scrollId) => {
  e.preventDefault();
  const el = document.getElementById(scrollId);
  if (el) {
    window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  } else {
    window.location.href = `/#${scrollId}`;
  }
};

/* ─────────── Component ─────────── */
const Footer = () => {
  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      {/* Top orange accent border */}
      <div className="h-[3px] bg-gradient-to-r from-transparent via-safety-500 to-transparent" />

      {/* Subtle background pattern */}
      <div className="absolute inset-0 diagonal-stripe opacity-15 pointer-events-none" />

      {/* ── Social media strip ── */}
      <div className="relative z-10 border-b border-white/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-3 mb-2">
                <div className="h-[2px] w-8 bg-safety-500/60" />
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-safety-400">
                  Stay Connected
                </p>
                <div className="h-[2px] w-8 bg-safety-500/60" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-display text-white">
                Follow Us on Social Media
              </h2>
              <p className="text-white/48 max-w-md mx-auto text-[13.5px] leading-relaxed">
                Stay updated with our latest products, offers, and industry news.
              </p>
            </div>

            {/* Social buttons */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              {SOCIAL_LINKS.map(({ name, icon: Icon, href, label, hoverBg }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`group flex items-center gap-2.5 px-5 py-2.5 border border-white/14 bg-white/4 ${hoverBg} text-white transition-all duration-250 hover:scale-[1.04] hover:shadow-lg hover:shadow-black/30 hover:border-transparent active:scale-95`}
                >
                  {Icon
                    ? <Icon className="w-4.5 h-4.5 flex-shrink-0 w-[18px] h-[18px]" />
                    : <WhatsAppIcon className="w-[18px] h-[18px] flex-shrink-0" />}
                  <span className="text-[12px] font-bold uppercase tracking-wider">{name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <img
                src="/rainfort-logo.png"
                alt="RainFort Tarpaulin"
                className="object-contain flex-shrink-0"
                style={{ height: '48px', width: '48px' }}
              />
              <div className="flex flex-col">
                <span className="text-[15px] font-bold uppercase tracking-wider text-white">RainFort</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">Tarpaulin</span>
              </div>
            </div>
            <p className="text-[13px] text-white/48 leading-relaxed max-w-xs">
              Industrial-grade tarpaulin solutions engineered for construction,
              agriculture, and transportation. ISO 9001 certified since 2016.
            </p>
            {/* Mini trust badges */}
            <div className="flex flex-wrap gap-2 pt-1">
              {['ISO 9001', '8+ Years', '800+ Projects'].map(badge => (
                <span
                  key={badge}
                  className="text-[10px] font-bold uppercase tracking-wider text-safety-400 bg-safety-500/10 border border-safety-500/20 px-2 py-0.5"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-safety-400 flex items-center gap-2">
              <div className="h-[2px] w-6 bg-safety-500" />
              Quick Links
            </h3>
            <ul className="space-y-2">
              {SECTION_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={e => handleSectionClick(e, link.scrollId)}
                    className="text-[13px] text-white/48 hover:text-white hover:translate-x-1.5 inline-flex items-center gap-1.5 transition-all duration-200 group"
                  >
                    <span className="h-[1.5px] w-3 bg-safety-500/40 group-hover:w-4 group-hover:bg-safety-500 transition-all duration-200 flex-shrink-0" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* My Account */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-safety-400 flex items-center gap-2">
              <div className="h-[2px] w-6 bg-safety-500" />
              My Account
            </h3>
            <ul className="space-y-2">
              {PAGE_LINKS.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-[13px] text-white/48 hover:text-white hover:translate-x-1.5 inline-flex items-center gap-1.5 transition-all duration-200 group"
                  >
                    <span className="h-[1.5px] w-3 bg-safety-500/40 group-hover:w-4 group-hover:bg-safety-500 transition-all duration-200 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://wa.me/918385011488"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-white/48 hover:text-white hover:translate-x-1.5 inline-flex items-center gap-1.5 transition-all duration-200 group"
                >
                  <span className="h-[1.5px] w-3 bg-safety-500/40 group-hover:w-4 group-hover:bg-safety-500 transition-all duration-200 flex-shrink-0" />
                  WhatsApp Order
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-safety-400 flex items-center gap-2">
              <div className="h-[2px] w-6 bg-safety-500" />
              Contact Us
            </h3>
            <ul className="space-y-3">
              {CONTACT_ITEMS.map(({ icon: Icon, text, href }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <Icon className="h-3.5 w-3.5 text-safety-500 flex-shrink-0 mt-0.5" />
                  {href ? (
                    <a
                      href={href}
                      className="text-[13px] text-white/48 hover:text-white transition-colors"
                    >
                      {text}
                    </a>
                  ) : (
                    <span className="text-[13px] text-white/48">{text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Copyright bar ── */}
        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-white/30">
          <p>© {new Date().getFullYear()} RainFort Tarpaulin. All rights reserved.</p>
          <p>Engineered for Industrial Excellence · India</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

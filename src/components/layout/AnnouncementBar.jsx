/**
 * AnnouncementBar — scrolling offer ticker at the very top of every page.
 * Dismisses per session (no re-show on refresh, gone until next session).
 * Matches patterns used by Flipkart, Myntra, IndiaMART, Amazon.
 */

import { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';

const OFFERS = [
  { emoji: '🚚', text: 'Free delivery on bulk orders above ₹10,000' },
  { emoji: '🏭', text: 'ISO Certified — Trusted by 5,000+ industrial clients' },
  { emoji: '⚡', text: 'Custom sizes on request — Quote confirmed in 2 hours' },
  { emoji: '🌧️', text: 'Monsoon-ready stock: Heavy Duty HDPE & PVC Tarpaulins' },
  { emoji: '📞', text: '24/7 Support: +91 83850 11488 | WhatsApp Order Available' },
  { emoji: '🇮🇳', text: 'Made in India — Export quality at domestic prices' },
  { emoji: '💰', text: 'Bulk discount up to 15% — Call or WhatsApp to know more' },
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show unless dismissed this session
    const dismissed = sessionStorage.getItem('rf_announcement_dismissed');
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem('rf_announcement_dismissed', '1');
  };

  if (!visible) return null;

  // Duplicate array so the seamless marquee loop works
  const doubled = [...OFFERS, ...OFFERS];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white select-none">
      <div className="flex items-stretch h-9">

        {/* Left accent pill — "HOT DEALS" / offers label */}
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-safety-500 px-3 z-10">
          <Zap className="h-3.5 w-3.5 text-white fill-white" />
          <span className="text-[10px] font-black uppercase tracking-widest text-white hidden sm:block">
            Offers
          </span>
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden relative">
          {/* Left fade mask */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-navy-800 to-transparent z-10 pointer-events-none" />
          {/* Right fade mask */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-navy-800 to-transparent z-10 pointer-events-none" />

          <div className="flex animate-marquee whitespace-nowrap h-full items-center">
            {doubled.map((item, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-2 text-[11px] font-medium text-white/85 px-10"
              >
                <span className="text-sm">{item.emoji}</span>
                <span>{item.text}</span>
                <span className="text-safety-400 font-bold mx-2">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Dismiss button */}
        <button
          onClick={dismiss}
          className="flex-shrink-0 flex items-center px-3 hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          aria-label="Close announcement bar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

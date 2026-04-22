import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, ShoppingCart, LogOut, ClipboardList, User, Heart } from 'lucide-react';
import { QuoteModal } from '@/components/ui/quote-modal';
import { AuthModal } from '@/components/ui/auth-modal';
import { useTheme } from '@/components/theme-provider';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { cn } from '@/lib/utils';

/* Deep forge navy — brand signature colour that never changes */
const NAV_DARK = '#030d1a';

const IndustrialNav = () => {
  const [isScrolled, setIsScrolled]             = useState(false);
  const [isVisible, setIsVisible]               = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen]   = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen]     = useState(false);

  const { theme, setTheme }               = useTheme();
  const { totalItems }                    = useCart();
  const { user, signOut }                 = useAuth();
  const { totalItems: wishlistCount }     = useWishlist();
  const location                          = useLocation();
  const navigate                          = useNavigate();
  const isHomePage                        = location.pathname === '/';
  const userMenuRef                       = useRef(null);
  const lastScrollYRef                    = useRef(0);
  const ticking                           = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const cur = window.scrollY;
      setIsScrolled(cur > 30);
      if (cur > lastScrollYRef.current && cur > 120) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }
      lastScrollYRef.current = cur;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setIsUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navLinks = [
    { href: '#home',         label: 'Home',         scrollId: 'home' },
    { href: '#products',     label: 'Products',     scrollId: 'products' },
    { href: '#applications', label: 'Applications', scrollId: 'applications' },
    { href: '#about',        label: 'About',        scrollId: 'about' },
    { href: '#contact',      label: 'Contact',      scrollId: 'contact' },
  ];

  const handleNavClick = (e, link) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (!isHomePage) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(link.scrollId);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
      }, 300);
      return;
    }
    const el = document.getElementById(link.scrollId);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const handleSignOut = async () => {
    setIsUserMenuOpen(false);
    await signOut();
    navigate('/');
  };

  return (
    <>
      <nav
        style={{ backgroundColor: NAV_DARK }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'border-b border-white/8 shadow-[0_4px_32px_rgba(0,0,0,0.45)]'
            : 'border-b border-white/6',
          isVisible ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        {/* Safety-orange top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-safety-500 to-transparent opacity-85" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className={cn(
            'flex items-center justify-between transition-all duration-400',
            isScrolled ? 'h-16' : 'h-[72px]',
          )}>

            {/* ── Logo ── */}
            <a
              href="#home"
              onClick={e => handleNavClick(e, { scrollId: 'home' })}
              className="flex items-center gap-2.5 group flex-shrink-0"
            >
              <img
                src="/rainfort-logo.png"
                alt="RainFort Tarpaulin"
                width={44} height={44}
                fetchPriority="high" decoding="async"
                className="object-contain flex-shrink-0 group-hover:scale-[1.04] transition-transform duration-300"
                style={{ height: '44px', width: '44px' }}
              />
              <div className="flex flex-col">
                <span className="text-[16px] font-bold uppercase tracking-wide text-white group-hover:text-safety-300 transition-colors duration-200">
                  RainFort
                </span>
                <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/30">
                  Tarpaulin
                </span>
              </div>
            </a>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden lg:flex items-center">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => handleNavClick(e, link)}
                  className="relative px-4 py-2.5 group overflow-hidden"
                >
                  <span className="block text-[12px] font-bold uppercase tracking-wider text-white/55 group-hover:text-white group-hover:-translate-y-px transition-all duration-200">
                    {link.label}
                  </span>
                  {/* Orange underline sweeps in from left */}
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] bg-gradient-to-r from-safety-500 to-safety-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </a>
              ))}
            </div>

            {/* ── Desktop Actions ── */}
            <div className="hidden lg:flex items-center gap-1">

              {/* Theme toggle */}
              <button
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              {/* Wishlist */}
              <Link to="/wishlist" className="relative">
                <button
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label="Wishlist"
                >
                  <Heart className={cn('h-4 w-4', wishlistCount > 0 ? 'fill-red-500 text-red-400' : '')} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full h-[16px] w-[16px] flex items-center justify-center leading-none">
                      {wishlistCount > 9 ? '9+' : wishlistCount}
                    </span>
                  )}
                </button>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative">
                <button
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white/45 hover:text-white hover:bg-white/10 transition-all duration-200"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-safety-500 text-white text-[9px] font-bold rounded-full h-[16px] w-[16px] flex items-center justify-center leading-none">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </button>
              </Link>

              {/* Thin separator */}
              <div className="w-px h-5 bg-white/10 mx-1.5" />

              {/* User — logged in */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-white/15 hover:border-white/30 hover:bg-white/8 transition-all duration-200"
                  >
                    <img
                      src={user.photoURL || ''}
                      alt={user.displayName || 'User'}
                      className="h-6 w-6 rounded-full border border-white/20 object-cover"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-[12px] font-bold max-w-[80px] truncate text-white/80">
                      {user.displayName?.split(' ')[0]}
                    </span>
                  </button>

                  {isUserMenuOpen && (
                    <div
                      className="absolute right-0 top-11 w-52 border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      style={{ backgroundColor: '#061525' }}
                    >
                      <div className="px-4 py-2.5 border-b border-white/8 mb-1">
                        <p className="text-[12px] font-bold text-white truncate">{user.displayName}</p>
                        <p className="text-[11px] text-white/38 truncate">{user.email}</p>
                      </div>
                      <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-white/65 hover:text-white hover:bg-white/6 transition-colors">
                        <User className="h-3.5 w-3.5 flex-shrink-0" /> My Profile
                      </Link>
                      <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-white/65 hover:text-white hover:bg-white/6 transition-colors">
                        <ClipboardList className="h-3.5 w-3.5 flex-shrink-0" /> My Orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-white/65 hover:text-white hover:bg-white/6 transition-colors">
                        <Heart className="h-3.5 w-3.5 flex-shrink-0" /> Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ''}
                      </Link>
                      <div className="my-1 border-t border-white/8" />
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-red-400 hover:text-red-300 hover:bg-red-500/8 transition-colors text-left"
                      >
                        <LogOut className="h-3.5 w-3.5 flex-shrink-0" /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="flex items-center gap-1.5 px-4 py-2 border border-white/20 text-white/70 hover:border-safety-400/60 hover:text-white hover:bg-white/6 text-[12px] font-bold uppercase tracking-wider transition-all duration-200"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="h-3.5 w-3.5" /> Sign In
                </button>
              )}

              {/* Get Quote — pill gradient CTA */}
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                className="relative overflow-hidden ml-2 rounded-full bg-gradient-to-r from-safety-500 to-[#e85200] text-white px-5 py-[9px] text-[12px] font-bold uppercase tracking-wider transition-all duration-300 shadow-[0_0_0_1px_rgba(255,107,0,0.3),0_4px_14px_rgba(255,107,0,0.22)] hover:shadow-[0_0_0_1px_rgba(255,107,0,0.55),0_6px_22px_rgba(255,107,0,0.40)] active:scale-[0.96] group"
              >
                <span className="relative z-10">Get Quote</span>
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 pointer-events-none" />
              </button>
            </div>

            {/* ── Mobile Right ── */}
            <div className="lg:hidden flex items-center gap-1.5">
              <Link to="/cart" className="relative">
                <button className="w-9 h-9 rounded-full flex items-center justify-center text-white/55 hover:text-white hover:bg-white/10 transition-all" aria-label="Cart">
                  <ShoppingCart className="h-4 w-4" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-safety-500 text-white text-[9px] font-bold rounded-full h-[16px] w-[16px] flex items-center justify-center">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </button>
              </Link>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-9 h-9 flex items-center justify-center border border-white/18 text-white/65 hover:bg-white/10 hover:text-white transition-all duration-200"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* ── Mobile Menu ── */}
          <div
            id="mobile-menu"
            className={cn(
              'lg:hidden overflow-hidden transition-all duration-400 ease-in-out',
              isMobileMenuOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="border-t border-white/8 pb-4">
              <div className="pt-1.5 space-y-px">
                {navLinks.map(link => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={e => handleNavClick(e, link)}
                    className="block px-5 py-3.5 text-[12px] font-bold uppercase tracking-wider text-white/55 hover:text-white hover:bg-white/6 border-l-2 border-transparent hover:border-safety-500 transition-all duration-200 hover:pl-7"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              <div className="px-4 pt-4 border-t border-white/8 mt-2 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 px-1 py-2">
                      <img src={user.photoURL || ''} alt="" className="h-8 w-8 rounded-full border border-white/20"
                        onError={e => { e.target.style.display = 'none'; }} />
                      <div>
                        <p className="text-[12px] font-bold text-white">{user.displayName}</p>
                        <p className="text-[10px] text-white/38">{user.email}</p>
                      </div>
                    </div>
                    <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium text-white/65 hover:text-white border border-white/10 hover:border-white/22 hover:bg-white/6 transition-all">
                        <User className="h-3.5 w-3.5" /> My Profile
                      </button>
                    </Link>
                    <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium text-white/65 hover:text-white border border-white/10 hover:border-white/22 hover:bg-white/6 transition-all mt-1.5">
                        <ClipboardList className="h-3.5 w-3.5" /> My Orders
                      </button>
                    </Link>
                    <button
                      onClick={() => { setIsMobileMenuOpen(false); handleSignOut(); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-400/40 hover:bg-red-500/8 transition-all mt-1.5"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="w-full flex items-center justify-center gap-2 py-2.5 border border-white/20 text-white/70 hover:border-safety-400/50 hover:text-white text-[12px] font-bold uppercase tracking-wider transition-all"
                      onClick={() => { setIsAuthModalOpen(true); setIsMobileMenuOpen(false); }}
                    >
                      <User className="h-4 w-4" /> Sign In
                    </button>
                    <button
                      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                      className="w-full flex items-center gap-2 px-4 py-2.5 border border-white/10 text-white/45 hover:text-white/80 text-[12px] font-medium transition-all hover:bg-white/5"
                    >
                      {theme === 'light'
                        ? <><Moon className="h-4 w-4" /><span>Dark Mode</span></>
                        : <><Sun  className="h-4 w-4" /><span>Light Mode</span></>}
                    </button>
                    <button
                      className="w-full relative overflow-hidden rounded-full bg-gradient-to-r from-safety-500 to-[#e85200] text-white py-3 text-[12px] font-bold uppercase tracking-wider transition-all shadow-[0_4px_14px_rgba(255,107,0,0.25)] group"
                      onClick={() => { setIsQuoteModalOpen(true); setIsMobileMenuOpen(false); }}
                    >
                      <span className="relative z-10">Get Quote</span>
                      <span className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/22 to-transparent translate-x-[-110%] group-hover:translate-x-[110%] transition-transform duration-500 pointer-events-none" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
      <AuthModal  isOpen={isAuthModalOpen}  onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default IndustrialNav;

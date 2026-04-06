import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuoteModal } from '@/components/ui/quote-modal';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const IndustrialNav = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const lastScrollYRef = useRef(0);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;

    requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      const prevScrollY = lastScrollYRef.current;

      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > prevScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsMobileMenuOpen(false);
      } else {
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
      ticking.current = false;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#products', label: 'Products' },
    { href: '#applications', label: 'Applications' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);

    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const navHeight = 80; // Height of navbar
      const targetPosition = targetElement.offsetTop - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-transform duration-300",
          isScrolled
            ? "bg-background border-b border-border shadow-md"
            : "bg-background/95",
          isVisible ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, '#home')}
              className="flex items-center -ml-6 hover:opacity-90 transition-all duration-300 hover:scale-105"
            >
              <img
                src="/new-optimized.webp"
                alt="RainFort Tarpaulin - Industrial Grade Waterproof Covers"
                width={80}
                height={80}
                fetchPriority="high"
                decoding="async"
                className="h-20 w-auto object-contain mt-1"
              />
              <div className="flex flex-col -ml-8">
                <span className="text-lg font-bold uppercase tracking-wider bg-gradient-to-r from-navy-600 to-orange-600 bg-clip-text text-transparent">
                  RainFort
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tarpaulin
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-4 py-2 text-sm font-bold uppercase tracking-wider text-foreground hover:text-navy-500 hover:bg-muted/50 transition-all duration-300 ease-out border-b-2 border-transparent hover:border-navy-500 hover:-translate-y-0.5 hover:shadow-md"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right Section */}
            <div className="hidden lg:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="border-2"
              >
                {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </Button>
              <Button variant="accent" size="sm" onClick={() => setIsQuoteModalOpen(true)}>
                Get Quote
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 border-2 border-border bg-background hover:bg-muted transition-all duration-300 ease-out hover:scale-[1.05] hover:shadow-lg active:scale-95 mr-2"
              aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            id="mobile-menu"
            className={cn(
              "lg:hidden overflow-hidden transition-all duration-500 ease-in-out",
              isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
            )}
          >
            <div className="border-t-2 border-border bg-gradient-to-b from-background via-muted/20 to-background">
              <div className="py-4 space-y-1">
                {navLinks.map((link, index) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className={cn(
                      "block px-6 py-4 text-base font-bold uppercase tracking-wider text-foreground",
                      "hover:bg-navy-500/10 hover:text-navy-500",
                      "border-l-4 border-transparent hover:border-navy-500",
                      "transition-all duration-300 transform hover:translate-x-2",
                      "animate-in slide-in-from-left",
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationDuration: '300ms',
                      animationFillMode: 'both'
                    }}
                  >
                    {link.label}
                  </a>
                ))}

                <div className="px-4 pt-6 pb-2 space-y-3 animate-in fade-in slide-in-from-bottom" style={{ animationDelay: '250ms', animationDuration: '400ms' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                    className="w-full justify-start border-2"
                  >
                    {theme === "light" ? (
                      <>
                        <Moon className="mr-2 h-4 w-4" /> Dark Mode
                      </>
                    ) : (
                      <>
                        <Sun className="mr-2 h-4 w-4" /> Light Mode
                      </>
                    )}
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    className="w-full hover:scale-105 transition-transform shadow-lg"
                    onClick={() => {
                      setIsQuoteModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Get Quote
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </nav>
      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
};

export default IndustrialNav;

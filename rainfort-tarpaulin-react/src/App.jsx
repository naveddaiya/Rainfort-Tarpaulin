import { useState, useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from './components/theme-provider';
import IndustrialNav from './components/layout/IndustrialNav';
import Home from './pages/Home';

// Lazy load below-the-fold components for better performance
const Products = lazy(() => import('./pages/Products'));
const Applications = lazy(() => import('./pages/Applications'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
// Lazy load QuoteModal since it appears after 8 seconds
const QuoteModal = lazy(() => import('./components/ui/quote-modal').then(m => ({ default: m.QuoteModal })));

// Loading fallback component
const SectionLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [isAutoPopupOpen, setIsAutoPopupOpen] = useState(false);

  useEffect(() => {
    // Check if popup was shown in last 24 hours
    const lastShown = localStorage.getItem('quotePopupLastShown');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (!lastShown || (now - parseInt(lastShown)) > oneDay) {
      // Show popup after 8 seconds (industry best practice)
      const timer = setTimeout(() => {
        setIsAutoPopupOpen(true);
        localStorage.setItem('quotePopupLastShown', now.toString());
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="tarpaulin-theme">
      <div className="relative min-h-screen overflow-x-hidden">
        <IndustrialNav />
        <main>
          <Home />
          <Suspense fallback={<SectionLoader />}>
            <Products />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <Applications />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        </main>

        {/* Auto-popup Quote Modal - lazy loaded */}
        {isAutoPopupOpen && (
          <Suspense fallback={null}>
            <QuoteModal
              isOpen={isAutoPopupOpen}
              onClose={() => setIsAutoPopupOpen(false)}
            />
          </Suspense>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;

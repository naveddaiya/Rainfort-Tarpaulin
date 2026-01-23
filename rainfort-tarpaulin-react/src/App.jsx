import { useState, useEffect } from 'react';
import { ThemeProvider } from './components/theme-provider';
import IndustrialNav from './components/layout/IndustrialNav';
import Home from './pages/Home';
import Products from './pages/Products';
import Applications from './pages/Applications';
import About from './pages/About';
import Contact from './pages/Contact';
import { QuoteModal } from './components/ui/quote-modal';

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
        <Home />
        <Products />
        <Applications />
        <About />
        <Contact />
        
        {/* Auto-popup Quote Modal */}
        <QuoteModal
          isOpen={isAutoPopupOpen}
          onClose={() => setIsAutoPopupOpen(false)}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;

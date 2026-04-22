import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import IndustrialNav from './components/layout/IndustrialNav';
import Footer from './components/layout/Footer';
import FloatingActions from './components/ui/FloatingActions';
import Home from './pages/Home';
import HomeBottom from './pages/HomeBottom';

const Products = lazy(() => import('./pages/Products'));
const Applications = lazy(() => import('./pages/Applications'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Admin = lazy(() => import('./pages/Admin'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Profile = lazy(() => import('./pages/Profile'));
const CategoryProducts = lazy(() => import('./pages/CategoryProducts'));
const QuoteModal = lazy(() => import('./components/ui/quote-modal').then(m => ({ default: m.QuoteModal })));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const SectionLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const HomePage = () => {
  const [isAutoPopupOpen, setIsAutoPopupOpen] = useState(false);

  useEffect(() => {
    const lastShown = localStorage.getItem('quotePopupLastShown');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    if (!lastShown || now - parseInt(lastShown) > oneDay) {
      const timer = setTimeout(() => {
        setIsAutoPopupOpen(true);
        localStorage.setItem('quotePopupLastShown', now.toString());
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      <main>
        <Home />
        <Suspense fallback={<SectionLoader />}><Products /></Suspense>
        <HomeBottom />
        <Suspense fallback={<SectionLoader />}><Applications /></Suspense>
        <Suspense fallback={<SectionLoader />}><About /></Suspense>
        <Suspense fallback={<SectionLoader />}><Contact /></Suspense>
      </main>
      {isAutoPopupOpen && (
        <Suspense fallback={null}>
          <QuoteModal isOpen={isAutoPopupOpen} onClose={() => setIsAutoPopupOpen(false)} />
        </Suspense>
      )}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="tarpaulin-theme">
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
            <div className="relative min-h-screen overflow-x-hidden">
              <ScrollToTop />
              <IndustrialNav />
              <FloatingActions />
              <Suspense fallback={<SectionLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/category/:categoryId" element={<CategoryProducts />} />
                  <Route path="/admin" element={<Admin />} />
                </Routes>
              </Suspense>
              <Footer />
            </div>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
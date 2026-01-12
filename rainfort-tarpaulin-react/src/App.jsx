import { ThemeProvider } from './components/theme-provider';
import IndustrialNav from './components/layout/IndustrialNav';
import Home from './pages/Home';
import Products from './pages/Products';
import Applications from './pages/Applications';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="tarpaulin-theme">
      <div className="relative min-h-screen">
        <IndustrialNav />
        <Home />
        <Products />
        <Applications />
        <About />
        <Contact />
      </div>
    </ThemeProvider>
  );
}

export default App;

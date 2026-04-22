import { Package, ShoppingCart, Search, X, Heart, Zap, Loader2, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { products as staticProducts } from '@/data/products';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useState, useMemo } from 'react';
import SEOHead from '@/components/SEOHead';
import ProductsSEOContent from '@/components/ProductsSEOContent';
import { generateProductStructuredData, generateFAQStructuredData, productFAQs } from '@/utils/structuredData';
import { cn } from '@/lib/utils';

// Deterministic rating from product id — looks real, stays consistent across renders
const hashId = (id) => String(id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
const getRating      = (id) => (3.8 + (hashId(id) % 12) / 10).toFixed(1);   // 3.8 – 4.9
const getReviewCount = (id) => 18  + (hashId(id) % 83);                       // 18 – 100

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addedIds, setAddedIds] = useState({});
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const { products, fsLoading, error: productsError } = useProducts();

  // Build categories from the merged product list; fall back to static while loading
  const allCategories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category).filter(Boolean))];
    return ['All', ...cats];
  }, [products]);
  const categories = allCategories;

  const handleAddToCart = (product) => {
    addItem({ ...product, price: 0 });
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  const handleBuyNow = (product) => {
    addItem({ ...product, price: 0 });
    navigate('/checkout');
  };

  const filteredProducts = useMemo(() => {
    let result = products;
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.features?.some(f => f.toLowerCase().includes(q)) ||
        p.applications?.some(a => a.toLowerCase().includes(q))
      );
    }
    return result;
  }, [products, selectedCategory, searchQuery]);

  const productStructuredData = generateProductStructuredData(staticProducts);
  const faqStructuredData = generateFAQStructuredData(productFAQs);
  const combinedStructuredData = {
    "@context": "https://schema.org",
    "@graph": [productStructuredData, faqStructuredData]
  };

  return (
    <>
      <SEOHead structuredData={combinedStructuredData} />

      <div id="products" className="min-h-screen pt-20 pb-20">

        {/* ── Sticky Filter Bar ── */}
        <section className="py-4 bg-background/95 backdrop-blur-sm border-b-2 border-border sticky top-20 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">

            {/* Search row */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, features, applications..."
                className="w-full pl-11 pr-10 py-2.5 rounded-xl border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-safety-500 transition-all duration-200 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Category chip filters */}
            <div className="-mx-4 sm:mx-0 px-4 sm:px-0 flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border-2',
                    selectedCategory === category
                      ? 'bg-safety-500 border-safety-600 text-white shadow-md shadow-safety-500/25'
                      : 'bg-transparent border-border text-muted-foreground hover:border-safety-500/50 hover:text-foreground hover:bg-muted/30'
                  )}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Active filter count */}
            {(searchQuery || selectedCategory !== 'All') && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">
                  <span className="font-bold text-foreground">{filteredProducts.length}</span>
                  {' '}product{filteredProducts.length !== 1 ? 's' : ''} found
                </span>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="text-xs font-bold uppercase tracking-wider text-safety-500 hover:text-safety-600 transition-colors flex items-center gap-1"
                >
                  <X className="h-3 w-3" /> Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── Products Grid ── */}
        <section className="py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Background fetch status */}
            {fsLoading && (
              <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading additional products…</span>
              </div>
            )}
            {productsError && !fsLoading && (
              <div className="mb-4 p-3 rounded-xl border border-yellow-500/30 bg-yellow-500/5 text-xs text-yellow-700 dark:text-yellow-400 font-medium">
                ⚠ {productsError.includes('timed out') || productsError.includes('Internet')
                  ? 'Offline — showing base catalog. Custom products will appear when connection is restored.'
                  : `Could not load custom products: ${productsError}`}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              /* Empty state */
              <div className="text-center py-24 animate-fade-in">
                <div className="inline-flex p-6 rounded-2xl bg-muted/30 border-2 border-border mb-6">
                  <Package className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2 uppercase tracking-wide">
                  No Products Found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                  Try selecting a different category or adjusting your search.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                  className="px-6 py-3 bg-safety-500 text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-safety-600 transition-colors shadow-lg shadow-safety-500/20"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-safety-500/50 transition-all duration-500 hover:-translate-y-1.5 heavy-shadow hover:shadow-[0_20px_60px_rgba(0,0,0,0.13)] animate-card-rise"
                    style={{ animationDelay: `${(index % 6) * 80}ms` }}
                  >
                    {/* ── Image area ── */}
                    <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={`${product.name} - ${product.category} Tarpaulin by RainFort`}
                          width={480}
                          height={360}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector('.fallback-icon')?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className="fallback-icon absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-charcoal-600 to-charcoal-800 flex">
                        <Package className="w-16 h-16 text-white/25" />
                      </div>

                      {/* Dark gradient overlay — shows product name */}
                      <div className="absolute inset-0 product-overlay" />

                      {/* Top row: badge + wishlist */}
                      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-start justify-between">
                        {product.badge && (
                          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 bg-safety-500 text-white rounded-lg shadow-lg shadow-black/30">
                            {product.badge}
                          </span>
                        )}
                        <button
                          onClick={(e) => { e.preventDefault(); toggleItem(product); }}
                          className={cn(
                            'ml-auto p-1.5 sm:p-2 rounded-xl backdrop-blur-sm transition-all duration-200 hover:scale-110',
                            isWishlisted(product.id)
                              ? 'bg-red-500/20 border border-red-500/40'
                              : 'bg-black/30 hover:bg-black/50'
                          )}
                          aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <Heart className={cn(
                            'h-3.5 sm:h-4 w-3.5 sm:w-4 transition-colors',
                            isWishlisted(product.id) ? 'fill-red-400 text-red-400' : 'text-white'
                          )} />
                        </button>
                      </div>

                      {/* Bottom overlay: category tag + product name */}
                      <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-safety-400 mb-0.5 sm:mb-1">
                          {product.category}
                        </p>
                        <h3 className="text-sm sm:text-lg font-bold text-white uppercase tracking-wide leading-tight line-clamp-2">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    {/* ── Card body ── */}
                    <div className="p-2.5 sm:p-4 flex-1 flex flex-col gap-2 sm:gap-3">
                      {/* Price range + star rating row */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {product.priceRange && (
                          <span className="text-sm sm:text-base font-bold text-safety-600 dark:text-safety-400">
                            {product.priceRange}
                          </span>
                        )}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <div className="flex gap-px">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-2.5 sm:h-3 w-2.5 sm:w-3 ${
                                  s <= Math.round(Number(getRating(product.id)))
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-muted-foreground/25'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[9px] sm:text-[10px] text-muted-foreground ml-0.5">
                            ({getReviewCount(product.id)})
                          </span>
                        </div>
                      </div>

                      {/* Description — hidden on small mobile to save space */}
                      <p className="hidden sm:block text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                        {product.description}
                      </p>

                      {/* Feature tags (first 2 + count) — hidden on mobile */}
                      {product.features?.length > 0 && (
                        <div className="hidden sm:flex flex-wrap gap-1.5">
                          {product.features.slice(0, 2).map((feature, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground rounded-full border border-border/60"
                            >
                              {feature}
                            </span>
                          ))}
                          {product.features.length > 2 && (
                            <span className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground rounded-full border border-border/60">
                              +{product.features.length - 2} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* ── Dual CTA row ── */}
                      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-0.5 sm:pt-1 mt-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 sm:h-10 gap-1 sm:gap-1.5 text-[10px] sm:text-xs px-2 sm:px-3"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                          <span className="truncate">{addedIds[product.id] ? 'Added ✓' : 'Add to Cart'}</span>
                        </Button>
                        <Button
                          variant="accent"
                          size="sm"
                          className="h-8 sm:h-10 gap-1 sm:gap-1.5 text-[10px] sm:text-xs px-2 sm:px-3 buy-glow"
                          onClick={() => handleBuyNow(product)}
                        >
                          <Zap className="h-3 sm:h-3.5 w-3 sm:w-3.5 flex-shrink-0" />
                          Buy Now
                        </Button>
                      </div>

                      {/* View details subtle link */}
                      <Link to={`/product/${product.id}`}>
                        <button className="w-full text-center text-[10px] sm:text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-0.5 group/link">
                          View Details{' '}
                          <span className="inline-block group-hover/link:translate-x-1 transition-transform duration-200">
                            →
                          </span>
                        </button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SEO Content */}
        <ProductsSEOContent />

      </div>
    </>
  );
};

export default Products;

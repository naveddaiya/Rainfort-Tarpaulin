import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { ArrowLeft, Package, ShoppingCart, Heart, Zap, Search, X, Loader2, Star } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const hashId = (id) => String(id).split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
const getRating      = (id) => (3.8 + (hashId(id) % 12) / 10).toFixed(1);
const getReviewCount = (id) => 18 + (hashId(id) % 83);

export default function CategoryProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { categories, loading: catLoading } = useCategories();
  const { products, fsLoading } = useProducts();
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const [search, setSearch] = useState('');
  const [addedIds, setAddedIds] = useState({});

  const category = categories.find(c => c.id === categoryId);

  const filtered = useMemo(() => {
    const base = products.filter(p =>
      p.category?.toLowerCase() === category?.name?.toLowerCase()
    );
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }, [products, category, search]);

  const handleAddToCart = (product) => {
    addItem({ ...product, price: 0 });
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  const handleBuyNow = (product) => {
    addItem({ ...product, price: 0 });
    navigate('/checkout');
  };

  if (catLoading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-safety-500" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <Package className="h-14 w-14 text-muted-foreground/40" />
        <h2 className="text-2xl font-display uppercase tracking-wide">Category Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          This category doesn't exist or may have been removed.
        </p>
        <Link to="/">
          <Button variant="outline" className="gap-2 border-2">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20">

      {/* ── Category banner ── */}
      <div className="relative h-52 sm:h-64 overflow-hidden">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy-800 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25" />

        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 max-w-7xl mx-auto w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-[11px] font-bold uppercase tracking-wider mb-3">
            <Link to="/" className="hover:text-white/80 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/" className="hover:text-white/80 transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-white/80">{category.name}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-display text-white uppercase leading-none mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-white/60 text-sm max-w-md leading-relaxed">{category.description}</p>
          )}
        </div>
      </div>

      {/* ── Sticky search bar ── */}
      <div className="sticky top-20 z-30 bg-background/95 backdrop-blur-sm border-b-2 border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-safety-500 transition-colors flex-shrink-0">
              <ArrowLeft className="h-4 w-4" /> Categories
            </Link>
            <div className="w-px h-4 bg-border" />
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={`Search in ${category.name}...`}
                className="w-full pl-9 pr-8 py-2 text-sm border-2 border-border bg-background rounded-lg focus:outline-none focus:border-safety-500 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              )}
            </div>
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {fsLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin inline" />
              ) : (
                <>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ── Products grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex p-6 border-2 border-dashed border-border mb-6">
              <Package className="w-12 h-12 text-muted-foreground/40" />
            </div>
            <h3 className="text-2xl font-display uppercase tracking-wide mb-2">No Products Found</h3>
            <p className="text-muted-foreground text-sm mb-6">
              {search ? 'Try a different search term.' : 'No products have been added to this category yet.'}
            </p>
            {search && (
              <Button variant="outline" onClick={() => setSearch('')} className="border-2 gap-2">
                <X className="h-4 w-4" /> Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, index) => (
              <div
                key={product.id}
                className="group flex flex-col bg-card overflow-hidden border border-border/60 hover:border-safety-500/50 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl"
                style={{ animationDelay: `${(index % 6) * 60}ms` }}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900">
                      <Package className="w-16 h-16 text-white/20" />
                    </div>
                  )}

                  {/* Quick Add overlay */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                      className={cn(
                        'w-full py-3 font-bold uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 transition-colors duration-200',
                        addedIds[product.id]
                          ? 'bg-emerald-500 text-white'
                          : 'bg-white/95 backdrop-blur-sm text-slate-900 hover:bg-safety-500 hover:text-white'
                      )}
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {addedIds[product.id] ? 'Added ✓' : 'Quick Add'}
                    </button>
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-safety-500 text-white px-2.5 py-1">
                        {product.badge}
                      </span>
                    </div>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleItem(product); }}
                    className={cn(
                      'absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:scale-110',
                      isWishlisted(product.id)
                        ? 'bg-red-500/20 border border-red-500/40'
                        : 'bg-black/30 hover:bg-black/50'
                    )}
                  >
                    <Heart className={cn('h-3.5 w-3.5', isWishlisted(product.id) ? 'fill-red-400 text-red-400' : 'text-white')} />
                  </button>

                  {/* Bottom overlay text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-safety-400 mb-0.5">{product.category}</p>
                    <h3 className="text-base font-bold text-white uppercase tracking-wide leading-tight line-clamp-2">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 flex-1 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2">
                    {product.priceRange && (
                      <span className="text-base font-bold text-safety-600 dark:text-safety-400">
                        {product.priceRange}
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <div className="flex gap-px">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`h-3 w-3 ${s <= Math.round(Number(getRating(product.id))) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/25'}`} />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">({getReviewCount(product.id)})</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
                    {product.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button variant="outline" size="sm" className="h-10 gap-1.5 text-xs" onClick={() => handleAddToCart(product)}>
                      <ShoppingCart className="h-3.5 w-3.5 flex-shrink-0" />
                      {addedIds[product.id] ? 'Added ✓' : 'Add to Cart'}
                    </Button>
                    <Button variant="accent" size="sm" className="h-10 gap-1.5 text-xs buy-glow" onClick={() => handleBuyNow(product)}>
                      <Zap className="h-3.5 w-3.5 flex-shrink-0" /> Buy Now
                    </Button>
                  </div>

                  <Link to={`/product/${product.id}`}>
                    <button className="w-full text-center text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors py-0.5">
                      View Details →
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

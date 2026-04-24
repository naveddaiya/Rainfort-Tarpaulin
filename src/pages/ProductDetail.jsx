import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, ShoppingCart, CheckCircle, Shield, Package, Truck, Star, Phone, MessageCircle, Heart, Ruler, Layers } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ProductReviews from '@/components/ui/ProductReviews';
import { cn } from '@/lib/utils';

const badgeVariantMap = {
  Popular:    'accent',
  Premium:    'default',
  Specialized:'secondary',
  Advanced:   'default',
  Industrial: 'secondary',
  Classic:    'outline',
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const { toggleItem, isWishlisted } = useWishlist();
  const { products } = useProducts();
  // Match by string ID (Firestore) or numeric ID (static catalog)
  const product = products.find(p => String(p.id) === String(id));

  // Variant selection state
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedGsm, setSelectedGsm]   = useState('');
  const [variantError, setVariantError]  = useState('');

  if (!product) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-6 px-4">
        <div className="p-6 rounded-2xl bg-muted/30 border-2 border-border">
          <Package className="w-12 h-12 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold uppercase tracking-wider">Product Not Found</h1>
        <Link to="/"><Button variant="default">Back to Home</Button></Link>
      </div>
    );
  }

  const hasVariants = product.variants?.sizes?.length > 0;

  const validateVariant = () => {
    if (!hasVariants) return true;
    if (!selectedSize) { setVariantError('Please select a size'); return false; }
    if (!selectedGsm)  { setVariantError('Please select a GSM'); return false; }
    setVariantError('');
    return true;
  };

  const buildCartItem = () => ({
    ...product,
    price: product.price || 0,
    selectedSize: selectedSize || undefined,
    selectedGsm:  selectedGsm  || undefined,
  });

  // Check if this specific variant is already in cart
  const variantKey = hasVariants
    ? `${product.id}__${selectedSize}__${selectedGsm}`
    : String(product.id);
  const isInCart = items.some(i => i.cartKey === variantKey);

  const handleAddToCart = () => {
    if (!validateVariant()) return;
    addItem(buildCartItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!validateVariant()) return;
    addItem(buildCartItem());
    navigate('/checkout');
  };

  const related = products.filter(p => p.category === product.category && String(p.id) !== String(product.id)).slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-16">

      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 hover:text-foreground transition-colors font-medium group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>
          <span className="text-border">/</span>
          <Link to="/#products" className="hover:text-foreground transition-colors">Products</Link>
          <span className="text-border">/</span>
          <span className="text-foreground font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left: Image ── */}
          <div className="sticky top-24 space-y-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-border heavy-shadow bg-gradient-to-br from-muted/30 to-muted/10 aspect-square group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4">
                <Badge variant={badgeVariantMap[product.badge] || 'default'}>{product.badge}</Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">{product.category}</Badge>
              </div>

              <button
                onClick={() => toggleItem(product)}
                className={cn(
                  'absolute bottom-4 right-4 p-2.5 rounded-xl backdrop-blur-sm border transition-all duration-200 hover:scale-110',
                  isWishlisted(product.id)
                    ? 'bg-red-500/20 border-red-500/50 text-red-400'
                    : 'bg-black/30 border-white/20 text-white hover:bg-black/50'
                )}
                aria-label={isWishlisted(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={cn('h-5 w-5', isWishlisted(product.id) ? 'fill-red-400' : '')} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Shield, label: 'ISO Certified', sub: 'Quality assured' },
                { icon: Package, label: 'Bulk Orders',  sub: 'Custom sizes' },
                { icon: Truck,   label: 'Pan India',    sub: 'Fast delivery' },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex flex-col items-center text-center p-3 rounded-xl border-2 border-border bg-muted/20 hover:border-navy-500/50 hover:bg-muted/40 transition-all duration-300"
                >
                  <Icon className="h-5 w-5 mb-1 text-navy-500" />
                  <span className="text-xs font-bold uppercase tracking-wider leading-tight">{label}</span>
                  <span className="text-xs text-muted-foreground mt-0.5">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="space-y-6">

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold uppercase tracking-wider leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className="h-4 w-4 fill-orange-500 text-orange-500" />
                  ))}
                  <span className="text-sm text-muted-foreground font-medium ml-1.5">(4.9 · 120+ orders)</span>
                </div>
                {/* Price range pill */}
                {product.priceRange && (
                  <span className="px-3 py-1 text-sm font-bold bg-safety-500/10 text-safety-600 dark:text-safety-400 border border-safety-500/30 rounded-full">
                    {product.priceRange}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Specifications */}
            {product.specifications && Object.keys(product.specifications).length > 0 && (
              <Card className="border-2">
                <CardContent className="p-5">
                  <h3 className="text-xs font-bold uppercase tracking-widest mb-4 text-safety-500">Specifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(product.specifications).filter(([, v]) => v).map(([key, value]) => (
                      <div key={key} className="space-y-1 p-3 rounded-lg bg-muted/30 border border-border/60">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{key}</p>
                        <p className="text-sm font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Features */}
            {product.features?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-safety-500">Key Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 border border-border hover:border-navy-500/40 hover:bg-muted/50 transition-all duration-200"
                    >
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-navy-500" />
                      <span className="text-sm font-medium leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications */}
            {product.applications?.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-3 text-safety-500">Applications</h3>
                <div className="flex flex-wrap gap-2">
                  {product.applications.map((app) => (
                    <Badge key={app} variant="outline" className="hover:border-navy-500/40 transition-colors">
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* ── Variant Selector ── */}
            {hasVariants && (
              <div className="space-y-4 p-4 rounded-xl border-2 border-border bg-muted/10">
                <h3 className="text-xs font-bold uppercase tracking-widest text-safety-500">
                  Select Your Specifications
                </h3>

                {/* Size selector */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Size
                      {selectedSize && <span className="ml-2 text-foreground font-bold">— {selectedSize}</span>}
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => { setSelectedSize(size); setVariantError(''); }}
                        className={cn(
                          'px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-all duration-200',
                          selectedSize === size
                            ? 'bg-navy-500 border-navy-600 text-white shadow-md'
                            : 'bg-background border-border text-muted-foreground hover:border-navy-500/50 hover:text-foreground'
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* GSM selector */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      GSM / Thickness
                      {selectedGsm && <span className="ml-2 text-foreground font-bold">— {selectedGsm}</span>}
                    </label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.gsm.map((gsm) => (
                      <button
                        key={gsm}
                        onClick={() => { setSelectedGsm(gsm); setVariantError(''); }}
                        className={cn(
                          'px-3 py-1.5 text-xs font-bold rounded-lg border-2 transition-all duration-200',
                          selectedGsm === gsm
                            ? 'bg-navy-500 border-navy-600 text-white shadow-md'
                            : 'bg-background border-border text-muted-foreground hover:border-navy-500/50 hover:text-foreground'
                        )}
                      >
                        {gsm}
                      </button>
                    ))}
                  </div>
                </div>

                {variantError && (
                  <p className="text-xs font-semibold text-destructive flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-destructive inline-block" />
                    {variantError}
                  </p>
                )}
              </div>
            )}

            {/* Price note */}
            <div className="p-4 rounded-xl border-2 border-dashed border-safety-500/40 bg-safety-500/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-safety-600 dark:text-safety-400">
                    Price varies by size, quantity &amp; customization.
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Place your order and our team confirms pricing within 2 hours.
                  </p>
                </div>
                {product.priceRange && (
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Starting from</p>
                    <p className="text-sm font-bold text-safety-600 dark:text-safety-400">{product.priceRange}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── CTA Buttons ── */}
            <div className="flex flex-col gap-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  size="lg"
                  variant="accent"
                  className="h-12 text-sm font-bold tracking-wide buy-glow"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>
                <Button
                  size="lg"
                  variant={added ? 'default' : 'outline'}
                  className="h-12 gap-2 text-sm font-bold tracking-wide border-2"
                  onClick={handleAddToCart}
                >
                  {added
                    ? <><CheckCircle className="h-4 w-4 flex-shrink-0" /> Added!</>
                    : <><ShoppingCart className="h-4 w-4 flex-shrink-0" /> Add to Cart</>
                  }
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <a href="tel:+918385011488" className="block">
                  <Button size="lg" variant="outline" className="w-full gap-2 border-2 text-sm font-bold uppercase tracking-wider">
                    <Phone className="h-4 w-4 flex-shrink-0" /> Call Now
                  </Button>
                </a>
                <a href="https://wa.me/918385011488" target="_blank" rel="noopener noreferrer" className="block">
                  <Button size="lg" variant="outline" className="w-full gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 text-sm font-bold uppercase tracking-wider">
                    <MessageCircle className="h-4 w-4 flex-shrink-0" /> WhatsApp
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-20">
          <ProductReviews productId={product.id} />
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              <h2 className="text-2xl font-bold uppercase tracking-wider px-2">Related Products</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group block">
                  <div className="rounded-2xl overflow-hidden border-2 border-border hover:border-safety-500/50 transition-all duration-300 hover:-translate-y-1 heavy-shadow bg-card">
                    <div className="aspect-video overflow-hidden relative">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 product-overlay" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <Badge variant={badgeVariantMap[p.badge] || 'default'} className="text-xs">{p.badge}</Badge>
                        {p.priceRange && (
                          <span className="text-xs font-bold text-white/90 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                            {p.priceRange}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold uppercase tracking-wide text-sm group-hover:text-navy-500 transition-colors">{p.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft, ArrowRight, Package, Lock, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const badgeVariantMap = {
  Popular:    'accent',
  Premium:    'default',
  Specialized:'secondary',
  Advanced:   'default',
  Industrial: 'secondary',
  Classic:    'outline',
};

export default function Cart() {
  const { items, removeItem, updateQty, totalItems, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center gap-6 px-4 animate-fade-in">
        {/* Empty state illustration */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-muted/60 to-muted/20 border-2 border-border flex items-center justify-center">
            <ShoppingCart className="h-14 w-14 text-muted-foreground/50" />
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-safety-500/20 border-2 border-safety-500/30 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-safety-500">0</span>
          </div>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Your Cart is Empty</h1>
          <p className="text-muted-foreground max-w-xs">
            Add products to get started with your order. Our team will confirm pricing within 2 hours.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/">
            <Button variant="accent" size="lg" className="gap-2 font-bold uppercase tracking-wider buy-glow">
              <ArrowLeft className="h-5 w-5" /> Browse Products
            </Button>
          </Link>
          <a href="https://wa.me/918385011488" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="lg" className="gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 font-bold uppercase tracking-wider">
              <MessageCircle className="h-5 w-5" /> WhatsApp Order
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">

      {/* ── Cart Header ── */}
      <div className="relative border-b-2 border-border bg-muted/10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-safety-500/60 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-wider">Your Cart</h1>
              <p className="text-muted-foreground mt-0.5 text-sm">
                <span className="font-bold text-foreground">{totalItems}</span> item{totalItems !== 1 ? 's' : ''} ready for checkout
              </p>
            </div>
            <button
              onClick={clearCart}
              className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-destructive/5 border border-transparent hover:border-destructive/20"
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* ── Cart Items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="group flex gap-4 p-4 rounded-2xl border-2 border-border bg-card hover:border-navy-500/30 transition-all duration-300 hover:shadow-md"
              >
                {/* Product image */}
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-border bg-muted/20 relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 product-overlay opacity-0 hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Badge variant={badgeVariantMap[item.badge] || 'default'} className="text-xs mb-1">
                        {item.badge}
                      </Badge>
                      <Link to={`/product/${item.id}`}>
                        <h3 className="font-bold uppercase tracking-wide hover:text-navy-600 transition-colors line-clamp-2 text-sm leading-snug">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.cartKey)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/5 flex-shrink-0"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Spec + variant pills */}
                  <div className="flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                    {item.selectedSize && (
                      <span className="bg-navy-500/10 text-navy-600 dark:text-navy-300 px-2 py-0.5 rounded-full border border-navy-500/20 font-semibold">
                        {item.selectedSize}
                      </span>
                    )}
                    {item.selectedGsm && (
                      <span className="bg-navy-500/10 text-navy-600 dark:text-navy-300 px-2 py-0.5 rounded-full border border-navy-500/20 font-semibold">
                        {item.selectedGsm}
                      </span>
                    )}
                    {item.specifications?.material && (
                      <span className="bg-muted/50 px-2 py-0.5 rounded-full border border-border/60">
                        {item.specifications.material}
                      </span>
                    )}
                    {item.specifications?.warranty && (
                      <span className="bg-muted/50 px-2 py-0.5 rounded-full border border-border/60">
                        {item.specifications.warranty} warranty
                      </span>
                    )}
                  </div>

                  {/* Qty controls + price note */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="flex items-center gap-0 border-2 border-border rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQty(item.cartKey, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-muted transition-colors active:bg-muted/80"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-9 text-center text-sm font-bold border-x-2 border-border py-2">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.cartKey, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-muted transition-colors active:bg-muted/80"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground italic">
                      Price on confirmation
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mt-2 group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
              Continue Shopping
            </button>
          </div>

          {/* ── Order Summary (sticky) ── */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border-2 border-border bg-card overflow-hidden heavy-shadow">
              {/* Summary header */}
              <div className="px-6 pt-5 pb-4 border-b-2 border-border bg-muted/20">
                <h2 className="text-base font-bold uppercase tracking-wider">Order Summary</h2>
                <p className="text-xs text-muted-foreground mt-0.5">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
              </div>

              <div className="p-6 space-y-5">
                {/* Items list */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm gap-2">
                      <span className="text-muted-foreground leading-tight line-clamp-2 flex-1">
                        {item.name}{' '}
                        <span className="font-bold text-foreground">×{item.quantity}</span>
                      </span>
                      <span className="font-medium text-muted-foreground italic flex-shrink-0 text-xs mt-0.5">TBD</span>
                    </div>
                  ))}
                </div>

                {/* Pricing info */}
                <div className="p-3 rounded-xl bg-safety-500/5 border border-safety-500/20 flex items-start gap-2.5">
                  <Package className="h-4 w-4 text-safety-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-safety-600 dark:text-safety-400 font-medium leading-snug">
                    Final pricing confirmed after order — varies by size, GSM &amp; quantity. Our team calls within 2 hours.
                  </p>
                </div>

                {/* Checkout CTA */}
                <Button
                  variant="accent"
                  size="lg"
                  className="w-full gap-2 font-bold uppercase tracking-wider buy-glow"
                  onClick={() => navigate('/checkout')}
                >
                  Proceed to Checkout <ArrowRight className="h-5 w-5" />
                </Button>

                {/* WhatsApp bulk pricing */}
                <a href="https://wa.me/918385011488" target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 font-bold uppercase tracking-wider text-sm gap-2"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp for Bulk Pricing
                  </Button>
                </a>

                {/* Secure checkout badge */}
                <div className="flex items-center justify-center gap-2 pt-1 text-xs text-muted-foreground">
                  <Lock className="h-3.5 w-3.5" />
                  <span className="font-medium">Secure & Encrypted Checkout</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

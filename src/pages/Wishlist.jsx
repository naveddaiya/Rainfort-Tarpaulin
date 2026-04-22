import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Package, CheckCircle } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

const badgeVariantMap = {
  Popular: 'accent', Premium: 'default', Specialized: 'secondary',
  Advanced: 'default', Industrial: 'secondary', Classic: 'outline',
};

export default function Wishlist() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const [addedIds, setAddedIds] = useState({});

  const handleAddToCart = (product) => {
    addItem({ ...product, price: 0 });
    setAddedIds(prev => ({ ...prev, [product.id]: true }));
    setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 2000);
  };

  const handleAddAllToCart = () => {
    items.forEach(item => addItem({ ...item, price: 0 }));
    const ids = {};
    items.forEach(i => { ids[i.id] = true; });
    setAddedIds(ids);
    setTimeout(() => setAddedIds({}), 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center gap-6 px-4">
        <div className="rounded-full bg-muted/50 p-8 border-2 border-border">
          <Heart className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Your Wishlist is Empty</h1>
          <p className="text-muted-foreground">Save products you love for later.</p>
        </div>
        <Link to="/">
          <Button variant="accent" size="lg" className="gap-2 font-bold uppercase tracking-wider">
            <ArrowLeft className="h-5 w-5" /> Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="border-b-2 border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold uppercase tracking-wider">My Wishlist</h1>
              <p className="text-muted-foreground mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
            </div>
            <div className="flex gap-2">
              <Button variant="accent" size="sm" className="gap-2 font-bold uppercase tracking-wider" onClick={handleAddAllToCart}>
                <ShoppingCart className="h-4 w-4" /> Add All to Cart
              </Button>
              <button onClick={clearWishlist}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1 font-medium">
                <Trash2 className="h-4 w-4" /> Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="flex flex-col overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-charcoal-500 to-charcoal-700 overflow-hidden">
                {item.image && (
                  <img src={item.image} alt={item.name}
                    className="w-full h-full object-cover" loading="lazy" />
                )}
                {item.badge && (
                  <div className="absolute top-3 right-3">
                    <Badge variant={badgeVariantMap[item.badge] || 'default'}>{item.badge}</Badge>
                  </div>
                )}
                <button onClick={() => removeItem(item.id)}
                  className="absolute top-3 left-3 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-destructive hover:text-white transition-all">
                  <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                </button>
              </div>
              <CardContent className="flex-1 p-4 space-y-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.category}</p>
                  <Link to={`/product/${item.id}`}>
                    <h3 className="font-bold uppercase tracking-wide hover:text-navy-600 transition-colors">{item.name}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    variant={addedIds[item.id] ? 'default' : 'accent'}
                    size="sm" className="flex-1 gap-1"
                    onClick={() => handleAddToCart(item)}
                  >
                    {addedIds[item.id] ? <><CheckCircle className="h-4 w-4" /> Added!</> : <><ShoppingCart className="h-4 w-4" /> Add to Cart</>}
                  </Button>
                  <Link to={`/product/${item.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-2">Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

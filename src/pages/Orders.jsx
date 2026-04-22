import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowLeft, Clock, CheckCircle, Truck, XCircle, Loader2, ChevronDown, ChevronUp, FileDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/ui/auth-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateInvoicePDF } from '@/services/invoiceService';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    icon: Clock,        color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-300 dark:bg-yellow-950/30' },
  confirmed:  { label: 'Confirmed',  icon: CheckCircle,  color: 'text-blue-600',   bg: 'bg-blue-50 border-blue-300 dark:bg-blue-950/30' },
  shipped:    { label: 'Shipped',    icon: Truck,        color: 'text-purple-600', bg: 'bg-purple-50 border-purple-300 dark:bg-purple-950/30' },
  delivered:  { label: 'Delivered',  icon: CheckCircle,  color: 'text-green-600',  bg: 'bg-green-50 border-green-300 dark:bg-green-950/30' },
  cancelled:  { label: 'Cancelled',  icon: XCircle,      color: 'text-red-600',    bg: 'bg-red-50 border-red-300 dark:bg-red-950/30' },
};

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

function OrderTimeline({ currentStatus }) {
  if (currentStatus === 'cancelled') {
    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
        <XCircle className="h-5 w-5 text-red-500" />
        <span className="text-sm font-medium text-red-700 dark:text-red-400">This order has been cancelled.</span>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.indexOf(currentStatus);

  return (
    <div className="py-2">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border" />
        {/* Progress line */}
        <div className="absolute top-4 left-0 h-0.5 bg-green-500 transition-all duration-500"
          style={{ width: `${(currentIndex / (STATUS_STEPS.length - 1)) * 100}%` }} />

        {STATUS_STEPS.map((step, index) => {
          const cfg = STATUS_CONFIG[step];
          const Icon = cfg.icon;
          const isCompleted = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <div key={step} className="relative flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-background border-border text-muted-foreground'
              } ${isCurrent ? 'ring-2 ring-green-500/30 ring-offset-2 ring-offset-background' : ''}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider mt-2 ${
                isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
              }`}>
                {cfg.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); setShowAuthModal(true); return; }

    const fetchOrders = async () => {
      try {
        const { getDb } = await import('@/config/firebase');
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const db = await getDb();
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        docs.sort((a, b) => {
          const aTime = a.createdAt?.seconds || 0;
          const bTime = b.createdAt?.seconds || 0;
          return bTime - aTime;
        });
        setOrders(docs);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#1a4d7a' }} />
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center gap-6 px-4">
          <div className="rounded-full bg-muted/50 p-8 border-2 border-border">
            <Package className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold uppercase tracking-wider">My Orders</h1>
            <p className="text-muted-foreground">Sign in to view your order history.</p>
          </div>
          <Button variant="accent" className="font-bold uppercase tracking-wider" onClick={() => setShowAuthModal(true)}>
            Sign In to View Orders
          </Button>
          <Link to="/"><Button variant="outline" className="border-2 font-bold uppercase tracking-wider">Back to Home</Button></Link>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} redirectMessage="Sign in to view your order history." />
      </>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="border-b-2 border-border bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit">
            <ArrowLeft className="h-4 w-4" /> Continue Shopping
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold uppercase tracking-wider">My Orders</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <img src={user.photoURL || ''} alt="" className="h-6 w-6 rounded-full border border-border"
                onError={(e) => { e.target.style.display = 'none'; }} />
              {user.displayName?.split(' ')[0]}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-6 py-20">
            <div className="rounded-full bg-muted/50 p-8 border-2 border-border">
              <Package className="h-14 w-14 text-muted-foreground" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold uppercase tracking-wider">No Orders Yet</h2>
              <p className="text-muted-foreground">Your orders will appear here once you place one.</p>
            </div>
            <Link to="/">
              <Button variant="accent" className="gap-2 font-bold uppercase tracking-wider">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            {orders.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusCfg.icon;
              const orderDate = order.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric'
              }) || 'Date unavailable';
              const isExpanded = expandedId === order.id;

              return (
                <Card key={order.id} className="overflow-hidden">
                  {/* Order Header */}
                  <button
                    className={`w-full flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b-2 border-border ${statusCfg.bg} text-left hover:opacity-90 transition-opacity`}
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-4 w-4 ${statusCfg.color}`} />
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="text-sm font-bold font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Placed on</p>
                      <p className="text-sm font-bold">{orderDate}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${statusCfg.color} border-current font-bold`}>
                        {statusCfg.label}
                      </Badge>
                      {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </button>

                  <CardContent className="p-5 space-y-4">
                    {/* Items */}
                    <div className="space-y-3">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg border-2 border-border bg-muted/30 flex items-center justify-center flex-shrink-0">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{item.name}</p>
                            <p className="text-xs text-muted-foreground">{item.category} · Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Expanded: Timeline + Shipping + Actions */}
                    {isExpanded && (
                      <div className="space-y-4 pt-3 border-t border-border animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Order Tracking Timeline */}
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Order Tracking</p>
                          <OrderTimeline currentStatus={order.status} />
                        </div>

                        {/* Shipping */}
                        {order.shipping && (
                          <div className="pt-3 border-t border-border text-sm text-muted-foreground">
                            <span className="font-bold text-foreground text-xs uppercase tracking-wider">Ship to: </span>
                            {order.shipping.address}, {order.shipping.city}, {order.shipping.state} – {order.shipping.pincode}
                          </div>
                        )}

                        {/* Notes */}
                        {order.notes && (
                          <p className="text-xs text-muted-foreground italic border-l-2 border-orange-400 pl-3">
                            {order.notes}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 pt-2">
                          <Button variant="outline" size="sm" className="border-2 font-bold text-xs uppercase tracking-wider gap-1"
                            onClick={() => generateInvoicePDF(order)}>
                            <FileDown className="h-3.5 w-3.5" /> Download Invoice
                          </Button>
                          <a href="https://wa.me/918385011488" target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 font-bold text-xs uppercase tracking-wider">
                              WhatsApp for Status
                            </Button>
                          </a>
                          <a href="tel:+918385011488">
                            <Button variant="outline" size="sm" className="border-2 font-bold text-xs uppercase tracking-wider">
                              Call Us
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

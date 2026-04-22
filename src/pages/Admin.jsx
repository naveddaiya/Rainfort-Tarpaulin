import { useState, useEffect, useMemo } from 'react';
import { Package, Clock, CheckCircle, Truck, XCircle, Loader2, RefreshCw, Phone, LogOut, TrendingUp, ShoppingBag, Users, BarChart3, Calendar, ShieldCheck, PlusCircle, Pencil, Trash2, LayoutGrid, X, AlertTriangle, Image as ImageIcon, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { sendOrderStatusEmail } from '@/services/emailService';
import ProductForm from '@/components/admin/ProductForm';
import CategoryForm from '@/components/admin/CategoryForm';
import { getFirestoreProducts, deleteProduct } from '@/services/productService';
import { getCategories, deleteCategory } from '@/services/categoryService';

// Authorized admin emails
const ADMIN_EMAILS = [
  'daiyasarfaraz@gmail.com',
  'daiyanaved3@gmail.com',
];

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   icon: Clock,       color: 'text-yellow-600', badgeVariant: 'outline' },
  confirmed: { label: 'Confirmed', icon: CheckCircle, color: 'text-blue-600',   badgeVariant: 'default' },
  shipped:   { label: 'Shipped',   icon: Truck,       color: 'text-purple-600', badgeVariant: 'secondary' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'text-green-600',  badgeVariant: 'default' },
  cancelled: { label: 'Cancelled', icon: XCircle,     color: 'text-red-600',    badgeVariant: 'destructive' },
};

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

export default function Admin() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [signInLoading, setSignInLoading] = useState(false);
  const [signInError, setSignInError] = useState('');

  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  const handleAdminSignIn = async () => {
    setSignInLoading(true);
    setSignInError('');
    try {
      const result = await signInWithGoogle();
      if (!ADMIN_EMAILS.includes(result.user.email)) {
        setSignInError(`Access denied. "${result.user.email}" is not an authorized admin.`);
        // Sign out the non-admin user so they can try with a different account
        await signOut();
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') {
        setSignInError('Sign-in cancelled. Please try again.');
      } else {
        setSignInError('Sign-in failed. Please try again.');
      }
    } finally {
      setSignInLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const fetchOrders = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const { getDb } = await import('@/config/firebase');
      const { collection, getDocs } = await import('firebase/firestore');
      const db = await getDb();
      const snap = await getDocs(collection(db, 'orders'));
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setOrders(docs);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setFetchError(`${err.code || 'error'}: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchOrders();
  }, [isAdmin]);

  const updateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const { getDb } = await import('@/config/firebase');
      const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');
      const db = await getDb();
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: serverTimestamp(),
      });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

      // Send status update email to customer
      const order = orders.find(o => o.id === orderId);
      if (order?.customer?.email) {
        sendOrderStatusEmail({
          customerName: order.customer.name,
          customerEmail: order.customer.email,
          orderId: orderId.slice(0, 8).toUpperCase(),
          newStatus,
          items: order.items,
        }).catch(e => console.warn('Status email failed:', e));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // ── Products state ──────────────────────────────────────────────────────
  const [fsProducts, setFsProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);   // null = add mode
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);     // product object to confirm deletion

  const fetchProducts = async () => {
    setProductsLoading(true);
    setProductsError('');
    try {
      const docs = await getFirestoreProducts();
      setFsProducts(docs);
    } catch (err) {
      setProductsError(err.message || 'Failed to load products');
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchProducts();
  }, [isAdmin]);

  const handleDeleteProduct = async (product) => {
    setDeletingId(product.id);
    setDeleteConfirm(null);
    try {
      await deleteProduct(product.id, product.storagePath || null);
      setFsProducts(prev => prev.filter(p => p.id !== product.id));
    } catch (err) {
      console.error('Delete failed:', err);
      setProductsError('Failed to delete product: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // ── Categories state ─────────────────────────────────────────────────────
  const [fsCategories, setFsCategories]       = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError]   = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory]   = useState(null);
  const [deletingCatId, setDeletingCatId]       = useState(null);
  const [deleteCatConfirm, setDeleteCatConfirm] = useState(null);

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    setCategoriesError('');
    try {
      const docs = await getCategories();
      setFsCategories(docs);
    } catch (err) {
      setCategoriesError(err.message || 'Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => { if (isAdmin) fetchCategories(); }, [isAdmin]);

  const handleDeleteCategory = async (cat) => {
    setDeletingCatId(cat.id);
    setDeleteCatConfirm(null);
    try {
      await deleteCategory(cat.id);
      setFsCategories(prev => prev.filter(c => c.id !== cat.id));
    } catch (err) {
      setCategoriesError('Failed to delete: ' + err.message);
    } finally {
      setDeletingCatId(null);
    }
  };

  const [activeTab, setActiveTab] = useState('orders');
  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);
  const counts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status] || 0) + 1; return acc; }, {});

  // Analytics computations
  const analytics = useMemo(() => {
    const totalOrders = orders.length;
    const totalItems = orders.reduce((s, o) => s + (o.totalItems || 0), 0);
    const uniqueCustomers = new Set(orders.map(o => o.userId).filter(Boolean)).size;

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(o => {
      const d = o.createdAt?.toDate?.();
      return d && d >= thirtyDaysAgo;
    });

    const ordersByDay = {};
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const key = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      ordersByDay[key] = 0;
    }
    recentOrders.forEach(o => {
      const d = o.createdAt?.toDate?.();
      if (d) {
        const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
        if (ordersByDay[key] !== undefined) ordersByDay[key]++;
      }
    });

    const productCounts = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
      });
    });
    const topProducts = Object.entries(productCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const stateCounts = {};
    orders.forEach(o => {
      const state = o.shipping?.state;
      if (state) stateCounts[state] = (stateCounts[state] || 0) + 1;
    });
    const topStates = Object.entries(stateCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const maxDayOrders = Math.max(...Object.values(ordersByDay), 1);

    return { totalOrders, totalItems, uniqueCustomers, recentOrders: recentOrders.length, ordersByDay, topProducts, topStates, maxDayOrders };
  }, [orders]);

  // Loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#1a4d7a' }} />
      </div>
    );
  }

  // Login screen — Google Sign-In for admins
  if (!isAdmin) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center px-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex p-4 rounded-full border-2 border-border bg-muted/30">
                <ShieldCheck className="h-8 w-8" style={{ color: '#1a4d7a' }} />
              </div>
              <h1 className="text-2xl font-bold uppercase tracking-wider">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">RainFort Tarpaulin — Order Management</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-center text-muted-foreground">
                Sign in with an authorized admin Google account.
              </p>
              <button
                onClick={handleAdminSignIn}
                disabled={signInLoading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-2 border-border bg-background hover:bg-muted font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {signInLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                {signInLoading ? 'Signing in...' : 'Sign in with Google'}
              </button>

              {signInError && (
                <p className="text-xs text-destructive text-center font-medium">{signInError}</p>
              )}

              {user && !isAdmin && (
                <div className="p-3 rounded-lg border-2 border-destructive/30 bg-destructive/5 text-center">
                  <p className="text-xs text-destructive font-medium">
                    Signed in as <span className="font-bold">{user.email}</span> — not an authorized admin.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="border-b-2 border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-wider">Admin Panel</h1>
              <div className="flex items-center gap-2 mt-1">
                <img src={user.photoURL || ''} alt="" className="h-5 w-5 rounded-full border border-border"
                  onError={(e) => { e.target.style.display = 'none'; }} />
                <p className="text-sm text-muted-foreground">
                  {user.displayName} · <span className="font-medium">{orders.length} orders</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchOrders} disabled={loading} className="gap-2 border-2">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 border-2 text-destructive border-destructive/30">
                <LogOut className="h-4 w-4" /> Logout
              </Button>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-1 mt-4">
            <button onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-t-lg border-2 border-b-0 transition-colors ${
                activeTab === 'orders' ? 'bg-background border-border' : 'bg-muted/30 border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              <Package className="h-4 w-4 inline mr-1.5 -mt-0.5" /> Orders
            </button>
            <button onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-t-lg border-2 border-b-0 transition-colors ${
                activeTab === 'analytics' ? 'bg-background border-border' : 'bg-muted/30 border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              <BarChart3 className="h-4 w-4 inline mr-1.5 -mt-0.5" /> Analytics
            </button>
            <button onClick={() => { setActiveTab('products'); setShowProductForm(false); setEditingProduct(null); }}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-t-lg border-2 border-b-0 transition-colors ${
                activeTab === 'products' ? 'bg-background border-border' : 'bg-muted/30 border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              <LayoutGrid className="h-4 w-4 inline mr-1.5 -mt-0.5" /> Products
            </button>
            <button onClick={() => { setActiveTab('categories'); setShowCategoryForm(false); setEditingCategory(null); }}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-t-lg border-2 border-b-0 transition-colors ${
                activeTab === 'categories' ? 'bg-background border-border' : 'bg-muted/30 border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              <Tag className="h-4 w-4 inline mr-1.5 -mt-0.5" /> Categories
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShoppingBag, label: 'Total Orders', value: analytics.totalOrders, color: 'text-blue-600' },
              { icon: Package, label: 'Total Items', value: analytics.totalItems, color: 'text-orange-600' },
              { icon: Users, label: 'Unique Customers', value: analytics.uniqueCustomers, color: 'text-green-600' },
              { icon: TrendingUp, label: 'Last 30 Days', value: analytics.recentOrders, color: 'text-purple-600' },
            ].map(({ icon: Icon, label, value, color }) => (
              <Card key={label}>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl bg-muted/30 border border-border ${color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Orders Chart (last 30 days) */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-bold uppercase tracking-wider">Orders — Last 30 Days</p>
              </div>
              <div className="flex items-end gap-1 h-40 overflow-x-auto pb-6 relative">
                {Object.entries(analytics.ordersByDay).map(([day, count]) => (
                  <div key={day} className="flex flex-col items-center flex-1 min-w-[18px] group relative">
                    <div className="w-full max-w-[24px] rounded-t transition-all duration-300 hover:opacity-80"
                      style={{
                        height: `${Math.max((count / analytics.maxDayOrders) * 100, 4)}%`,
                        backgroundColor: count > 0 ? '#1a4d7a' : '#e5e7eb',
                      }}
                    />
                    <span className="text-[9px] text-muted-foreground mt-1 -rotate-45 origin-top-left absolute -bottom-5 whitespace-nowrap">
                      {day}
                    </span>
                    {count > 0 && (
                      <span className="absolute -top-5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-background border border-border rounded px-1">
                        {count}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Top Products */}
            <Card>
              <CardContent className="p-5">
                <p className="text-sm font-bold uppercase tracking-wider mb-4 text-orange-500">Top Products</p>
                <div className="space-y-3">
                  {analytics.topProducts.map(([name, count], i) => (
                    <div key={name} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{name}</p>
                        <div className="h-1.5 rounded-full bg-border overflow-hidden mt-1">
                          <div className="h-full bg-orange-500 rounded-full"
                            style={{ width: `${(count / analytics.topProducts[0][1]) * 100}%` }} />
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs font-bold">{count} units</Badge>
                    </div>
                  ))}
                  {analytics.topProducts.length === 0 && (
                    <p className="text-sm text-muted-foreground">No product data yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top States */}
            <Card>
              <CardContent className="p-5">
                <p className="text-sm font-bold uppercase tracking-wider mb-4 text-orange-500">Orders by State</p>
                <div className="space-y-3">
                  {analytics.topStates.map(([state, count], i) => (
                    <div key={state} className="flex items-center gap-3">
                      <span className="text-xs font-bold text-muted-foreground w-5">{i + 1}.</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold">{state}</p>
                        <div className="h-1.5 rounded-full bg-border overflow-hidden mt-1">
                          <div className="h-full rounded-full" style={{
                            width: `${(count / analytics.topStates[0][1]) * 100}%`,
                            backgroundColor: '#1a4d7a',
                          }} />
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs font-bold">{count} orders</Badge>
                    </div>
                  ))}
                  {analytics.topStates.length === 0 && (
                    <p className="text-sm text-muted-foreground">No location data yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Distribution */}
          <Card>
            <CardContent className="p-5">
              <p className="text-sm font-bold uppercase tracking-wider mb-4 text-orange-500">Order Status Distribution</p>
              <div className="flex gap-2 h-8 rounded-xl overflow-hidden">
                {STATUS_OPTIONS.map(s => {
                  const count = counts[s] || 0;
                  const percent = orders.length > 0 ? (count / orders.length) * 100 : 0;
                  if (percent === 0) return null;
                  const colors = { pending: '#eab308', confirmed: '#2563eb', shipped: '#9333ea', delivered: '#16a34a', cancelled: '#dc2626' };
                  return (
                    <div key={s} className="relative group flex items-center justify-center text-white text-xs font-bold"
                      style={{ width: `${percent}%`, backgroundColor: colors[s], minWidth: percent > 0 ? '30px' : 0 }}>
                      {percent > 10 && `${Math.round(percent)}%`}
                      <span className="absolute -top-8 bg-background border border-border text-foreground rounded px-2 py-0.5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {STATUS_CONFIG[s].label}: {count}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {STATUS_OPTIONS.map(s => {
                  const colors = { pending: '#eab308', confirmed: '#2563eb', shipped: '#9333ea', delivered: '#16a34a', cancelled: '#dc2626' };
                  return (
                    <div key={s} className="flex items-center gap-1.5 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: colors[s] }} />
                      <span className="font-medium">{STATUS_CONFIG[s].label} ({counts[s] || 0})</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'orders' && (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[{ key: 'all', label: 'All', count: orders.length }, ...STATUS_OPTIONS.map(s => ({ key: s, label: STATUS_CONFIG[s].label, count: counts[s] || 0 }))].map(({ key, label, count }) => (
            <button key={key} onClick={() => setFilterStatus(key)}
              className={`p-3 rounded-xl border-2 text-center transition-all duration-200 hover:scale-[1.02] ${
                filterStatus === key ? 'border-navy-500 bg-navy-500/10' : 'border-border hover:border-navy-500/50 bg-muted/20'
              }`}>
              <p className="text-xl font-bold">{count}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
            </button>
          ))}
        </div>

        {/* Fetch error */}
        {fetchError && (
          <div className="p-4 rounded-xl border-2 border-destructive bg-destructive/10 text-destructive text-sm font-medium space-y-1">
            <p className="font-bold">Failed to load orders:</p>
            <p className="font-mono text-xs">{fetchError}</p>
            <p className="text-xs mt-2 text-muted-foreground">
              Most likely cause: Firestore rules not yet published. Go to Firebase Console → Firestore → Rules → click <strong>Publish</strong>.
            </p>
          </div>
        )}

        {/* Orders */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#1a4d7a' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-bold">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = statusCfg.icon;
              const orderDate = order.createdAt?.toDate?.()?.toLocaleString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              }) || 'Date unavailable';

              return (
                <Card key={order.id} className="overflow-hidden">
                  {/* Order Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-b-2 border-border bg-muted/20">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-4 w-4 ${statusCfg.color}`} />
                      <div>
                        <p className="text-xs text-muted-foreground">Order ID</p>
                        <p className="text-sm font-bold font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-sm font-medium">{orderDate}</p>
                      </div>
                    </div>

                    {/* Status Selector */}
                    <div className="flex items-center gap-2">
                      {updatingId === order.id ? (
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      ) : null}
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className="text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border-2 border-border bg-background focus:outline-none focus:border-navy-500 transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {STATUS_OPTIONS.map(s => (
                          <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Customer */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Customer</p>
                        <div className="space-y-1 text-sm">
                          <p className="font-bold">{order.customer?.name}</p>
                          <a href={`tel:${order.customer?.phone}`} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
                            <Phone className="h-3 w-3" /> {order.customer?.phone}
                          </a>
                          <p className="text-muted-foreground text-xs">{order.customer?.email}</p>
                          {order.customer?.company && <p className="text-xs text-muted-foreground">{order.customer.company}</p>}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-orange-500">
                          Items ({order.totalItems})
                        </p>
                        <div className="space-y-1">
                          {order.items?.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Badge variant="outline" className="text-xs flex-shrink-0">x{item.quantity}</Badge>
                              <span className="truncate">{item.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Shipping */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Shipping</p>
                        {order.shipping ? (
                          <div className="text-sm text-muted-foreground leading-relaxed">
                            <p>{order.shipping.address}</p>
                            <p>{order.shipping.city}, {order.shipping.state}</p>
                            <p className="font-bold text-foreground">{order.shipping.pincode}</p>
                          </div>
                        ) : <p className="text-sm text-muted-foreground">No address</p>}
                        {order.notes && (
                          <p className="text-xs italic text-muted-foreground border-l-2 border-orange-400 pl-2 mt-2">
                            {order.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      )}

      {/* ── Categories Tab ───────────────────────────────────────────── */}
      {activeTab === 'categories' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* Header */}
          {!showCategoryForm && (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider">Product Categories</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fsCategories.length} categor{fsCategories.length !== 1 ? 'ies' : 'y'} · shown on homepage & browsable by customers
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchCategories} disabled={categoriesLoading} className="gap-2 border-2">
                  <RefreshCw className={`h-4 w-4 ${categoriesLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Button variant="accent" size="sm" className="gap-2 font-bold uppercase tracking-wider"
                  onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}>
                  <PlusCircle className="h-4 w-4" /> Add Category
                </Button>
              </div>
            </div>
          )}

          {/* Category Form */}
          {showCategoryForm && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold uppercase tracking-wider">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <button onClick={() => { setShowCategoryForm(false); setEditingCategory(null); }}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <CategoryForm
                  category={editingCategory}
                  nextOrder={fsCategories.length + 1}
                  onSave={() => { setShowCategoryForm(false); setEditingCategory(null); fetchCategories(); }}
                  onCancel={() => { setShowCategoryForm(false); setEditingCategory(null); }}
                />
              </CardContent>
            </Card>
          )}

          {categoriesError && (
            <div className="p-4 rounded-xl border-2 border-destructive bg-destructive/10 text-destructive text-sm font-medium">
              {categoriesError}
            </div>
          )}

          {/* Delete confirmation */}
          {deleteCatConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              <Card className="w-full max-w-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-sm">Delete Category?</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This removes <span className="font-bold text-foreground">"{deleteCatConfirm.name}"</span> from the storefront. Products in this category are not deleted.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="destructive" className="flex-1 font-bold uppercase tracking-wider"
                      onClick={() => handleDeleteCategory(deleteCatConfirm)}>
                      Delete
                    </Button>
                    <Button variant="outline" className="flex-1 border-2" onClick={() => setDeleteCatConfirm(null)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Categories grid */}
          {!showCategoryForm && (
            categoriesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#1a4d7a' }} />
              </div>
            ) : fsCategories.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="inline-flex p-5 rounded-full bg-muted/30 border-2 border-dashed border-border">
                  <Tag className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <p className="font-bold text-lg">No categories yet</p>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Add categories like "Tarpaulin", "Ropes", "Pond Liner" — they'll appear on the homepage for customers to browse.
                </p>
                <Button variant="accent" className="gap-2 font-bold uppercase tracking-wider mt-2"
                  onClick={() => { setEditingCategory(null); setShowCategoryForm(true); }}>
                  <PlusCircle className="h-4 w-4" /> Add First Category
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {fsCategories.map((cat) => (
                  <Card key={cat.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="relative h-36 bg-muted/20 overflow-hidden">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-700 to-slate-900">
                          <Tag className="h-10 w-10 text-white/20" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest bg-navy-600/80 text-white px-2 py-0.5 backdrop-blur-sm">
                          Order #{cat.order}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-bold uppercase tracking-wide text-sm">{cat.name}</h3>
                      {cat.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{cat.description}</p>
                      )}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => { setEditingCategory(cat); setShowCategoryForm(true); }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider border-2 border-border rounded-lg hover:border-navy-500 hover:bg-navy-500/5 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteCatConfirm(cat)}
                          disabled={deletingCatId === cat.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider border-2 border-destructive/30 text-destructive rounded-lg hover:bg-destructive/5 transition-colors disabled:opacity-50"
                        >
                          {deletingCatId === cat.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                          Delete
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* ── Products Tab ─────────────────────────────────────────────── */}
      {activeTab === 'products' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

          {/* Header row */}
          {!showProductForm && (
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wider">Product Catalog</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fsProducts.length} custom product{fsProducts.length !== 1 ? 's' : ''} added · Static catalog has 6 base products
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchProducts} disabled={productsLoading} className="gap-2 border-2">
                  <RefreshCw className={`h-4 w-4 ${productsLoading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  className="gap-2 font-bold uppercase tracking-wider"
                  onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                >
                  <PlusCircle className="h-4 w-4" /> Add Product
                </Button>
              </div>
            </div>
          )}

          {/* ProductForm overlay */}
          {showProductForm && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base font-bold uppercase tracking-wider">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ProductForm
                  product={editingProduct}
                  onSave={() => {
                    setShowProductForm(false);
                    setEditingProduct(null);
                    fetchProducts();
                  }}
                  onCancel={() => { setShowProductForm(false); setEditingProduct(null); }}
                />
              </CardContent>
            </Card>
          )}

          {/* Error */}
          {productsError && (
            <div className="p-4 rounded-xl border-2 border-destructive bg-destructive/10 text-destructive text-sm font-medium">
              {productsError}
            </div>
          )}

          {/* Delete confirmation dialog */}
          {deleteConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
              <Card className="w-full max-w-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-sm">Delete Product?</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        This will permanently delete <span className="font-bold text-foreground">{deleteConfirm.name}</span> and its image. This cannot be undone.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="destructive"
                      className="flex-1 font-bold uppercase tracking-wider"
                      onClick={() => handleDeleteProduct(deleteConfirm)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-2"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Products grid */}
          {!showProductForm && (
            productsLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#1a4d7a' }} />
              </div>
            ) : fsProducts.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <div className="inline-flex p-5 rounded-full bg-muted/30 border-2 border-dashed border-border">
                  <LayoutGrid className="h-10 w-10 text-muted-foreground/40" />
                </div>
                <p className="font-bold text-lg">No custom products yet</p>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                  Add products here and they'll appear on the storefront alongside the base catalog.
                </p>
                <Button
                  variant="accent"
                  className="gap-2 font-bold uppercase tracking-wider mt-2"
                  onClick={() => { setEditingProduct(null); setShowProductForm(true); }}
                >
                  <PlusCircle className="h-4 w-4" /> Add First Product
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {fsProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden group hover:shadow-md transition-shadow">
                    {/* Image */}
                    <div className="relative h-44 bg-muted/20 overflow-hidden">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge variant="default" className="text-xs">{product.badge}</Badge>
                      </div>
                    </div>

                    {/* Info */}
                    <CardContent className="p-4 space-y-2">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">{product.category}</p>
                        <h3 className="font-bold uppercase tracking-wide text-sm leading-snug line-clamp-2">
                          {product.name}
                        </h3>
                        {product.priceRange && (
                          <p className="text-xs font-bold text-safety-500 mt-0.5">{product.priceRange}</p>
                        )}
                      </div>

                      {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => { setEditingProduct(product); setShowProductForm(true); }}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider border-2 border-border rounded-lg hover:border-navy-500 hover:bg-navy-500/5 transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product)}
                          disabled={deletingId === product.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold uppercase tracking-wider border-2 border-destructive/30 text-destructive rounded-lg hover:bg-destructive/5 transition-colors disabled:opacity-50"
                        >
                          {deletingId === product.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}

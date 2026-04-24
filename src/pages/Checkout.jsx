import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, ShoppingBag, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthModal } from '@/components/ui/auth-modal';
import { submitOrder } from '@/services/orderService';
import { cn } from '@/lib/utils';

const badgeVariantMap = {
  Popular: 'accent', Premium: 'default', Specialized: 'secondary',
  Advanced: 'default', Industrial: 'secondary', Classic: 'outline',
};

const indianStates = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh',
];

const validate = (form) => {
  const errors = {};
  if (!form.name.trim())  errors.name = 'Name is required';
  if (!form.phone.trim()) {
    errors.phone = 'Phone is required';
  } else if (!/^(\+91|91)?[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
    errors.phone = 'Enter valid Indian mobile number';
  }
  if (!form.email.trim())   errors.email = 'Email is required';
  if (!form.address.trim()) errors.address = 'Address is required';
  if (!form.city.trim())    errors.city = 'City is required';
  if (!form.state)          errors.state = 'State is required';
  if (!form.pincode.trim()) {
    errors.pincode = 'Pincode is required';
  } else if (!/^\d{6}$/.test(form.pincode)) {
    errors.pincode = 'Enter valid 6-digit pincode';
  }
  return errors;
};

export default function Checkout() {
  const { items, totalItems, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [form, setForm] = useState({
    name: '', phone: '', email: '', company: '',
    address: '', city: '', state: '', pincode: '', notes: '',
  });
  const [errors, setErrors]   = useState({});
  // status: 'idle' | 'payment' | 'paying' | 'saving' | 'success' | 'error'
  const [status, setStatus]   = useState('idle');
  const [orderId, setOrderId] = useState('');

  // Pre-fill from Google account + saved profile
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name:  prev.name  || user.displayName || '',
        email: prev.email || user.email       || '',
      }));
      const savedProfile = localStorage.getItem(`rainfort-profile-${user.uid}`);
      if (savedProfile) {
        try {
          const profile = JSON.parse(savedProfile);
          setForm(prev => ({
            ...prev,
            phone:   prev.phone   || profile.phone   || '',
            company: prev.company || profile.company || '',
            address: prev.address || profile.address || '',
            city:    prev.city    || profile.city    || '',
            state:   prev.state   || profile.state   || '',
            pincode: prev.pincode || profile.pincode || '',
          }));
        } catch { /* ignore */ }
      }
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user && items.length > 0) setShowAuthModal(true);
  }, [authLoading, user, items.length]);

  if (authLoading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-navy-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0 && status !== 'success') {
    return (
      <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold uppercase tracking-wider">No items to checkout</h1>
        <Link to="/"><Button variant="accent" className="gap-2 font-bold uppercase tracking-wider"><ArrowLeft className="h-4 w-4" /> Browse Products</Button></Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate form and save order directly
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) { setShowAuthModal(true); return; }
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    saveOrder();
  };

  // Save order to Firebase
  const saveOrder = async () => {
    setStatus('saving');
    try {
      const result = await submitOrder({
        ...form,
        items,
        userId: user.uid,
        payment: null,
      });
      setOrderId(result.id);
      clearCart();
      setStatus('success');
    } catch (err) {
      console.error('Order save failed:', err);
      setErrors({ submit: err.message || 'Failed to save order. Please try again or contact us via WhatsApp.' });
      setStatus('idle');
    }
  };

  // ── Saving spinner ──
  if (status === 'saving') {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-navy-500" />
        <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Saving your order…</p>
      </div>
    );
  }

  // ── Success ──
  if (status === 'success') {
    const shortId = orderId.slice(0, 8).toUpperCase();
    return (
      <div className="min-h-screen pt-28 pb-16 flex flex-col items-center justify-center gap-6 px-4">
        <div className="rounded-full bg-green-100 dark:bg-green-950 p-8 border-2 border-green-400">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        <div className="text-center space-y-2 max-w-md">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Order Placed!</h1>
          <p className="text-muted-foreground">
            Order <span className="font-bold text-foreground">#{shortId}</span> has been received.
          </p>
          <p className="text-sm text-muted-foreground">
            Our team will call within 2 hours to confirm final pricing and delivery.
          </p>
          <p className="text-sm">
            WhatsApp:{' '}
            <a href="https://wa.me/918385011488" className="text-green-600 font-bold hover:underline" target="_blank" rel="noopener noreferrer">
              +91 83850 11488
            </a>
          </p>
        </div>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link to="/orders"><Button variant="default" className="gap-2 font-bold uppercase tracking-wider">View My Orders</Button></Link>
          <Link to="/"><Button variant="outline" className="gap-2 border-2 font-bold uppercase tracking-wider">Continue Shopping</Button></Link>
        </div>
      </div>
    );
  }

  // ── Form (idle / error) ──
  const inputClass = (field) => cn(
    'w-full px-4 py-2.5 rounded-lg border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors duration-200',
    errors[field] ? 'border-destructive focus:border-destructive' : 'border-border focus:border-navy-500'
  );

  return (
    <>
      <div className="min-h-screen pt-24 pb-16">
        <div className="border-b-2 border-border bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-2">
              <ArrowLeft className="h-4 w-4" /> Back to Cart
            </button>
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold uppercase tracking-wider">Checkout</h1>
              {user && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <img src={user.photoURL || ''} alt="" className="h-6 w-6 rounded-full border border-border" onError={(e) => { e.target.style.display = 'none'; }} />
                  <span>Signed in as <span className="font-bold text-foreground">{user.displayName?.split(' ')[0]}</span></span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {!user && (
            <div className="mb-6 flex items-center justify-between gap-4 p-4 rounded-xl border-2 border-orange-400/50 bg-orange-50/50 dark:bg-orange-950/20">
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Sign in to place your order and track it anytime.</p>
              <Button variant="accent" size="sm" className="flex-shrink-0 font-bold uppercase tracking-wider" onClick={() => setShowAuthModal(true)}>Sign In</Button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader><CardTitle className="text-base">Contact Details</CardTitle></CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4">
                    {[
                      { name: 'name',    label: 'Full Name *',     placeholder: 'Your full name',  type: 'text' },
                      { name: 'phone',   label: 'Phone Number *',  placeholder: '+91 98765 43210', type: 'tel' },
                      { name: 'email',   label: 'Email Address *', placeholder: 'you@example.com', type: 'email' },
                      { name: 'company', label: 'Company Name',    placeholder: 'Optional',        type: 'text' },
                    ].map(({ name, label, placeholder, type }) => (
                      <div key={name} className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
                        <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} className={inputClass(name)} />
                        {errors[name] && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors[name]}</p>}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle className="text-base">Shipping Address</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Street Address *</label>
                      <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Building, street, area" className={inputClass('address')} />
                      {errors.address && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.address}</p>}
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { name: 'city', label: 'City *', placeholder: 'City', type: 'text', col: 1 },
                        { name: 'pincode', label: 'Pincode *', placeholder: '6-digit pincode', type: 'text', col: 1 },
                      ].map(({ name, label, placeholder, type }) => (
                        <div key={name} className="space-y-1">
                          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
                          <input type={type} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} maxLength={name === 'pincode' ? 6 : undefined} className={inputClass(name)} />
                          {errors[name] && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors[name]}</p>}
                        </div>
                      ))}
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State *</label>
                        <select name="state" value={form.state} onChange={handleChange} className={inputClass('state')}>
                          <option value="">Select State</option>
                          {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        {errors.state && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {errors.state}</p>}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Special Requirements / Notes</label>
                      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Size, GSM, color, quantity details…" rows={3} className={`${inputClass('notes')} resize-none`} />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card className="sticky top-24">
                  <CardHeader><CardTitle className="text-base">Order Summary</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {items.map((item) => (
                        <div key={item.cartKey} className="flex gap-3 items-start">
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-muted/20">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold truncate">{item.name}</p>
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {item.selectedSize && <span className="text-xs bg-navy-500/10 text-navy-600 dark:text-navy-300 px-1.5 rounded font-semibold">{item.selectedSize}</span>}
                              {item.selectedGsm  && <span className="text-xs bg-navy-500/10 text-navy-600 dark:text-navy-300 px-1.5 rounded font-semibold">{item.selectedGsm}</span>}
                            </div>
                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          <Badge variant={badgeVariantMap[item.badge] || 'default'} className="text-xs flex-shrink-0">{item.badge}</Badge>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-dashed border-border pt-3 space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Items</span>
                        <span className="font-bold">{totalItems}</span>
                      </div>
                      {items.map(item => item.priceRange && (
                        <div key={item.cartKey} className="flex justify-between">
                          <span className="text-muted-foreground truncate max-w-[140px]">{item.name}</span>
                          <span className="font-semibold text-safety-600 dark:text-safety-400 flex-shrink-0 ml-2">{item.priceRange}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-1 border-t border-border">
                        <span className="text-muted-foreground">Final Price</span>
                        <span className="font-bold text-orange-600">Team will confirm</span>
                      </div>
                    </div>
                    {errors.submit && (
                      <p className="text-xs text-destructive flex items-center gap-1.5 font-medium">
                        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" /> {errors.submit}
                      </p>
                    )}
                    {user ? (
                      <Button type="submit" variant="accent" size="lg" className="w-full gap-2 font-bold uppercase tracking-wider buy-glow" disabled={status === 'saving'}>
                        {status === 'saving'
                          ? <><Loader2 className="h-5 w-5 animate-spin" /> Placing Order…</>
                          : <><ShoppingBag className="h-5 w-5" /> Place Order</>
                        }
                      </Button>
                    ) : (
                      <Button type="button" variant="accent" size="lg" className="w-full gap-2 font-bold uppercase tracking-wider" onClick={() => setShowAuthModal(true)}>
                        Sign In to Place Order
                      </Button>
                    )}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      <span>Secure checkout · Team confirms pricing</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} redirectMessage="Sign in to place your order and track it anytime." />
    </>
  );
}

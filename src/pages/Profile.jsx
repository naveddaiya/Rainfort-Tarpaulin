import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Building2, Save, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/ui/auth-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const indianStates = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat',
  'Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh',
  'Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan',
  'Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh',
];

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] = useState({
    phone: '', company: '', address: '', city: '', state: '', pincode: '',
  });

  // Load saved profile from localStorage
  useEffect(() => {
    if (!user) return;
    const key = `rainfort-profile-${user.uid}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setProfile(JSON.parse(saved)); } catch { /* ignore */ }
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Save to localStorage
    const key = `rainfort-profile-${user.uid}`;
    localStorage.setItem(key, JSON.stringify(profile));

    // Also save to Firestore for persistence
    try {
      const { getDb } = await import('@/config/firebase');
      const { doc, setDoc } = await import('firebase/firestore');
      const db = await getDb();
      await setDoc(doc(db, 'profiles', user.uid), {
        ...profile,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        updatedAt: new Date(),
      }, { merge: true });
    } catch (err) {
      console.warn('Failed to save profile to Firestore:', err);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // Load from Firestore on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { getDb } = await import('@/config/firebase');
        const { doc, getDoc } = await import('firebase/firestore');
        const db = await getDb();
        const snap = await getDoc(doc(db, 'profiles', user.uid));
        if (snap.exists()) {
          const data = snap.data();
          setProfile(prev => ({
            phone: data.phone || prev.phone,
            company: data.company || prev.company,
            address: data.address || prev.address,
            city: data.city || prev.city,
            state: data.state || prev.state,
            pincode: data.pincode || prev.pincode,
          }));
          localStorage.setItem(`rainfort-profile-${user.uid}`, JSON.stringify({
            phone: data.phone || '', company: data.company || '',
            address: data.address || '', city: data.city || '',
            state: data.state || '', pincode: data.pincode || '',
          }));
        }
      } catch { /* ignore */ }
    })();
  }, [user]);

  if (authLoading) {
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
            <User className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold uppercase tracking-wider">My Profile</h1>
            <p className="text-muted-foreground">Sign in to manage your profile and saved addresses.</p>
          </div>
          <Button variant="accent" className="font-bold uppercase tracking-wider" onClick={() => setShowAuthModal(true)}>
            Sign In
          </Button>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} redirectMessage="Sign in to manage your profile." />
      </>
    );
  }

  const inputClass = "w-full px-4 py-2.5 rounded-lg border-2 border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-navy-500 transition-colors";

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="border-b-2 border-border bg-muted/20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors mb-2 w-fit">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-3xl font-bold uppercase tracking-wider">My Profile</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Account Info (from Google) */}
        <Card>
          <CardHeader><CardTitle className="text-base">Account Information</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <img src={user.photoURL || ''} alt={user.displayName || 'User'}
                className="h-16 w-16 rounded-full border-2 border-border"
                onError={(e) => { e.target.style.display = 'none'; }} />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <p className="font-bold">{user.displayName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Name and email are managed by your Google account.
            </p>
          </CardContent>
        </Card>

        {/* Editable Profile */}
        <form onSubmit={handleSave}>
          <Card>
            <CardHeader><CardTitle className="text-base">Contact & Shipping Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-muted-foreground">
                Save your details to auto-fill during checkout.
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Phone className="h-3 w-3" /> Phone Number
                  </label>
                  <input type="tel" name="phone" value={profile.phone} onChange={handleChange}
                    placeholder="+91 98765 43210" className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Building2 className="h-3 w-3" /> Company Name
                  </label>
                  <input type="text" name="company" value={profile.company} onChange={handleChange}
                    placeholder="Optional" className={inputClass} />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Street Address
                </label>
                <input type="text" name="address" value={profile.address} onChange={handleChange}
                  placeholder="Building, street, area" className={inputClass} />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">City</label>
                  <input type="text" name="city" value={profile.city} onChange={handleChange}
                    placeholder="City" className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">State</label>
                  <select name="state" value={profile.state} onChange={handleChange} className={inputClass}>
                    <option value="">Select State</option>
                    {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Pincode</label>
                  <input type="text" name="pincode" value={profile.pincode} onChange={handleChange}
                    placeholder="6-digit pincode" maxLength={6} className={inputClass} />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" variant="accent" className="gap-2 font-bold uppercase tracking-wider" disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                    : saved ? <><CheckCircle className="h-4 w-4" /> Saved!</>
                    : <><Save className="h-4 w-4" /> Save Profile</>}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

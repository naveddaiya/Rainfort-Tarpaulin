import { useState, useEffect } from 'react';
import { Star, Loader2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

function StarRating({ rating, onRate, interactive = false, size = 'h-5 w-5' }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate?.(star)}
        >
          <Star className={`${size} ${
            star <= (hovered || rating)
              ? 'fill-orange-500 text-orange-500'
              : 'fill-none text-muted-foreground/40'
          } transition-colors`} />
        </button>
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [hasPurchased, setHasPurchased] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  // Check if the logged-in user has a delivered/confirmed order containing this product
  useEffect(() => {
    if (!user) { setHasPurchased(false); return; }
    const check = async () => {
      try {
        const { getDb } = await import('@/config/firebase');
        const { collection, query, where, getDocs } = await import('firebase/firestore');
        const db = await getDb();
        const snap = await getDocs(
          query(collection(db, 'orders'), where('userId', '==', user.uid))
        );
        const purchased = snap.docs.some(d => {
          const data = d.data();
          return (data.items || []).some(item => String(item.id) === String(productId));
        });
        setHasPurchased(purchased);
      } catch { setHasPurchased(false); }
    };
    check();
  }, [user, productId]);

  const fetchReviews = async () => {
    try {
      const { getDb } = await import('@/config/firebase');
      const { collection, query, where, getDocs } = await import('firebase/firestore');
      const db = await getDb();
      const q = query(
        collection(db, 'reviews'),
        where('productId', '==', productId)
      );
      const snap = await getDocs(q);
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      docs.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setReviews(docs);
      if (user) {
        setHasReviewed(docs.some(r => r.userId === user.uid));
      }
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || newReview.rating === 0) return;
    setSubmitting(true);
    try {
      const { getDb } = await import('@/config/firebase');
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
      const db = await getDb();
      await addDoc(collection(db, 'reviews'), {
        productId,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        rating: newReview.rating,
        comment: newReview.comment.trim(),
        createdAt: serverTimestamp(),
      });
      setNewReview({ rating: 0, comment: '' });
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length > 0 ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <h2 className="text-2xl font-bold uppercase tracking-wider">Customer Reviews</h2>
        <div className="h-1 flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#1a4d7a' }} />
        </div>
      ) : (
        <>
          {/* Rating Summary */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-border bg-muted/20">
              <p className="text-4xl font-bold">{avgRating}</p>
              <StarRating rating={Math.round(avgRating)} />
              <p className="text-sm text-muted-foreground">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="space-y-2 p-6 rounded-xl border-2 border-border bg-muted/20">
              {ratingDistribution.map(({ star, count, percent }) => (
                <div key={star} className="flex items-center gap-2 text-sm">
                  <span className="w-8 text-right font-medium">{star}</span>
                  <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                  <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-8 text-muted-foreground text-xs">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review — only for verified purchasers */}
          {!user ? (
            <p className="text-sm text-muted-foreground">Sign in to leave a review.</p>
          ) : !hasPurchased ? (
            <p className="text-sm text-muted-foreground border border-border rounded-lg px-4 py-3">
              Only customers who have purchased this product can leave a review.
            </p>
          ) : hasReviewed ? (
            <p className="text-sm text-muted-foreground border border-border rounded-lg px-4 py-3">
              ✓ You have already reviewed this product.
            </p>
          ) : showForm ? (
            <Card>
              <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm font-bold uppercase tracking-wider">Write a Review</p>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rating *</label>
                    <StarRating rating={newReview.rating} onRate={(r) => setNewReview(p => ({ ...p, rating: r }))} interactive />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Comment</label>
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview(p => ({ ...p, comment: e.target.value }))}
                      placeholder="Share your experience with this product..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-border bg-background focus:outline-none focus:border-navy-500 transition-colors resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" variant="accent" size="sm" className="font-bold uppercase tracking-wider" disabled={submitting || newReview.rating === 0}>
                      {submitting ? <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Submitting...</> : 'Submit Review'}
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="border-2" onClick={() => setShowForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Button variant="outline" size="sm" className="border-2 gap-2 font-bold uppercase tracking-wider"
              onClick={() => setShowForm(true)}>
              <MessageSquare className="h-4 w-4" /> Write a Review
            </Button>
          )}

          {/* Reviews List */}
          {reviews.length > 0 ? (
            <div className="space-y-3">
              {reviews.map((review) => {
                const reviewDate = review.createdAt?.toDate?.()?.toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric'
                }) || '';

                return (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <img src={review.userPhoto || ''} alt={review.userName}
                          className="h-8 w-8 rounded-full border border-border flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold">{review.userName}</span>
                            <StarRating rating={review.rating} size="h-3.5 w-3.5" />
                            <span className="text-xs text-muted-foreground">{reviewDate}</span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-muted-foreground mt-1">{review.comment}</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No reviews yet. Be the first to review!</p>
          )}
        </>
      )}
    </div>
  );
}

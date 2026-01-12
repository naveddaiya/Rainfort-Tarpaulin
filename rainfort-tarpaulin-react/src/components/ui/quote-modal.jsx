import { useEffect, useState } from 'react';
import { X, Sparkles, CheckCircle2, Phone, User, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from './button';
import { submitQuote } from '@/services/quoteService';

export function QuoteModal({ isOpen, onClose, productName = null }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    requirement: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setIsSuccess(false);
      setIsSubmitting(false);
      setError(null);
    } else {
      document.body.style.overflow = 'unset';
      setTimeout(() => {
        setFormData({ name: '', phone: '', requirement: '' });
        setIsSuccess(false);
        setError(null);
      }, 300);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Submit to Firebase
      const result = await submitQuote({
        ...formData,
        product: productName
      });

      console.log('✅ Quote submitted to Firebase:', result);

      setIsSubmitting(false);
      setIsSuccess(true);

      // Close modal after success animation
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error('❌ Error submitting quote:', err);
      setIsSubmitting(false);
      setError(err.message || 'Failed to submit quote. Please try again.');

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Decorative glow effects */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-navy-500/30 rounded-full blur-3xl animate-pulse delay-1000" />

        {/* Modal Content */}
        <div className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-2xl border-2 border-orange-500/20 overflow-hidden">
          {/* Animated border gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-navy-500 to-orange-500 opacity-50 blur-xl animate-pulse" />

          {/* Inner content container */}
          <div className="relative bg-white dark:bg-gray-900 m-[2px] rounded-2xl">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:rotate-90 group z-10"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-orange-600" />
            </button>

            {/* Success State */}
            {isSuccess && (
              <div className="absolute inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-20 animate-in fade-in zoom-in-95 duration-500">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 rounded-full blur-2xl animate-pulse" />
                  <CheckCircle2 className="w-24 h-24 text-green-500 animate-in zoom-in-50 spin-in-180 duration-700" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white animate-in slide-in-from-bottom-4 duration-500 delay-300">
                  Request Received!
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center px-8 animate-in slide-in-from-bottom-4 duration-500 delay-500">
                  We'll contact you shortly with your custom quote
                </p>
                <div className="mt-4 flex gap-2 animate-in slide-in-from-bottom-4 duration-500 delay-700">
                  <Sparkles className="w-5 h-5 text-orange-500 animate-pulse" />
                  <Sparkles className="w-5 h-5 text-orange-500 animate-pulse delay-150" />
                  <Sparkles className="w-5 h-5 text-orange-500 animate-pulse delay-300" />
                </div>
              </div>
            )}

            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg shadow-orange-500/50 animate-pulse">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-navy-600 to-orange-600 bg-clip-text text-transparent">
                  Get Your Custom Quote
                </h2>
              </div>
              {productName && (
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-14 animate-in slide-in-from-left duration-500">
                  for <span className="font-semibold text-orange-600">{productName}</span>
                </p>
              )}
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 ml-14">
                Fill in your details and we'll get back to you within 24 hours!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-red-800 dark:text-red-300 mb-1">
                      Submission Failed
                    </h4>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              )}

              {/* Name Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User className={`w-4 h-4 transition-colors ${focusedField === 'name' ? 'text-orange-600' : 'text-gray-400'}`} />
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 outline-none placeholder:text-gray-400 dark:text-white"
                  />
                  {formData.name && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in zoom-in-50 duration-300" />
                  )}
                </div>
              </div>

              {/* Phone Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Phone className={`w-4 h-4 transition-colors ${focusedField === 'phone' ? 'text-orange-600' : 'text-gray-400'}`} />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 outline-none placeholder:text-gray-400 dark:text-white"
                  />
                  {formData.phone && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in zoom-in-50 duration-300" />
                  )}
                </div>
              </div>

              {/* Requirement Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <MessageSquare className={`w-4 h-4 transition-colors ${focusedField === 'requirement' ? 'text-orange-600' : 'text-gray-400'}`} />
                  Your Requirements
                </label>
                <div className="relative">
                  <textarea
                    name="requirement"
                    value={formData.requirement}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('requirement')}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows="4"
                    placeholder="Tell us about your requirements... (e.g., size, quantity, specifications)"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 outline-none resize-none placeholder:text-gray-400 dark:text-white"
                  />
                  {formData.requirement && (
                    <CheckCircle2 className="absolute right-3 top-3 w-5 h-5 text-green-500 animate-in zoom-in-50 duration-300" />
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-[2px] transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 rounded-xl flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="font-bold text-white">Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                      <span className="font-bold text-white">Get My Custom Quote</span>
                      <Sparkles className="w-5 h-5 text-white group-hover:-rotate-12 transition-transform" />
                    </>
                  )}
                </div>
              </button>

              {/* Trust indicators */}
              <div className="flex items-center justify-center gap-6 pt-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>24hr Response</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>No Spam</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>Best Prices</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

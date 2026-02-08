import { useEffect, useState } from 'react';
import { X, CheckCircle2, Phone, User, ChevronDown, AlertCircle, Sparkles } from 'lucide-react';
import { submitQuote } from '@/services/quoteService';
import { products } from '@/data/products';

export function QuoteModal({ isOpen, onClose, productName = null }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    selectedProduct: productName || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [focusedField, setFocusedField] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const productOptions = [
    ...products.map(p => p.name),
    'Custom Requirement'
  ];

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
        name: formData.name,
        phone: formData.phone,
        product: formData.selectedProduct || productName
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quote-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg my-auto">
        {/* Modal Content */}
        <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close quote modal"
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:rotate-90 group z-10"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-orange-600" aria-hidden="true" />
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
            <div className="relative px-4 sm:px-8 pt-4 sm:pt-8 pb-3 sm:pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                <div className="p-1.5 sm:p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg shadow-orange-500/50 animate-pulse">
                  <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <h2 id="quote-modal-title" className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-navy-600 to-orange-600 bg-clip-text text-transparent">
                  Get Your Custom Quote
                </h2>
              </div>
              {productName && (
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-8 sm:ml-14 animate-in slide-in-from-left duration-500">
                  for <span className="font-semibold text-orange-600">{productName}</span>
                </p>
              )}
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 ml-8 sm:ml-14">
                Fill in your details and we'll get back to you within 24 hours!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-6">
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
                    aria-label="Dismiss error message"
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/40 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Name Field */}
              <div className="group">
                <label htmlFor="quote-name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <User className={`w-4 h-4 transition-colors ${focusedField === 'name' ? 'text-orange-600' : 'text-gray-400'}`} aria-hidden="true" />
                  Your Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="quote-name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="name"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 outline-none dark:text-white"
                  />
                  {formData.name && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in zoom-in-50 duration-300" />
                  )}
                </div>
              </div>

              {/* Phone Field */}
              <div className="group">
                <label htmlFor="quote-phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Phone className={`w-4 h-4 transition-colors ${focusedField === 'phone' ? 'text-orange-600' : 'text-gray-400'}`} aria-hidden="true" />
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    id="quote-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="tel"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 outline-none dark:text-white"
                  />
                  {formData.phone && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500 animate-in zoom-in-50 duration-300" />
                  )}
                </div>
              </div>

              {/* Product Selection Dropdown */}
              <div className="group">
                <label id="quote-product-label" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <ChevronDown className={`w-4 h-4 transition-colors ${focusedField === 'selectedProduct' ? 'text-orange-600' : 'text-gray-400'}`} aria-hidden="true" />
                  Select Product
                </label>
                <div className="relative">
                  {/* Custom Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onFocus={() => setFocusedField('selectedProduct')}
                    onBlur={() => {
                      setFocusedField(null);
                      setTimeout(() => setIsDropdownOpen(false), 150);
                    }}
                    aria-labelledby="quote-product-label"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                    className={`w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 rounded-xl transition-all duration-300 outline-none text-left flex items-center justify-between ${isDropdownOpen || focusedField === 'selectedProduct'
                        ? 'border-orange-500 ring-4 ring-orange-500/20'
                        : 'border-gray-200 dark:border-gray-700'
                      }`}
                  >
                    <span className={formData.selectedProduct ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                      {formData.selectedProduct || '-- Select a Product --'}
                    </span>
                    <div className="flex items-center gap-2">
                      {formData.selectedProduct && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Custom Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-gray-700 rounded-xl shadow-2xl shadow-orange-500/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="max-h-48 overflow-y-auto">
                        {productOptions.map((product, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, selectedProduct: product });
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-4 py-3 text-left transition-all duration-150 flex items-center justify-between ${formData.selectedProduct === product
                                ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-semibold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                          >
                            <span>{product}</span>
                            {formData.selectedProduct === product && (
                              <CheckCircle2 className="w-4 h-4 text-orange-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hidden input for form validation */}
                  <input
                    type="hidden"
                    name="selectedProduct"
                    value={formData.selectedProduct}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending Request...
                  </span>
                ) : (
                  'Get My Custom Quote'
                )}
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
  );
}

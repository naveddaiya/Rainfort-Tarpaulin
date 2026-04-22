/**
 * ProductForm — Admin component for adding/editing products.
 * Images are uploaded to Cloudinary (free tier) with a real progress bar.
 */

import { useState, useRef } from 'react';
import { X, Plus, Trash2, Upload, Loader2, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addProduct, updateProduct } from '@/services/productService';
import { uploadToCloudinary } from '@/services/cloudinaryService';

const CATEGORIES = [
  'Heavy Duty', 'Industrial', 'Agricultural', 'Truck & Transport',
  'Waterproof', 'Fire Retardant', 'Export Quality', 'Custom',
];

const BADGE_OPTIONS = ['Popular', 'Premium', 'Specialized', 'Advanced', 'Industrial', 'Classic', 'New'];

const FIELD = 'flex flex-col gap-1';
const LABEL = 'text-xs font-bold uppercase tracking-wider text-muted-foreground';
const INPUT = 'w-full px-3 py-2 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:border-navy-500 transition-colors';

const emptyForm = () => ({
  name: '',
  category: '',
  badge: 'Popular',
  description: '',
  priceRange: '',
  image: '',
  features: [''],
  applications: [''],
  specifications: { material: '', color: '', warranty: '' },
  variants: { sizes: '', gsm: '' },
});

export default function ProductForm({ product = null, onSave, onCancel }) {
  const isEdit = Boolean(product);

  const initForm = () => {
    if (!product) return emptyForm();
    return {
      name:        product.name || '',
      category:    product.category || '',
      badge:       product.badge || 'Popular',
      description: product.description || '',
      priceRange:  product.priceRange || '',
      image:       product.image || '',
      features:    product.features?.length ? product.features : [''],
      applications: product.applications?.length ? product.applications : [''],
      specifications: {
        material: product.specifications?.material || '',
        color:    product.specifications?.color || '',
        warranty: product.specifications?.warranty || '',
      },
      variants: {
        sizes: product.variants?.sizes?.join(', ') || '',
        gsm:   product.variants?.gsm?.join(', ') || '',
      },
    };
  };

  const [form, setForm]               = useState(initForm);
  const [imageFile, setImageFile]     = useState(null);
  const [imagePreview, setImagePreview] = useState(product?.image || null);
  const [uploadProgress, setUploadProgress] = useState(null); // null | 0–100
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState('');
  const fileRef = useRef();

  // ── Helpers ──────────────────────────────────────────────────────────────

  const set      = (field, value) => setForm(f => ({ ...f, [field]: value }));
  const setSpec  = (k, v) => setForm(f => ({ ...f, specifications: { ...f.specifications, [k]: v } }));
  const setVar   = (k, v) => setForm(f => ({ ...f, variants: { ...f.variants, [k]: v } }));

  const addListItem    = (field)       => setForm(f => ({ ...f, [field]: [...f[field], ''] }));
  const setListItem    = (field, i, v) => setForm(f => ({ ...f, [field]: f[field].map((x, j) => j === i ? v : x) }));
  const removeListItem = (field, i)    => setForm(f => ({ ...f, [field]: f[field].filter((_, j) => j !== i) }));

  // ── Image ────────────────────────────────────────────────────────────────

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Only image files are allowed.'); return; }
    if (file.size > 10 * 1024 * 1024)   { setError('Image must be under 10 MB.'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleImageChange({ target: { files: [file] } });
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim())        { setError('Product name is required.'); return; }
    if (!form.category.trim())    { setError('Category is required.'); return; }
    if (!form.priceRange.trim())  { setError('Price range is required.'); return; }
    if (!form.description.trim()) { setError('Description is required.'); return; }
    if (!imageFile && !form.image) { setError('Product image is required.'); return; }

    setSaving(true);
    try {
      let imageUrl = form.image;

      if (imageFile) {
        setUploadProgress(0);
        imageUrl = await uploadToCloudinary(imageFile, setUploadProgress);
      }

      const cleanList = (arr) => arr.map(s => s.trim()).filter(Boolean);
      const splitCSV  = (str) => str.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        name:        form.name.trim(),
        category:    form.category.trim(),
        badge:       form.badge,
        description: form.description.trim(),
        priceRange:  form.priceRange.trim(),
        image:       imageUrl,
        features:    cleanList(form.features),
        applications: cleanList(form.applications),
        specifications: {
          material: form.specifications.material.trim(),
          color:    form.specifications.color.trim(),
          warranty: form.specifications.warranty.trim(),
        },
        variants: {
          sizes: splitCSV(form.variants.sizes),
          gsm:   splitCSV(form.variants.gsm),
        },
      };

      if (isEdit) {
        await updateProduct(product.id, payload);
      } else {
        await addProduct(payload);
      }

      onSave?.();
    } catch (err) {
      console.error('ProductForm error:', err);
      setError(err.message || 'Failed to save product. Please try again.');
    } finally {
      setSaving(false);
      setUploadProgress(null);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const uploadLabel = uploadProgress !== null
    ? `Uploading… ${uploadProgress}%`
    : 'Saving…';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Image Upload ── */}
      <div className={FIELD}>
        <label className={LABEL}>Product Image *</label>

        {/* Drop zone */}
        <div
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className="relative cursor-pointer rounded-2xl border-2 border-dashed border-border hover:border-navy-500 transition-colors overflow-hidden group"
        >
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="preview"
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Upload className="h-5 w-5 text-white" />
                <p className="text-white text-sm font-bold uppercase tracking-wider">Change Image</p>
              </div>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <div className="p-4 rounded-full bg-muted/50 border-2 border-border group-hover:border-navy-500/50 transition-colors">
                <ImageIcon className="h-8 w-8" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold">Click or drag &amp; drop to upload</p>
                <p className="text-xs mt-0.5">PNG, JPG, WebP — max 10 MB</p>
              </div>
            </div>
          )}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* Progress bar */}
        {uploadProgress !== null && (
          <div className="space-y-1">
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-navy-500 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground text-right font-medium">{uploadProgress}%</p>
          </div>
        )}
      </div>

      {/* ── Name + Category ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={FIELD}>
          <label className={LABEL}>Product Name *</label>
          <input
            type="text"
            className={INPUT}
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Heavy Duty HDPE Tarpaulin"
          />
        </div>
        <div className={FIELD}>
          <label className={LABEL}>Category *</label>
          <select className={INPUT} value={form.category} onChange={e => set('category', e.target.value)}>
            <option value="">Select category</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ── Badge + Price Range ── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className={FIELD}>
          <label className={LABEL}>Badge</label>
          <select className={INPUT} value={form.badge} onChange={e => set('badge', e.target.value)}>
            {BADGE_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <div className={FIELD}>
          <label className={LABEL}>Price Range *</label>
          <input
            type="text"
            className={INPUT}
            value={form.priceRange}
            onChange={e => set('priceRange', e.target.value)}
            placeholder="e.g. ₹850 – ₹3,200"
          />
        </div>
      </div>

      {/* ── Description ── */}
      <div className={FIELD}>
        <label className={LABEL}>Description *</label>
        <textarea
          className={INPUT + ' min-h-[90px] resize-y'}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Describe the product, its use case, and key benefits..."
        />
      </div>

      {/* ── Specifications ── */}
      <div className="space-y-2">
        <p className={LABEL}>Specifications</p>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { key: 'material', placeholder: 'e.g. 100% Virgin HDPE' },
            { key: 'color',    placeholder: 'e.g. Blue / Green / Silver' },
            { key: 'warranty', placeholder: 'e.g. 2 Years' },
          ].map(({ key, placeholder }) => (
            <div key={key} className={FIELD}>
              <label className={LABEL}>{key}</label>
              <input
                type="text"
                className={INPUT}
                value={form.specifications[key]}
                onChange={e => setSpec(key, e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Variants ── */}
      <div className="space-y-2">
        <p className={LABEL}>Variants (comma-separated)</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className={FIELD}>
            <label className={LABEL}>Sizes</label>
            <input
              type="text"
              className={INPUT}
              value={form.variants.sizes}
              onChange={e => setVar('sizes', e.target.value)}
              placeholder="e.g. 6×4 ft, 9×6 ft, 12×9 ft"
            />
          </div>
          <div className={FIELD}>
            <label className={LABEL}>GSM Options</label>
            <input
              type="text"
              className={INPUT}
              value={form.variants.gsm}
              onChange={e => setVar('gsm', e.target.value)}
              placeholder="e.g. 90 GSM, 120 GSM, 150 GSM"
            />
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <DynamicList
        label="Features"
        items={form.features}
        placeholder="e.g. UV Stabilized"
        onAdd={() => addListItem('features')}
        onChange={(i, v) => setListItem('features', i, v)}
        onRemove={i => removeListItem('features', i)}
      />

      {/* ── Applications ── */}
      <DynamicList
        label="Applications"
        items={form.applications}
        placeholder="e.g. Construction Sites"
        onAdd={() => addListItem('applications')}
        onChange={(i, v) => setListItem('applications', i, v)}
        onRemove={i => removeListItem('applications', i)}
      />

      {/* ── Error ── */}
      {error && (
        <div className="p-3 rounded-xl border-2 border-destructive/40 bg-destructive/5 text-sm text-destructive font-medium">
          {error}
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex gap-3 pt-2">
        <Button
          type="submit"
          variant="accent"
          className="flex-1 gap-2 font-bold uppercase tracking-wider"
          disabled={saving}
        >
          {saving
            ? <><Loader2 className="h-4 w-4 animate-spin" /> {uploadLabel}</>
            : <><CheckCircle className="h-4 w-4" /> {isEdit ? 'Update Product' : 'Add Product'}</>
          }
        </Button>
        <Button
          type="button"
          variant="outline"
          className="gap-2 border-2"
          onClick={onCancel}
          disabled={saving}
        >
          <X className="h-4 w-4" /> Cancel
        </Button>
      </div>
    </form>
  );
}

function DynamicList({ label, items, placeholder, onAdd, onChange, onRemove }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className={LABEL}>{label}</p>
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-navy-600 dark:text-navy-300 hover:underline"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      <div className="space-y-2">
        {items.map((val, i) => (
          <div key={i} className="flex gap-2">
            <input
              type="text"
              className={INPUT}
              value={val}
              onChange={e => onChange(i, e.target.value)}
              placeholder={placeholder}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

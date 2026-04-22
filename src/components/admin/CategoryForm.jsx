import { useState, useRef } from 'react';
import { Upload, Loader2, CheckCircle, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { addCategory, updateCategory } from '@/services/categoryService';
import { uploadToCloudinary } from '@/services/cloudinaryService';

const LABEL = 'text-xs font-bold uppercase tracking-wider text-muted-foreground';
const INPUT = 'w-full px-3 py-2 rounded-xl border-2 border-border bg-background text-sm focus:outline-none focus:border-navy-500 transition-colors';

export default function CategoryForm({ category = null, nextOrder = 1, onSave, onCancel }) {
  const isEdit = Boolean(category);

  const [form, setForm] = useState({
    name:        category?.name        || '',
    description: category?.description || '',
    image:       category?.image       || '',
    order:       category?.order       ?? nextOrder,
  });
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [uploading, setUploading]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const fileRef = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadDone(false);
    setError('');
    try {
      const url = await uploadToCloudinary(file, (p) => setUploadProgress(Math.round(p)));
      set('image', url);
      setUploadDone(true);
    } catch (err) {
      setError('Image upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Category name is required.'); return; }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name:        form.name.trim(),
        description: form.description.trim(),
        image:       form.image,
        order:       Number(form.order) || nextOrder,
      };
      if (isEdit) {
        await updateCategory(category.id, payload);
      } else {
        await addCategory(payload);
      }
      onSave();
    } catch (err) {
      setError(err.message || 'Failed to save category.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className={LABEL}>Category Name *</label>
        <input
          className={INPUT}
          placeholder="e.g. Tarpaulin, Ropes, Pond Liner..."
          value={form.name}
          onChange={e => set('name', e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className={LABEL}>Description</label>
        <textarea
          className={`${INPUT} resize-none`}
          rows={2}
          placeholder="Short description shown on the category card..."
          value={form.description}
          onChange={e => set('description', e.target.value)}
        />
      </div>

      {/* Display Order */}
      <div className="flex flex-col gap-1 max-w-[120px]">
        <label className={LABEL}>Display Order</label>
        <input
          type="number"
          min={1}
          className={INPUT}
          value={form.order}
          onChange={e => set('order', e.target.value)}
        />
      </div>

      {/* Image Upload */}
      <div className="flex flex-col gap-2">
        <label className={LABEL}>Category Image</label>

        {form.image ? (
          <div className="relative w-full h-36 border-2 border-border overflow-hidden">
            <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => { set('image', ''); setUploadDone(false); }}
              className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 py-8 border-2 border-dashed border-border hover:border-navy-500 cursor-pointer transition-colors"
          >
            {uploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-navy-500" />
                <p className="text-sm font-bold text-navy-500">{uploadProgress}% uploading…</p>
              </>
            ) : uploadDone ? (
              <>
                <CheckCircle className="h-8 w-8 text-emerald-500" />
                <p className="text-sm font-bold text-emerald-600">Uploaded</p>
              </>
            ) : (
              <>
                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Click to upload category image</p>
                <p className="text-xs text-muted-foreground/60">JPG, PNG, WEBP — max 10 MB</p>
              </>
            )}
          </div>
        )}

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

        {!form.image && !uploading && (
          <input
            className={INPUT}
            placeholder="…or paste an image URL"
            value={form.image}
            onChange={e => set('image', e.target.value)}
          />
        )}
      </div>

      {error && (
        <p className="text-xs text-destructive font-medium bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <Button
          type="submit"
          variant="accent"
          disabled={saving || uploading}
          className="flex-1 gap-2 font-bold uppercase tracking-wider"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isEdit ? 'Save Changes' : 'Add Category'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1 border-2">
          Cancel
        </Button>
      </div>
    </form>
  );
}

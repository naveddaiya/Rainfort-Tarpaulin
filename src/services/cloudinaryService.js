/**
 * cloudinaryService.js — Unsigned image upload to Cloudinary.
 *
 * Uses the Cloudinary unsigned upload API — no server, no API secret needed.
 * Free tier gives 25 GB storage + 25 GB bandwidth/month, more than enough.
 *
 * Setup:
 *   1. Sign up at https://cloudinary.com (free)
 *   2. Settings → Upload → Upload presets → Add preset → Signing mode: Unsigned
 *   3. Add to .env:
 *        VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
 *        VITE_CLOUDINARY_UPLOAD_PRESET=your-preset-name
 */

const CLOUD_NAME   = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

/**
 * Upload an image file to Cloudinary with real progress tracking.
 *
 * @param {File}     file         - Image file to upload
 * @param {function} onProgress   - Called with 0–100 as upload progresses
 * @returns {Promise<string>}     - Resolves to the secure Cloudinary URL
 */
export const uploadToCloudinary = (file, onProgress) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    return Promise.reject(
      new Error(
        'Cloudinary not configured. Add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.'
      )
    );
  }

  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', 'rainfort-products');

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable) {
        onProgress?.(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data.secure_url);
        } catch {
          reject(new Error('Invalid response from Cloudinary.'));
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err?.error?.message || `Upload failed (${xhr.status})`));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () =>
      reject(new Error('Network error during upload. Check your internet connection.'))
    );

    xhr.addEventListener('abort', () =>
      reject(new Error('Upload was cancelled.'))
    );

    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`);
    xhr.send(formData);
  });
};

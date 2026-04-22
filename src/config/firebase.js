/**
 * Firebase initialisation — static imports, eager singleton.
 *
 * WHY static imports:
 * The previous lazy/dynamic import pattern caused a module-instance mismatch
 * in Firebase 12. `getFirestore` (inside firebase.js's dynamic import) and
 * `collection` / `addDoc` (in orderService.js's separate dynamic import) could
 * end up as different module evaluations after HMR or Vite chunk-splitting,
 * making Firebase's internal `instanceof Firestore` check fail with:
 *   "Expected first argument to collection() to be … FirebaseFirestore"
 *
 * Static imports are placed in Vite's module cache at the time this file is
 * first loaded. Every subsequent `await import('firebase/firestore')` anywhere
 * in the app hits that cache and receives the SAME module instance — no
 * mismatch, no instanceof failures.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection, doc,
  getDoc, getDocs,
  addDoc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, where, limit,
} from 'firebase/firestore';
import { getAuth as _getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialise once — safe if called from service workers or multiple entry points.
const app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db   = getFirestore(app);
export const auth = _getAuth(app);

// ── Async API kept for backward compatibility with existing callers ──────────
// AuthContext, orderService, etc. all do `await getDb()` / `await getAuth()`.
// These now resolve instantly since the instances are already created above.
export const getFirebaseApp = () => Promise.resolve(app);
export const getDb   = () => Promise.resolve(db);
export const getAuth = () => Promise.resolve(auth);

// ── Re-export Firestore helpers from THIS file ───────────────────────────────
// Any lazy-loaded chunk that imports these will get the SAME module instance
// as the one used to create `db` above — preventing the "instanceof" mismatch.
export {
  collection, doc,
  getDoc, getDocs,
  addDoc, updateDoc, deleteDoc,
  serverTimestamp, query, orderBy, where, limit,
};

// Analytics remains lazy — it's optional and heavier.
export const initAnalytics = async () => {
  try {
    const { getAnalytics } = await import('firebase/analytics');
    return getAnalytics(app);
  } catch {
    // Analytics is not critical.
  }
  return null;
};

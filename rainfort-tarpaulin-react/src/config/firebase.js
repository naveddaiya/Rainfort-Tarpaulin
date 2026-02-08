// Lazy Firebase initialization - only loads when actually needed
let firebaseApp = null;
let firestoreDb = null;

/**
 * Get Firebase App - lazy initialization
 */
export const getFirebaseApp = async () => {
  if (firebaseApp) return firebaseApp;

  const { initializeApp } = await import('firebase/app');

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };

  firebaseApp = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized (lazy)');
  return firebaseApp;
};

/**
 * Get Firestore DB - lazy initialization
 */
export const getDb = async () => {
  if (firestoreDb) return firestoreDb;

  const app = await getFirebaseApp();
  const { getFirestore } = await import('firebase/firestore');
  firestoreDb = getFirestore(app);
  return firestoreDb;
};

/**
 * Initialize analytics - call this after page is fully loaded
 */
export const initAnalytics = async () => {
  try {
    const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
    if (measurementId) {
      const app = await getFirebaseApp();
      const { getAnalytics } = await import('firebase/analytics');
      return getAnalytics(app);
    }
  } catch (e) {
    // Analytics failed, not critical
  }
  return null;
};

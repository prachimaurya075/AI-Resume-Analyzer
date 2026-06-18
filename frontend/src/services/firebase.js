import { getApps, initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId);

// Helpful debug for misconfigured envs (no secrets printed)
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.log('[firebase] env presence:', {
    apiKey: Boolean(firebaseConfig.apiKey),
    authDomain: Boolean(firebaseConfig.authDomain),
    projectId: Boolean(firebaseConfig.projectId),
    appId: Boolean(firebaseConfig.appId),
  });
}

let firebaseAuth = null;
let googleProvider = null;


if (isFirebaseConfigured) {
  try {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    // If Firebase fails to initialize (invalid API key, bad config), warn and continue without Firebase.
    // This prevents a hard crash / white screen in development.
    // User should fix or remove VITE_FIREBASE_* env vars.
    // eslint-disable-next-line no-console
    console.warn('Firebase initialization failed — continuing without Firebase auth.', err);
    firebaseAuth = null;
    googleProvider = null;
  }
}

export { firebaseAuth, googleProvider };
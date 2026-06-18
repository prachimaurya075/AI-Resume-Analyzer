import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import api from './api';
import { firebaseAuth, googleProvider, isFirebaseConfigured } from './firebase';

const AUTH_MODE_KEY = 'ai-resume-auth-mode';

const exchangeFirebaseToken = (idToken) => api.post('/auth/firebase', { idToken }).then((res) => res.data);

const exchangeLocalCredentials = (endpoint, payload) =>
  api.post(endpoint, payload).then((res) => {
    localStorage.setItem(AUTH_MODE_KEY, 'local');
    return res.data;
  });

const setAuthMode = (mode) => {
  if (mode) {
    localStorage.setItem(AUTH_MODE_KEY, mode);
  } else {
    localStorage.removeItem(AUTH_MODE_KEY);
  }
};

const requireFirebase = () => {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Set the VITE_FIREBASE_* variables first.');
  }

  if (!firebaseAuth) {
    throw new Error('Firebase auth is unavailable. Check firebase initialization errors in frontend/src/services/firebase.js');
  }

  if (!googleProvider) {
    throw new Error('Google provider is unavailable. Check firebase initialization in frontend/src/services/firebase.js');
  }
};

export const authApi = {
  exchangeFirebaseToken,
  signup: async ({ name, email, password }) => {
    const preferredMode = localStorage.getItem(AUTH_MODE_KEY);

    if (preferredMode === 'local') {
      return exchangeLocalCredentials('/auth/signup', { name, email, password });
    }

    requireFirebase();

    try {
      const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await updateProfile(credentials.user, { displayName: name });
      const idToken = await credentials.user.getIdToken();
      const data = await exchangeFirebaseToken(idToken);
      setAuthMode('firebase');
      return data;
    } catch (error) {
      if (error?.response?.status === 503) {
        setAuthMode('local');
        return exchangeLocalCredentials('/auth/signup', { name, email, password });
      }

      throw error;
    }
  },
  login: async ({ email, password }) => {
    const preferredMode = localStorage.getItem(AUTH_MODE_KEY);

    if (preferredMode === 'local') {
      return exchangeLocalCredentials('/auth/login', { email, password });
    }

    requireFirebase();

    try {
      const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
      const idToken = await credentials.user.getIdToken();
      const data = await exchangeFirebaseToken(idToken);
      setAuthMode('firebase');
      return data;
    } catch (error) {
      if (error?.response?.status === 503) {
        setAuthMode('local');
        return exchangeLocalCredentials('/auth/login', { email, password });
      }

      throw error;
    }
  },
  googleLogin: async () => {
    if (localStorage.getItem(AUTH_MODE_KEY) === 'local') {
      throw new Error('Google sign-in is unavailable in local auth mode. Use email and password instead.');
    }

    requireFirebase();
    const credentials = await signInWithPopup(firebaseAuth, googleProvider);
    const idToken = await credentials.user.getIdToken();
    const data = await exchangeFirebaseToken(idToken);
    setAuthMode('firebase');
    return data;
  },
  me: () => api.get('/auth/me').then((res) => res.data),
  logout: () => {
    setAuthMode(null);
    return firebaseAuth ? signOut(firebaseAuth) : Promise.resolve();
  },
};
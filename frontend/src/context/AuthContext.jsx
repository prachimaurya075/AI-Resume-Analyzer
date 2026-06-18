import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { authApi } from '../services/auth';
import { firebaseAuth, isFirebaseConfigured } from '../services/firebase';

const AUTH_MODE_KEY = 'ai-resume-auth-mode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('ai-resume-user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('ai-resume-token') || '');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (user) {
      localStorage.setItem('ai-resume-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ai-resume-user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('ai-resume-token', token);
    } else {
      localStorage.removeItem('ai-resume-token');
    }
  }, [token]);

  useEffect(() => {
    let unsubscribe;
    const preferredMode = localStorage.getItem(AUTH_MODE_KEY);

    const runFallbackHydrate = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }

      try {
        const data = await authApi.me();
        setUser(data.user);
      } catch (_error) {
        setUser(null);
        setToken('');
      } finally {
        setInitializing(false);
      }
    };

    if (preferredMode !== 'local' && isFirebaseConfigured && firebaseAuth) {
      unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            const idToken = await firebaseUser.getIdToken();
            const data = await authApi.exchangeFirebaseToken(idToken);
            localStorage.setItem(AUTH_MODE_KEY, 'firebase');
            setUser(data.user);
            setToken(data.token);
            return;
          }

          if (token) {
            const data = await authApi.me();
            setUser(data.user);
            return;
          }

          setUser(null);
          setToken('');
        } catch (error) {
          if (error?.response?.status === 503 || localStorage.getItem(AUTH_MODE_KEY) === 'local') {
            try {
              const storedToken = localStorage.getItem('ai-resume-token') || token;
              const data = await authApi.me();
              setUser(data.user);
              setToken(storedToken);
              return;
            } catch (_localError) {
              setUser(null);
              setToken('');
            }
          } else {
            setUser(null);
            setToken('');
          }
        } finally {
          setInitializing(false);
        }
      });
    } else {
      runFallbackHydrate();
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      initializing,
      isAuthenticated: Boolean(token && user),
      async login(payload) {
        const data = await authApi.login(payload);
        setUser(data.user);
        setToken(data.token);
        return data;
      },
      async signup(payload) {
        const data = await authApi.signup(payload);
        setUser(data.user);
        setToken(data.token);
        return data;
      },
      async googleLogin() {
        const data = await authApi.googleLogin();
        setUser(data.user);
        setToken(data.token);
        return data;
      },
      logout() {
        authApi.logout().finally(() => {
          setUser(null);
          setToken('');
        });
      },
    }),
    [user, token, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
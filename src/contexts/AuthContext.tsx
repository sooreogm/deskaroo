import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  AuthSession,
  AuthUser,
  getCurrentAuthSession,
  getCurrentAuthUser,
  refreshAuthSession,
  restoreAuthSession,
  signInUser,
  signOutUser,
  signUpUser,
} from '@/utils/users';

interface Session extends AuthSession {
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const syncAuthState = (nextUser: AuthUser | null, nextSession: AuthSession | null = nextUser ? getCurrentAuthSession() : null) => {
    setUser(nextUser);
    setSession(nextUser && nextSession ? { user: nextUser, ...nextSession } : null);
    setIsAdmin(nextUser?.role === 'admin');
  };

  useEffect(() => {
    let cancelled = false;

    syncAuthState(getCurrentAuthUser(), getCurrentAuthSession());

    const initializeAuth = async () => {
      const { user: restoredUser } = await restoreAuthSession();

      if (cancelled) {
        return;
      }

      syncAuthState(restoredUser, getCurrentAuthSession());
      setLoading(false);
    };

    void initializeAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!session?.expires_at) {
      return;
    }

    const expiresAt = Date.parse(session.expires_at);
    if (Number.isNaN(expiresAt)) {
      return;
    }

    const refreshDelay = Math.max(expiresAt - Date.now() - 60 * 1000, 0);
    let cancelled = false;

    const timeoutId = window.setTimeout(async () => {
      const { user: refreshedUser } = await refreshAuthSession();

      if (cancelled) {
        return;
      }

      syncAuthState(refreshedUser, getCurrentAuthSession());
    }, refreshDelay);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [session?.expires_at]);

  const signUp = async (email: string, password: string, name: string) => {
    const { error } = await signUpUser(email, password, name);
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { user: nextUser, error } = await signInUser(email, password);
    if (!error) {
      syncAuthState(nextUser, getCurrentAuthSession());
    }
    return { error };
  };

  const signOut = async () => {
    await signOutUser();
    syncAuthState(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: string | null; data?: any }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('Auth state changed:', _event, newSession?.user?.email);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      console.log('Sign up response:', { data, error });
      
      if (error) {
        return { error: error.message };
      }
      
      // Check if email confirmation is required
      if (data.user && !data.session) {
        return { error: 'Please check your email to confirm your account', data };
      }
      
      return { error: null, data };
    } catch (err) {
      console.error('Sign up error:', err);
      return { error: 'An unexpected error occurred during registration' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log('Sign in response:', JSON.stringify({ data, error }, null, 2));
      
      if (error) {
        return { error: error.message };
      }
      
      if (!data.session) {
        return { error: 'No session returned. Please check if email confirmation is required.' };
      }
      
      // Manually update session state
      setSession(data.session);
      setUser(data.user);
      
      return { error: null };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: 'An unexpected error occurred during sign in' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

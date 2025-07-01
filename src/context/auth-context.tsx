"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfigErrorBanner } from '@/components/config-error-banner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // If Firebase is not configured, show a helpful error page and stop.
  if (!isFirebaseConfigured) {
    return <ConfigErrorBanner />;
  }

  useEffect(() => {
    // We can safely assume auth is not null here because of the check above.
    const unsubscribe = onAuthStateChanged(auth!, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {loading ? (
        <div className="flex min-h-screen items-center justify-center p-4">
            <div className="w-full max-w-sm space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

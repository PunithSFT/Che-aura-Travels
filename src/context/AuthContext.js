// src/context/AuthContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

// We import SessionProvider separately to avoid Turbopack crash
import { SessionProvider, signOut, useSession } from 'next-auth/react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  return (
    // SessionProvider enables Google login / session everywhere
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <CustomAuthProvider>{children}</CustomAuthProvider>
    </SessionProvider>
  );
}

// Inner provider — your custom logic lives here
function CustomAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchUser = async () => {
    console.log('fetchUser called - fetching from /api/auth/me');
    try {
      // Add timestamp to bypass cache
      const res = await fetch(`/api/auth/me?t=${Date.now()}`, {
        credentials: 'include',
        cache: 'no-store',
      });

      console.log('fetchUser response status:', res.status);

      if (!res.ok) {
        console.warn('fetchUser failed - status:', res.status);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('fetchUser received user:', data.user ? 'yes' : 'no');
      setUser(data.user || null);
    } catch (err) {
      console.error('fetchUser error:', err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Sync session state with custom user state
  useEffect(() => {
    if (status === 'authenticated' || status === 'unauthenticated') {
      fetchUser();
    }
  }, [status, session]);

  const login = async (email, password) => {
    console.log('login called');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Login failed');
    }

    setUser(data.user);
    console.log('login - refetching user');
    await fetchUser();
    return { success: true, user: data.user };
  };

  const signup = async (name, email, password) => {
    console.log('signup called');
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include',
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Signup failed');
    }

    setUser(data.user);
    console.log('signup - refetching user');
    await fetchUser();
    return { success: true, user: data.user };
  };

  const logout = async () => {
    try {
      // 1. Sign out from NextAuth (if logged in with Google)
      await signOut({ redirect: false });

      // 2. Call your server logout endpoint
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error('Logout failed on server');
      }

      // Clear client state
      setUser(null);

      // Redirect to home or login
      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      // Fallback: clear cookie manually
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      setUser(null);
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refetchUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
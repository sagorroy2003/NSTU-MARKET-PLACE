"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { ApiClientError, apiRequest } from "@/lib/api";

type User = {
  userId: number;
  email: string;
};

type AuthResponse = {
  user: {
    id?: number;
    userId?: number;
    email: string;
  };
  token: string;
};

type AuthContextValue = {
  user: User | null;
  token: string | null; // kept for UI (optional)
  loading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeUser(input: { id?: number; userId?: number; email: string }): User {
  return {
    userId: Number(input.userId ?? input.id),
    email: input.email,
  };
}

function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshMeInternal() {
    try {
      const me = await apiRequest<{ user: { userId?: number; id?: number; email: string } }>("/auth/me");
      setUser(normalizeUser(me.user));
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        if (typeof window !== "undefined") localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const stored = getStoredToken();

    if (!stored) {
      setLoading(false);
      return;
    }

    // Keep context token in sync with storage (UI convenience)
    setToken(stored);
    void refreshMeInternal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function signup(email: string, password: string) {
    setLoading(true);
    const response = await apiRequest<AuthResponse>("/auth/signup", {
      method: "POST",
      body: { email, password },
    });

    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser(normalizeUser(response.user));
    setLoading(false);
  }

  async function login(email: string, password: string) {
    setLoading(true);
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email, password },
    });

    localStorage.setItem("token", response.token);
    setToken(response.token);
    setUser(normalizeUser(response.user));
    setLoading(false);
  }

  function logout() {
    if (typeof window !== "undefined") localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  async function refreshMe() {
    setLoading(true);
    setToken(getStoredToken());
    await refreshMeInternal();
  }

  const value = useMemo(
    () => ({ user, token, loading, signup, login, logout, refreshMe }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}

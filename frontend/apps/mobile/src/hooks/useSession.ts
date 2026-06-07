import { useCallback, useEffect, useState } from "react";

import type { SeedUser } from "../api/types";

const STORAGE_KEY = "swebook.session";

type StoredSession = {
  userId: number;
  nickname: string;
  email: string;
};

function readSession(): StoredSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredSession;
    if (!parsed.userId || !parsed.nickname) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function useSession() {
  const [session, setSession] = useState<StoredSession | null>(() => readSession());

  useEffect(() => {
    setSession(readSession());
  }, []);

  const login = useCallback((user: SeedUser) => {
    const nextSession: StoredSession = {
      userId: user.userId,
      nickname: user.nickname,
      email: user.email,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
  }, []);

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  }, []);

  return {
    session,
    login,
    logout,
  };
}

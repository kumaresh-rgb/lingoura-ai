function isClient(): boolean {
  return typeof window !== 'undefined';
}

export const storageService = {
  get<T>(key: string): T | null {
    if (!isClient()) return null;
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch {
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isClient()) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or private mode — fail silently
    }
  },

  remove(key: string): void {
    if (!isClient()) return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (!isClient()) return;
    localStorage.clear();
  },

  session: {
    get<T>(key: string): T | null {
      if (!isClient()) return null;
      try {
        const item = sessionStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null;
      } catch {
        return null;
      }
    },

    set<T>(key: string, value: T): void {
      if (!isClient()) return;
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
      } catch {
        // Fail silently
      }
    },

    remove(key: string): void {
      if (!isClient()) return;
      sessionStorage.removeItem(key);
    },
  },
};

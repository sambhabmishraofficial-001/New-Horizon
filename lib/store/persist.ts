"use client";

import * as React from "react";

const subscribers = new Map<string, Set<() => void>>();

function notify(key: string) {
  const set = subscribers.get(key);
  if (!set) return;
  for (const cb of set) cb();
}

export function getJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    notify(key);
  } catch {
    /* quota / serialize errors are non-fatal in mock mode */
  }
}

export function removeKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(key);
    notify(key);
  } catch {
    /* ignore */
  }
}

export function subscribe(key: string, cb: () => void): () => void {
  let set = subscribers.get(key);
  if (!set) {
    set = new Set();
    subscribers.set(key, set);
  }
  set.add(cb);
  return () => {
    set!.delete(cb);
    if (set!.size === 0) subscribers.delete(key);
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key) notify(e.key);
  });
}

export function usePersistent<T>(
  key: string,
  fallback: T
): [T, (next: T | ((prev: T) => T)) => void] {
  const [value, setValue] = React.useState<T>(fallback);

  React.useEffect(() => {
    setValue(getJSON<T>(key, fallback));
    const unsub = subscribe(key, () => setValue(getJSON<T>(key, fallback)));
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        setJSON(key, resolved);
        return resolved;
      });
    },
    [key]
  );

  return [value, update];
}

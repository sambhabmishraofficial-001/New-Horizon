"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

/** Avoid hydration mismatch: query params are unavailable during static export SSR. */
export function useClientSearchParamsReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return ready;
}

export function useClientQueryParam(key: string): string | null {
  const params = useSearchParams();
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    setValue(params?.get(key) ?? null);
  }, [params, key]);

  return value;
}

export function useClientQueryFlag(key: string, expected = "1"): boolean {
  const value = useClientQueryParam(key);
  return value === expected;
}

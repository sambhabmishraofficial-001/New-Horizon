"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/store/auth";

export default function SignupIndex() {
  const router = useRouter();
  React.useEffect(() => {
    if (getCurrentUser()) {
      router.replace("/signup/you");
    } else {
      router.replace("/signup/account");
    }
  }, [router]);

  return <div className="min-h-screen bg-parchment-50" />;
}

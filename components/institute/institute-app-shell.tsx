"use client";

import * as React from "react";

const InstituteAppShellContext = React.createContext(false);

export function InstituteAppShellProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InstituteAppShellContext.Provider value={true}>
      {children}
    </InstituteAppShellContext.Provider>
  );
}

export function useInstituteAppShell(): boolean {
  return React.useContext(InstituteAppShellContext);
}

function readEmbeddedPreview(): boolean {
  if (typeof window === "undefined") return false;
  return window.self !== window.top;
}

/** Standalone full chrome only for product iframe previews of /ire and /lattice. */
export function useStandaloneInstituteChrome(pathname: string): boolean {
  const n = pathname.replace(/\/+$/, "") || "/";
  const workspacePath =
    n === "/ire" || n === "/workspace" || n === "/lattice";
  const [embedded, setEmbedded] = React.useState(false);

  React.useEffect(() => {
    setEmbedded(readEmbeddedPreview());
  }, []);

  return workspacePath && embedded;
}

"use client";

import { useEffect, useState } from "react";

function WindowsLogo() {
  return (
    <svg viewBox="0 0 24 24" className="retro-win-taskbar__logo" aria-hidden>
      <path fill="#0078d4" d="M3 5.5 10.5 4.3V11H3V5.5Z" />
      <path fill="#0078d4" d="M11.5 4.1 21 2.5V11h-9.5V4.1Z" />
      <path fill="#0078d4" d="M3 12.5h7.5V19.7L3 18.5V12.5Z" />
      <path fill="#0078d4" d="M11.5 12.5H21v8.5l-9.5-1.6V12.5Z" />
    </svg>
  );
}

export function RetroWindowsTaskbar() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const time = now
    ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false })
    : "02:04";
  const date = now
    ? now.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "-")
    : "27-05-2026";

  return (
    <div className="retro-win-taskbar" aria-label="Taskbar">
      <div className="retro-win-taskbar__left">
        <button type="button" className="retro-win-taskbar__weather" aria-label="Weather">
          <span className="retro-win-taskbar__weather-icon" aria-hidden>
            <svg viewBox="0 0 24 24">
              <circle cx="8" cy="9" r="3.5" fill="#fbbf24" />
              <path
                d="M6 14h10a4 4 0 0 0 .2-8 5.5 5.5 0 0 0-10.6 1.8A3.2 3.2 0 0 0 6 14Z"
                fill="#94a3b8"
              />
            </svg>
          </span>
          <span className="retro-win-taskbar__weather-badge">1</span>
        </button>
      </div>

      <div className="retro-win-taskbar__center">
        <button type="button" className="retro-win-taskbar__start" aria-label="Start">
          <WindowsLogo />
        </button>

        <button type="button" className="retro-win-taskbar__search" aria-label="Search">
          <svg viewBox="0 0 24 24" className="retro-win-taskbar__search-icon" aria-hidden>
            <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16.5 16.5 4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <span>Search</span>
          <span className="retro-win-taskbar__search-seal" aria-hidden>
            🦭
          </span>
        </button>
      </div>

      <div className="retro-win-taskbar__tray">
        <button type="button" className="retro-win-taskbar__tray-btn" aria-label="Show hidden icons">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <span className="retro-win-taskbar__tray-text">ENG IN</span>
        <span className="retro-win-taskbar__tray-icon" aria-hidden>
          <svg viewBox="0 0 24 24">
            <path d="M5 10v4h2l4 3V7L7 10H5Z" fill="currentColor" />
          </svg>
        </span>
        <span className="retro-win-taskbar__battery" aria-hidden>
          <svg viewBox="0 0 28 14">
            <rect x="1" y="2" width="22" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <rect x="24" y="5" width="2.5" height="4" rx="0.8" fill="currentColor" />
            <rect x="2.5" y="3.5" width="13" height="7" rx="1.2" fill="#facc15" />
          </svg>
          <span>60%</span>
        </span>
        <button type="button" className="retro-win-taskbar__clock" aria-label={`${time}, ${date}`}>
          <span>{time}</span>
          <span>{date}</span>
        </button>
      </div>
    </div>
  );
}

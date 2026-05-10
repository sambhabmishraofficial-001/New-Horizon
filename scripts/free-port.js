/**
 * Stop whichever process is LISTENING on the given TCP port (Windows + Unix).
 * Usage: node scripts/free-port.js [port]
 */
const { execSync } = require("child_process");
const os = require("os");

const port = process.argv[2] || "4000";

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function winListeningPids() {
  let out;
  try {
    out = execSync("netstat -ano", { encoding: "utf8" });
  } catch {
    return [];
  }
  const pids = new Set();
  for (const line of out.split("\n")) {
    if (!line.includes("LISTENING")) continue;
    if (!line.includes(`:${port}`)) continue;
    const parts = line.trim().split(/\s+/);
    const pid = parts[parts.length - 1];
    if (/^\d+$/.test(pid) && pid !== "0") pids.add(pid);
  }
  return [...pids];
}

function winFree() {
  for (const pid of winListeningPids()) {
    try {
      execSync(`taskkill /F /PID ${pid}`, { stdio: "inherit" });
    } catch {
      /* ignore */
    }
  }
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (winListeningPids().length === 0) return;
    sleep(250);
  }
}

function unixFree() {
  let out = "";
  try {
    out = execSync(`lsof -tiTCP:${port} -sTCP:LISTEN`, { encoding: "utf8" });
  } catch {
    return;
  }
  const pids = out
    .trim()
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s));
  for (const pid of pids) {
    try {
      execSync(`kill -9 ${pid}`, { stdio: "ignore" });
    } catch {
      /* ignore */
    }
  }
  sleep(500);
}

if (os.platform() === "win32") winFree();
else unixFree();

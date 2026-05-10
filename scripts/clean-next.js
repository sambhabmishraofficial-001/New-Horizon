const fs = require("fs");
const path = require("path");

const nextDir = path.join(process.cwd(), ".next");
const staleRoot = path.join(process.cwd(), ".next-stale");

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

let lastError;
for (let attempt = 1; attempt <= 20; attempt += 1) {
  try {
    fs.rmSync(nextDir, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 300,
    });
    console.log("Removed .next cache");
    process.exit(0);
  } catch (error) {
    lastError = error;
    sleep(400);
  }
}

try {
  fs.mkdirSync(staleRoot, { recursive: true });
  const staleDir = path.join(staleRoot, String(Date.now()));
  fs.renameSync(nextDir, staleDir);
  console.log(`Moved locked .next cache to ${path.relative(process.cwd(), staleDir)}`);
  process.exit(0);
} catch (error) {
  lastError = error;
}

console.warn("Could not remove .next cache:", lastError?.message ?? "unknown error");

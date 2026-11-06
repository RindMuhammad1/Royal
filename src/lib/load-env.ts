// Loads `.env` into process.env on the server. Call loadEnv() explicitly — package.json
// has "sideEffects": false, so a bare side-effect import would be tree-shaken away.
//
// The production build (Nitro node-server) does NOT read `.env` on its own, so on
// shared hosting (cPanel / LiteSpeed / Passenger) none of DB_*, ADMIN_JWT_SECRET,
// etc. were reaching the app unless they were set in the cPanel "Environment
// variables" UI. Variables already present in the environment always win.
import fs from "node:fs";
import path from "node:path";

function parseEnv(content: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).replace(/^export\s+/, "").trim();
    let value = line.slice(eq + 1).trim();
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.endsWith(quote) && value.length >= 2) {
      value = value.slice(1, -1);
      if (quote === '"') value = value.replace(/\\n/g, "\n");
    } else {
      const hash = value.indexOf(" #");
      if (hash !== -1) value = value.slice(0, hash).trim();
    }
    if (key) out[key] = value;
  }
  return out;
}

export function loadEnv() {
  const g = globalThis as { __royalEnvLoaded?: boolean };
  if (g.__royalEnvLoaded) return;
  g.__royalEnvLoaded = true;

  const candidates = new Set<string>();
  candidates.add(path.resolve(process.cwd(), ".env"));
  if (process.argv[1]) {
    const entryDir = path.dirname(path.resolve(process.argv[1]));
    candidates.add(path.join(entryDir, ".env"));
    candidates.add(path.join(entryDir, "..", ".env"));
    candidates.add(path.join(entryDir, "..", "..", ".env"));
  }

  for (const file of candidates) {
    try {
      if (!fs.existsSync(file)) continue;
      const parsed = parseEnv(fs.readFileSync(file, "utf8"));
      for (const [k, v] of Object.entries(parsed)) {
        if (process.env[k] === undefined) process.env[k] = v;
      }
      return;
    } catch {
      // try next candidate
    }
  }
}


import { readFileSync, writeFileSync, existsSync, rmSync, mkdirSync, cpSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";

const rootDir = process.cwd();
const deployDir = resolve(rootDir, ".deploy_temp");
const zipPath = resolve(rootDir, "deploy.zip");

console.log("\n📦 [Deploy Packager] Preparing LiteSpeed / cPanel production package...");

try {
  // 1. Clean previous temp dir
  if (existsSync(deployDir)) {
    rmSync(deployDir, { recursive: true, force: true });
  }
  mkdirSync(deployDir, { recursive: true });

  // 2. Copy .output/
  if (!existsSync(resolve(rootDir, ".output"))) {
    console.error("❌ Error: .output directory not found! Run vite build first.");
    process.exit(1);
  }
  cpSync(resolve(rootDir, ".output"), resolve(deployDir, ".output"), { recursive: true });

  // 3. Create production package.json with "type": "commonjs" (Prevents LiteSpeed ERR_REQUIRE_ESM)
  const pkg = JSON.parse(readFileSync(resolve(rootDir, "package.json"), "utf8"));
  const prodPkg = {
    name: pkg.name || "royal-chauffeur",
    version: pkg.version || "1.0.0",
    private: true,
    type: "commonjs", // Critical for LiteSpeed lsnode.js / cPanel Passenger
    main: "app.js",
    scripts: {
      start: "node app.js"
    }
  };
  writeFileSync(resolve(deployDir, "package.json"), JSON.stringify(prodPkg, null, 2), "utf8");

  // 4. Create robust CommonJS app.js entry point with LiteSpeed stdin patch
  const appJsContent = `// ============================================================================
// HosterPK / LiteSpeed / cPanel Production Entry Point
// ============================================================================

// LiteSpeed FastCGI (lsnode.js) occupies file descriptor 0.
// Under Node 18, ESM bootstrap tries to open fd 0 for stdin and crashes with EEXIST.
// Pre-defining process.stdin with a dummy Readable prevents uv_pipe_open(0) collision.
try {
  const { Readable } = require("node:stream");
  const dummy = new Readable({ read() {} });
  Object.defineProperty(process, "stdin", {
    value: dummy,
    configurable: true,
    writable: true,
  });
  if (typeof process.getStdin === "function") {
    process.getStdin = () => dummy;
  }
} catch {
  // Silent fallback
}

// Node 18 has no global Web Crypto (needed for login tokens) - provide it.
try {
  if (!globalThis.crypto) {
    Object.defineProperty(globalThis, "crypto", {
      value: require("node:crypto").webcrypto,
      configurable: true,
      writable: true,
    });
  }
} catch {
  // ignore
}

process.env.NODE_ENV = process.env.NODE_ENV || "production";

import("./.output/server/index.mjs").catch((err) => {
  console.error("Failed to start application via app.js:", err);
  process.exit(1);
});
`;
  writeFileSync(resolve(deployDir, "app.js"), appJsContent, "utf8");

  // 5. Also provide app.cjs for environments that prefer explicit .cjs extension
  writeFileSync(resolve(deployDir, "app.cjs"), appJsContent, "utf8");

  // 6. Copy .env if exists
  if (existsSync(resolve(rootDir, ".env"))) {
    cpSync(resolve(rootDir, ".env"), resolve(deployDir, ".env"));
  }

  // 7. Copy drizzle/ schema & seeds
  if (existsSync(resolve(rootDir, "drizzle"))) {
    cpSync(resolve(rootDir, "drizzle"), resolve(deployDir, "drizzle"), { recursive: true });
  }

  // 8. Copy public/ folder & ensure public/uploads/blog exists
  if (existsSync(resolve(rootDir, "public"))) {
    cpSync(resolve(rootDir, "public"), resolve(deployDir, "public"), { recursive: true });
  }
  mkdirSync(resolve(deployDir, "public/uploads/blog"), { recursive: true });

  // 8b. Passenger restart trigger (cPanel restarts the app when this file changes)
  mkdirSync(resolve(deployDir, "tmp"), { recursive: true });
  writeFileSync(resolve(deployDir, "tmp/restart.txt"), new Date().toISOString(), "utf8");

  // 9. Zip everything inside .deploy_temp into deploy.zip
  if (existsSync(zipPath)) {
    rmSync(zipPath, { force: true });
  }
  execSync(`cd "${deployDir}" && zip -q -r "${zipPath}" . *`, { stdio: "inherit" });

  // 10. Clean up temp folder
  rmSync(deployDir, { recursive: true, force: true });

  console.log("✅ [Deploy Packager] deploy.zip successfully generated!");
  console.log("   • Production package.json: type = commonjs (LiteSpeed-safe)");
  console.log("   • Entry points: app.js & app.cjs included");
  console.log("   • Full compiled assets & server bundled in .output/");
} catch (err) {
  console.error("❌ Failed to package deployment:", err);
  if (existsSync(deployDir)) {
    rmSync(deployDir, { recursive: true, force: true });
  }
  process.exit(1);
}


// ============================================================================
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

// Dynamically load the bundled Nitro server
import("./.output/server/index.mjs").catch((err) => {
  console.error("Failed to start application via app.js:", err);
  process.exit(1);
});

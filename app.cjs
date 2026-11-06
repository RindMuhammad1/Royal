// ============================================================================
// HosterPK / LiteSpeed / cPanel Production Entry Point (.cjs)
// ============================================================================

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
  console.error("Failed to start application via app.cjs:", err);
  process.exit(1);
});

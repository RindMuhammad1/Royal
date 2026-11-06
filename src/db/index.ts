import { loadEnv } from "../lib/load-env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

loadEnv();

// Global connection pool cache to prevent leaking connections during hot reloads
const globalForDb = globalThis as unknown as {
  pool: mysql.Pool | undefined;
};

function createConnectionPool(): mysql.Pool {
  // If individual connection parameters are provided, prioritize them (avoids URL encoding issues with special characters in passwords)
  if (process.env.DB_USER && process.env.DB_NAME) {
    return mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME,
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : undefined,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }

  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return mysql.createPool({
      uri: databaseUrl,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000,
    });
  }

  // No silent root@localhost fallback: make the misconfiguration obvious in the logs.
  console.error(
    "[MySQL Config Error] DB_USER/DB_NAME or DATABASE_URL not set. .env was not found or not loaded — check that .env sits next to app.js on the server."
  );
  return mysql.createPool({ host: "127.0.0.1", user: "__unconfigured__", database: "__unconfigured__", connectionLimit: 1 });
}

export const pool = globalForDb.pool ?? createConnectionPool();
globalForDb.pool = pool;

export const db = drizzle(pool, { schema, mode: "default" });

/**
 * Validates whether the MySQL database is currently reachable.
 */
export async function checkDbConnection(): Promise<{ ok: boolean; message?: string }> {
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    return { ok: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.warn(`[MySQL Connection Warning] Database not reachable: ${errorMsg}`);
    return {
      ok: false,
      message: `Database connection failed: ${errorMsg}. Please ensure MySQL is running and configured in .env`,
    };
  }
}


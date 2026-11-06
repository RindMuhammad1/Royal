import { migrate } from "drizzle-orm/mysql2/migrator";
import * as dotenv from "dotenv";
import { db, pool } from "./index";

dotenv.config();

async function runMigrations() {
  console.log("🚀 Starting database migrations...");
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed with error:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();


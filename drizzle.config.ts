import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials:
    process.env.DB_USER && process.env.DB_NAME
      ? {
          host: process.env.DB_HOST || "localhost",
          port: Number(process.env.DB_PORT) || 3306,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD || "",
          database: process.env.DB_NAME,
        }
      : {
          url:
            process.env.DATABASE_URL ||
            "mysql://root:@localhost:3306/royal_chauffeur",
        },
});


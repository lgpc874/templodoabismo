
import { defineConfig } from "drizzle-kit";

if (process.env.DATABASE_URL) {
  // PostgreSQL
  export default defineConfig({
    out: "./migrations",
    schema: "./shared/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
      url: process.env.DATABASE_URL,
    },
  });
} else {
  // SQLite
  export default defineConfig({
    out: "./migrations",
    schema: "./shared/schema.ts",
    dialect: "sqlite",
    dbCredentials: {
      url: "database.sqlite",
    },
  });
}

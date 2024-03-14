import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "./schemas",
  out: "./migrations",
  driver: "pg",
  dbCredentials: {
    host: process.env.DB_HOST!,
    database: process.env.DB_NAME!,
    port: Number(process.env.DB_PORT)!,
    user: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
  },
  verbose: true,
  strict: true,
});

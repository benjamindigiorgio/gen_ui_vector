import { type PostgresJsDatabase, drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Fix for "sorry, too many clients already"
declare global {
  // eslint-disable-next-line no-var -- only var works here
  var db: PostgresJsDatabase | undefined;
}
let db: PostgresJsDatabase;

const authDB = postgres({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});
if (process.env.NODE_ENV === "production") {
  db = drizzle(authDB);
} else {
  if (!global.db) {
    global.db = drizzle(authDB);
  }
  db = global.db;
}

export { db };

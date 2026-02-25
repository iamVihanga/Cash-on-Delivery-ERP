import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// Database instance
let db: NeonHttpDatabase<typeof schema> & {
  $client: NeonQueryFunction<false, false>;
};

export type Database = typeof db;

/**
 * Initialize the database connection
 * @param databaseUrl - Neon PostgreSQL connection string
 * @returns Initialized database instance
 */
export function initDatabase(databaseUrl: string) {
  if (db) {
    return db;
  }

  const sql = neon(databaseUrl);
  db = drizzle(sql, { schema });
  console.log("Database initialized with Neon (serverless)");

  return db;
}

/**
 * Get the database instance
 * @returns Initialized database instance
 * @throws Error if database not initialized
 */
export function getDatabase() {
  if (!db) {
    throw new Error("Database not initialized.");
  }

  return db;
}

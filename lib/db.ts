import mysql, { type Pool } from "mysql2/promise";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { dbConfig } = require("../db/config") as {
  dbConfig: (extra?: Record<string, unknown>) => mysql.PoolOptions;
};

const globalForDb = globalThis as unknown as { kaizenPool?: Pool };

export function getPool(): Pool {
  if (!globalForDb.kaizenPool) {
    globalForDb.kaizenPool = mysql.createPool(
      dbConfig({ connectionLimit: 8, waitForConnections: true }),
    );
  }
  return globalForDb.kaizenPool;
}

/** DATETIME (UTC, como string "YYYY-MM-DD HH:mm:ss.SSS") -> ISO 8601. */
export function toIso(value: string | Date): string {
  if (value instanceof Date) return value.toISOString();
  return new Date(`${value.replace(" ", "T")}Z`).toISOString();
}

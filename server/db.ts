
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import * as schema from "@shared/schema";

// Use SQLite como fallback se DATABASE_URL não estiver disponível
let db;

if (process.env.DATABASE_URL) {
  // Usar PostgreSQL se disponível
  try {
    const { Pool, neonConfig } = require('@neondatabase/serverless');
    const { drizzle: drizzleNeon } = require('drizzle-orm/neon-serverless');
    const ws = require("ws");
    
    neonConfig.webSocketConstructor = ws;
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzleNeon({ client: pool, schema });
  } catch (error) {
    console.log("Erro ao conectar PostgreSQL, usando SQLite local");
    const sqlite = new Database('database.sqlite');
    db = drizzle({ client: sqlite, schema });
  }
} else {
  // Usar SQLite como alternativa
  console.log("DATABASE_URL não encontrado, usando SQLite local");
  const sqlite = new Database('database.sqlite');
  db = drizzle({ client: sqlite, schema });
}

export { db };

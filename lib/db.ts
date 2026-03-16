import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";

const globalForDb = globalThis as typeof globalThis & {
  __pdfEditorSql?: ReturnType<typeof postgres>;
  __pdfEditorDb?: ReturnType<typeof drizzle>;
  __pdfEditorSchemaReady?: Promise<void>;
};

export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);

export function getSql() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!globalForDb.__pdfEditorSql) {
    globalForDb.__pdfEditorSql = postgres(process.env.DATABASE_URL, {
      prepare: false,
    });
  }

  return globalForDb.__pdfEditorSql;
}

export function getDb() {
  const sql = getSql();

  if (!sql) {
    return null;
  }

  if (!globalForDb.__pdfEditorDb) {
    globalForDb.__pdfEditorDb = drizzle(sql, {
      schema,
    });
  }

  return globalForDb.__pdfEditorDb;
}

export const db = getDb();
export const sql = getSql();

export async function ensureDatabaseSchema() {
  if (!sql) {
    return;
  }

  if (!globalForDb.__pdfEditorSchemaReady) {
    globalForDb.__pdfEditorSchemaReady = (async () => {
      await sql`
        create table if not exists "user" (
          "id" text primary key,
          "name" text not null,
          "email" text not null unique,
          "email_verified" timestamptz,
          "image" text,
          "password" text,
          "created_at" timestamptz not null default now()
        )
      `;

      await sql`
        create table if not exists "account" (
          "user_id" text not null references "user"("id") on delete cascade,
          "type" text not null,
          "provider" text not null,
          "provider_account_id" text not null,
          "refresh_token" text,
          "access_token" text,
          "expires_at" integer,
          "token_type" text,
          "scope" text,
          "id_token" text,
          "session_state" text,
          primary key ("provider", "provider_account_id")
        )
      `;

      await sql`
        create table if not exists "session" (
          "session_token" text primary key,
          "user_id" text not null references "user"("id") on delete cascade,
          "expires" timestamptz not null
        )
      `;

      await sql`
        create table if not exists "verification_token" (
          "identifier" text not null,
          "token" text not null,
          "expires" timestamptz not null,
          primary key ("identifier", "token")
        )
      `;

      await sql`
        create table if not exists "document" (
          "id" text primary key,
          "owner_id" text not null references "user"("id") on delete cascade,
          "name" text not null,
          "status" text not null default 'draft',
          "pages" integer not null default 1,
          "updated_at" timestamptz not null default now()
        )
      `;
    })();
  }

  await globalForDb.__pdfEditorSchemaReady;
}

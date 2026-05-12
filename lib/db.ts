import { randomUUID } from "crypto";
import { existsSync, mkdirSync } from "fs";
import { createRequire } from "module";
import { join } from "path";
import type {
  Conversation,
  CreateMessageInput,
  Message,
  MessageRole,
} from "@/lib/types";

type SqliteRunResult = {
  changes: number;
  lastInsertRowid: bigint | number;
};

type SqliteStatement<TRow = unknown> = {
  all(...params: unknown[]): TRow[];
  get(...params: unknown[]): TRow | undefined;
  run(...params: unknown[]): SqliteRunResult;
};

type SqliteDatabase = {
  exec(source: string): void;
  pragma(source: string): unknown;
  prepare<TRow = unknown>(source: string): SqliteStatement<TRow>;
};

type SqliteDatabaseConstructor = new (filename: string) => SqliteDatabase;

type ConversationRow = {
  created_at: string;
  id: string;
  title: string;
  updated_at: string;
};

type MessageRow = {
  content: string;
  conversation_id: string;
  created_at: string;
  id: string;
  role: MessageRole;
};

const nodeRequire = createRequire(import.meta.url);
const Database = nodeRequire("better-sqlite3") as SqliteDatabaseConstructor;

const DATA_DIRECTORY = join(process.cwd(), "data");

export const DATABASE_PATH = join(DATA_DIRECTORY, "sistema-jk.db");

let db: SqliteDatabase | null = null;

function ensureDataDirectory() {
  if (!existsSync(DATA_DIRECTORY)) {
    mkdirSync(DATA_DIRECTORY, { recursive: true });
  }
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeTitle(title?: string) {
  const normalizedTitle = title?.trim();

  return normalizedTitle || "Nova conversa";
}

function mapConversation(row: ConversationRow): Conversation {
  return {
    createdAt: row.created_at,
    id: row.id,
    title: row.title,
    updatedAt: row.updated_at,
  };
}

function mapMessage(row: MessageRow): Message {
  return {
    content: row.content,
    conversationId: row.conversation_id,
    createdAt: row.created_at,
    id: row.id,
    role: row.role,
  };
}

export function getDb() {
  ensureDataDirectory();

  if (!db) {
    db = new Database(DATABASE_PATH);
    db.pragma("foreign_keys = ON");
  }

  return db;
}

export function initializeDatabase() {
  const database = getDb();

  database.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_conversations_updated_at
      ON conversations(updated_at);

    CREATE INDEX IF NOT EXISTS idx_messages_conversation_id
      ON messages(conversation_id);
  `);

  return database;
}

export function createConversation(title?: string): Conversation {
  const database = initializeDatabase();
  const createdAt = nowIso();
  const conversation: Conversation = {
    createdAt,
    id: randomUUID(),
    title: normalizeTitle(title),
    updatedAt: createdAt,
  };

  database
    .prepare(
      `
        INSERT INTO conversations (id, title, created_at, updated_at)
        VALUES (?, ?, ?, ?)
      `,
    )
    .run(
      conversation.id,
      conversation.title,
      conversation.createdAt,
      conversation.updatedAt,
    );

  return conversation;
}

export function listConversations(): Conversation[] {
  const database = initializeDatabase();
  const rows = database
    .prepare<ConversationRow>(
      `
        SELECT id, title, created_at, updated_at
        FROM conversations
        ORDER BY updated_at DESC
      `,
    )
    .all();

  return rows.map(mapConversation);
}

export function getConversationById(id: string): Conversation | null {
  const database = initializeDatabase();
  const row = database
    .prepare<ConversationRow>(
      `
        SELECT id, title, created_at, updated_at
        FROM conversations
        WHERE id = ?
      `,
    )
    .get(id);

  return row ? mapConversation(row) : null;
}

export function updateConversationTitle(
  id: string,
  title: string,
): Conversation | null {
  const database = initializeDatabase();
  const updatedAt = nowIso();

  const result = database
    .prepare(
      `
        UPDATE conversations
        SET title = ?, updated_at = ?
        WHERE id = ?
      `,
    )
    .run(title.trim(), updatedAt, id);

  if (result.changes === 0) {
    return null;
  }

  return getConversationById(id);
}

export function deleteConversation(id: string): boolean {
  const database = initializeDatabase();
  const result = database
    .prepare(
      `
        DELETE FROM conversations
        WHERE id = ?
      `,
    )
    .run(id);

  return result.changes > 0;
}

export function listMessages(conversationId: string): Message[] {
  const database = initializeDatabase();
  const rows = database
    .prepare<MessageRow>(
      `
        SELECT id, conversation_id, role, content, created_at
        FROM messages
        WHERE conversation_id = ?
        ORDER BY created_at ASC
      `,
    )
    .all(conversationId);

  return rows.map(mapMessage);
}

export function createMessage(input: CreateMessageInput): Message {
  const database = initializeDatabase();
  const createdAt = input.createdAt ?? nowIso();
  const message: Message = {
    content: input.content,
    conversationId: input.conversationId,
    createdAt,
    id: randomUUID(),
    role: input.role,
  };

  database
    .prepare(
      `
        INSERT INTO messages (id, conversation_id, role, content, created_at)
        VALUES (?, ?, ?, ?, ?)
      `,
    )
    .run(
      message.id,
      message.conversationId,
      message.role,
      message.content,
      message.createdAt,
    );

  database
    .prepare(
      `
        UPDATE conversations
        SET updated_at = ?
        WHERE id = ?
      `,
    )
    .run(message.createdAt, message.conversationId);

  return message;
}

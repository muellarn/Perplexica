CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  createdAt TEXT NOT NULL
);
--> statement-breakpoint
ALTER TABLE chats ADD COLUMN userId TEXT NOT NULL DEFAULT '';

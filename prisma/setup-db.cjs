const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

const dbPath = path.join(process.cwd(), "prisma", "dev.db");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL UNIQUE,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "bio" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '',
    "joinedAt" DATETIME NOT NULL
  );

  CREATE TABLE IF NOT EXISTS "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    CONSTRAINT "Post_authorId_fkey"
      FOREIGN KEY ("authorId") REFERENCES "User" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    CONSTRAINT "Comment_postId_fkey"
      FOREIGN KEY ("postId") REFERENCES "Post" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT "Comment_authorId_fkey"
      FOREIGN KEY ("authorId") REFERENCES "User" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "likes" (
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("postId", "userId"),
    CONSTRAINT "likes_postId_fkey"
      FOREIGN KEY ("postId") REFERENCES "Post" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT "likes_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

  CREATE TABLE IF NOT EXISTS "Follow" (
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("followerId", "followingId"),
    CONSTRAINT "Follow_followerId_fkey"
      FOREIGN KEY ("followerId") REFERENCES "User" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE,
    CONSTRAINT "Follow_followingId_fkey"
      FOREIGN KEY ("followingId") REFERENCES "User" ("id")
      ON DELETE CASCADE
      ON UPDATE CASCADE
  );

  CREATE INDEX IF NOT EXISTS "Post_authorId_idx" ON "Post"("authorId");
  CREATE INDEX IF NOT EXISTS "Comment_postId_idx" ON "Comment"("postId");
  CREATE INDEX IF NOT EXISTS "Comment_authorId_idx" ON "Comment"("authorId");
  CREATE INDEX IF NOT EXISTS "likes_userId_idx" ON "likes"("userId");
  CREATE INDEX IF NOT EXISTS "Follow_followingId_idx" ON "Follow"("followingId");
`);

db.close();

console.log(`SQLite database is ready at ${dbPath}`);

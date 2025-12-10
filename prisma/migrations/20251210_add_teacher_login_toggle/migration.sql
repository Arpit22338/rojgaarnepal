-- Migration: Add Teacher Login Toggle Setting

CREATE TABLE "Setting" (
  "id" SERIAL PRIMARY KEY,
  "key" VARCHAR(100) UNIQUE NOT NULL,
  "value" VARCHAR(255) NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Insert default value for teacher login toggle
INSERT INTO "Setting" ("key", "value") VALUES ('showTeacherLogin', 'true');

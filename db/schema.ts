import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// Phase 1 tables (PLAN §4). Progress currently lives in localStorage on the
// client; this schema is the server-side home it migrates into once auth
// ships. Shapes mirror lib/progress.ts.

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const lessonProgress = pgTable("lesson_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  lessonId: text("lesson_id").notNull(), // e.g. m08-l06
  // Phase 2 hook: store attempts with timestamps, not just completion.
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  lessonId: text("lesson_id").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  answers: jsonb("answers"), // per-question picks, for miss-rate analytics by concept tag
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notes = pgTable("notes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  lessonId: text("lesson_id").notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Personal architecture map (M0): nodes and edges, one per user (or per product later).
export const maps = pgTable("maps", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull().default("My product"),
  graph: jsonb("graph").notNull(), // { nodes: [...], edges: [...], annotations: {...} }
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// D17 decision records (ADR-lite) the learner fills per decision.
export const decisionRecords = pgTable("decision_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  decisionId: text("decision_id").notNull(), // e.g. D01
  title: text("title").notNull(),
  context: text("context"),
  options: jsonb("options"),
  choice: text("choice"),
  revisitWhen: text("revisit_when"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Phase 2: scenario attempts, built in from day one per PLAN §5 hooks.
export const scenarioAttempts = pgTable("scenario_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  scenarioId: text("scenario_id").notNull(),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  submittedAt: timestamp("submitted_at"),
  passed: boolean("passed"),
  scoreBreakdown: jsonb("score_breakdown"), // { root_cause, stability, agent_verification, hints_used, time_to_diagnose }
  hintsUsed: integer("hints_used").notNull().default(0),
  agentTranscript: jsonb("agent_transcript"),
  diff: text("diff"),
});

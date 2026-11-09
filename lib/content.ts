import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { z } from "zod";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MODULES_DIR = path.join(CONTENT_DIR, "modules");

// ---------- schemas ----------

export const frontmatterSchema = z.object({
  id: z.string().regex(/^m\d{2}-l\d{2}$/, "id must look like m08-l06"),
  module: z.string().regex(/^M\d{1,2}$/),
  title: z.string().min(1),
  order: z.number().int().positive(),
  difficulty: z.number().int().min(1).max(3),
  depth: z.enum(["overview", "operator", "both"]),
  platforms: z.array(z.string()).default([]),
  concepts: z.array(z.string()).min(1),
  prerequisites: z.array(z.string()).default([]),
  lab: z.enum(["self", "demo-repo", "sandbox"]),
  scenario_ids: z.array(z.string()).default([]),
  estimated_minutes: z.number().int().positive(),
});

export type LessonFrontmatter = z.infer<typeof frontmatterSchema>;

export type Lesson = LessonFrontmatter & {
  slug: string;
  content: string;
};

export type ModuleMeta = {
  id: string;
  dir: string;
  title: string;
  tagline: string;
  wave: number;
};

// ---------- modules ----------

export function getModules(): ModuleMeta[] {
  const raw = fs.readFileSync(path.join(MODULES_DIR, "modules.yaml"), "utf8");
  const parsed = yaml.load(raw) as { modules: ModuleMeta[] };
  return parsed.modules;
}

export function getModule(id: string): ModuleMeta | undefined {
  return getModules().find((m) => m.id.toLowerCase() === id.toLowerCase());
}

// ---------- lessons ----------

function lessonFilesForModule(mod: ModuleMeta): string[] {
  const dir = path.join(MODULES_DIR, mod.dir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => path.join(dir, f));
}

function parseLessonFile(filePath: string): Lesson {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const fm = frontmatterSchema.parse(data);
  return { ...fm, slug: fm.id, content };
}

export function getLessonsForModule(moduleId: string): Lesson[] {
  const mod = getModule(moduleId);
  if (!mod) return [];
  return lessonFilesForModule(mod)
    .map(parseLessonFile)
    .sort((a, b) => a.order - b.order);
}

export function getAllLessons(): Lesson[] {
  return getModules().flatMap((mod) =>
    lessonFilesForModule(mod)
      .map(parseLessonFile)
      .sort((a, b) => a.order - b.order)
  );
}

export function getLessonById(id: string): Lesson | undefined {
  return getAllLessons().find((l) => l.id === id);
}

// ---------- glossary ----------

export type GlossaryTerm = { name: string; def: string };

export function getGlossary(): Record<string, GlossaryTerm> {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, "reference", "glossary.yaml"),
    "utf8"
  );
  const parsed = yaml.load(raw) as { terms: Record<string, GlossaryTerm> };
  return parsed.terms;
}

// ---------- concepts vocab ----------

export function getConceptVocab(): string[] {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, "_vocab", "concepts.yaml"),
    "utf8"
  );
  const parsed = yaml.load(raw) as { concepts: string[] };
  return parsed.concepts;
}

// ---------- reference pages ----------

export type CommandEntry = {
  cmd: string;
  does: string;
  example: string;
  note?: string;
};
export type CommandGroup = { title: string; commands: CommandEntry[] };

export function getCommandGroups(): CommandGroup[] {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, "reference", "commands.yaml"),
    "utf8"
  );
  return (yaml.load(raw) as { groups: CommandGroup[] }).groups;
}

export type StatusCode = {
  code: number;
  name: string;
  means: string;
  layer: string;
  causes: string[];
  confirm: string;
};
export type StatusFamily = { family: string; note: string; codes: StatusCode[] };

export function getStatusFamilies(): StatusFamily[] {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, "reference", "status-codes.yaml"),
    "utf8"
  );
  return (yaml.load(raw) as { families: StatusFamily[] }).families;
}

export type FailureEntry = {
  id: string;
  title: string;
  module: string;
  concepts: string[];
  symptom: string;
  causes: string[];
  confirm: string[];
  fix: string[];
};

export function getFailures(): FailureEntry[] {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, "reference", "failures.yaml"),
    "utf8"
  );
  return (yaml.load(raw) as { failures: FailureEntry[] }).failures;
}

export type CloudRow = {
  concept: string;
  what: string;
  aws: string;
  gcp: string;
  azure: string;
  paas: string;
};

export function getCloudRows(): CloudRow[] {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, "reference", "cloud-map.yaml"),
    "utf8"
  );
  return (yaml.load(raw) as { rows: CloudRow[] }).rows;
}

export type DecisionEntry = {
  id: string;
  title: string;
  question: string;
  options: string;
  default: string;
};

export function getDecisions(): DecisionEntry[] {
  const raw = fs.readFileSync(
    path.join(CONTENT_DIR, "decisions", "decisions.yaml"),
    "utf8"
  );
  return (yaml.load(raw) as { decisions: DecisionEntry[] }).decisions;
}

// ---------- scenarios (Phase 2 definitions, read-only in Phase 1) ----------

export type ScenarioSummary = {
  id: string;
  module: string;
  lesson?: string;
  title: string;
  difficulty: string;
  symptom: string;
  raw: string;
};

export function getScenarios(): ScenarioSummary[] {
  const dir = path.join(CONTENT_DIR, "scenarios");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".yaml") || f.endsWith(".yml"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      const d = yaml.load(raw) as Record<string, unknown>;
      return {
        id: String(d.id ?? f),
        module: String(d.module ?? ""),
        lesson: d.lesson ? String(d.lesson) : undefined,
        title: String(d.title ?? f),
        difficulty: String(d.difficulty ?? ""),
        symptom: String(d.symptom ?? ""),
        raw,
      };
    });
}

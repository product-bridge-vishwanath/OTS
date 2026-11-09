/**
 * Content lint (PLAN §4 acceptance criteria):
 *  - frontmatter validates against the schema
 *  - concept tags come from the controlled vocabulary
 *  - platform tags come from the controlled vocabulary (PLAN §8)
 *  - prerequisites point at lessons that exist
 *  - every referenced scenario_id has a definition in /content/scenarios
 *  - every lesson contains all 9 anatomy sections
 *
 * Run: npm run lint:content
 */
import {
  getAllLessons,
  getConceptVocab,
  getScenarios,
} from "../lib/content";

const PLATFORM_VOCAB = new Set([
  "vercel", "render", "railway", "fly", "supabase", "neon", "rds", "aws",
  "gcp", "azure", "cloudflare", "docker", "kubernetes", "postgres", "mysql",
  "mongodb", "redis", "upstash", "s3", "r2", "github-actions", "nginx",
  "caddy", "sentry", "datadog", "grafana", "kibana", "langfuse", "openai",
  "anthropic",
]);

const REQUIRED_SECTIONS = [
  "story",
  "already-did",
  "mental-model",
  "tools",
  "hands-on",
  "break-fix",
  "ask-agent",
  "checklist",
  "check",
];

const errors: string[] = [];

let lessons;
try {
  lessons = getAllLessons(); // throws on invalid frontmatter via zod
} catch (e) {
  console.error("✗ frontmatter failed validation:\n", e);
  process.exit(1);
}

const concepts = new Set(getConceptVocab());
const lessonIds = new Set(lessons.map((l) => l.id));
const scenarioIds = new Set(getScenarios().map((s) => s.id));

for (const l of lessons) {
  for (const c of l.concepts) {
    if (!concepts.has(c)) {
      errors.push(`${l.id}: concept "${c}" is not in _vocab/concepts.yaml`);
    }
  }
  for (const p of l.platforms) {
    if (!PLATFORM_VOCAB.has(p)) {
      errors.push(`${l.id}: platform "${p}" is not in the platform vocabulary`);
    }
  }
  for (const pre of l.prerequisites) {
    if (!lessonIds.has(pre)) {
      errors.push(`${l.id}: prerequisite "${pre}" does not exist`);
    }
  }
  for (const sc of l.scenario_ids) {
    if (!scenarioIds.has(sc)) {
      errors.push(`${l.id}: scenario "${sc}" has no definition in /content/scenarios`);
    }
  }
  for (const section of REQUIRED_SECTIONS) {
    if (!l.content.includes(`<Section kind="${section}"`)) {
      errors.push(`${l.id}: missing lesson section "${section}"`);
    }
  }
  const expectedModulePrefix = `m${l.module.slice(1).padStart(2, "0")}-`;
  if (!l.id.startsWith(expectedModulePrefix)) {
    errors.push(`${l.id}: id does not match module ${l.module}`);
  }
}

// duplicate ids / orders within a module
const seen = new Map<string, string>();
for (const l of lessons) {
  const key = `${l.module}#${l.order}`;
  if (seen.has(key)) {
    errors.push(`${l.id}: duplicate order ${l.order} in ${l.module} (also ${seen.get(key)})`);
  }
  seen.set(key, l.id);
}

if (errors.length) {
  console.error(`✗ content lint failed (${errors.length}):\n`);
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}

console.log(
  `✓ content lint passed: ${lessons.length} lesson(s), ${scenarioIds.size} scenario(s), ${concepts.size} concepts in vocab`
);

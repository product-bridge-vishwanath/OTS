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
  getCloudRows,
  getCommandGroups,
  getConceptVocab,
  getDecisions,
  getFailures,
  getGlossary,
  getModules,
  getScenarios,
  getStatusFamilies,
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

// ---- reference layer ----
const moduleIds = new Set(getModules().map((m) => m.id));

const failures = getFailures();
for (const f of failures) {
  if (!moduleIds.has(f.module)) {
    errors.push(`failure ${f.id}: module "${f.module}" does not exist`);
  }
  for (const c of f.concepts) {
    if (!concepts.has(c)) {
      errors.push(`failure ${f.id}: concept "${c}" is not in the vocabulary`);
    }
  }
  for (const [field, v] of Object.entries({
    symptom: f.symptom,
    causes: f.causes,
    confirm: f.confirm,
    fix: f.fix,
  })) {
    if (!v || (Array.isArray(v) && v.length === 0)) {
      errors.push(`failure ${f.id}: "${field}" is empty`);
    }
  }
}

const glossary = getGlossary();
for (const [k, t] of Object.entries(glossary)) {
  if (!t.name || !t.def) errors.push(`glossary "${k}": missing name or def`);
}

// Lessons may only hover-reference terms that exist.
const termKeys = new Set(Object.keys(glossary));
for (const l of lessons) {
  for (const m of l.content.matchAll(/<Term k="([^"]+)"/g)) {
    if (!termKeys.has(m[1])) {
      errors.push(`${l.id}: <Term k="${m[1]}"> has no glossary entry`);
    }
  }
}

const commands = getCommandGroups().reduce((n, g) => n + g.commands.length, 0);
const codes = getStatusFamilies().reduce((n, f) => n + f.codes.length, 0);
const cloudRows = getCloudRows().length;
const decisions = getDecisions().length;
if (decisions !== 17) errors.push(`decision library has ${decisions} entries, expected 17 (D1–D17)`);
if (failures.length < 25) errors.push(`failure catalogue has ${failures.length} entries, plan requires ~25`);

if (errors.length) {
  console.error(`✗ content lint failed (${errors.length}):\n`);
  for (const e of errors) console.error("  -", e);
  process.exit(1);
}

console.log(
  `✓ content lint passed: ${lessons.length} lesson(s), ${scenarioIds.size} scenario(s), ` +
    `${failures.length} failures, ${commands} commands, ${codes} status codes, ` +
    `${Object.keys(glossary).length} glossary terms, ${cloudRows} cloud rows, ${decisions} decisions`
);

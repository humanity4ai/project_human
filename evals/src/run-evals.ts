import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, normalize } from "node:path";
import { parse } from "yaml";
import { z } from "zod";

type EvalResult = {
  skill: string;
  pass: boolean;
  issues: string[];
};

// Valid taxonomy category slugs from knowledge-core/taxonomy.md
const VALID_CATEGORIES = new Set([
  "accessibility",
  "emotional-safety",
  "communication",
  "cognitive-support",
  "cultural-context",
  "conflict-navigation",
  "inclusive-design",
  "lifecycle-support",
  "neurodiversity",
  "age-inclusion"
]);

// Skills that must include escalation language in boundaries
const ESCALATION_REQUIRED_SKILLS = new Set([
  "supportive-conversation",
  "grief-loss-support",
  "depression-sensitive-content"
]);

const skillSpecSchema = z.object({
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Must be semver (e.g. 0.1.0)"),
  status: z.string().min(1),
  category: z.string().min(1),
  summary: z.string().min(1),
  boundaries: z.array(z.string()).min(1),
  actions: z
    .array(
      z.object({
        id: z.string().min(1),
        input_schema: z.string().min(1),
        output_schema: z.string().min(1)
      })
    )
    .min(1),
  uncertainty: z.object({
    confidence: z.enum(["low", "medium", "high"]),
    contested: z.boolean(),
    cultural_scope: z.enum(["global", "region", "community"])
  }),
  provenance: z.object({
    sources: z.array(z.string()).min(1),
    license: z.string().min(1)
  })
});

const REQUIRED_FILES = [
  "SKILL.md",
  "skill.yaml",
  "rubric.md",
  "CHANGELOG.md",
  "LICENSE",
  "scenarios/scenarios.yaml"
];

export { VALID_CATEGORIES, ESCALATION_REQUIRED_SKILLS, REQUIRED_FILES };
export type { EvalResult };

export function countScenarioIds(content: string): number {
  // Use yaml parser for accuracy rather than regex
  try {
    const doc = parse(content) as { scenarios?: unknown[] };
    return Array.isArray(doc?.scenarios) ? doc.scenarios.length : 0;
  } catch {
    // fallback: count top-level `- id:` entries
    const matches = content.match(/^  - id:/gm);
    return matches ? matches.length : 0;
  }
}

export function evaluateSkill(skillDir: string): EvalResult {
  const issues: string[] = [];
  const skillName = basename(skillDir);

  for (const relativePath of REQUIRED_FILES) {
    const fullPath = join(skillDir, relativePath);
    try {
      const stats = statSync(fullPath);
      if (!stats.isFile()) issues.push(`Missing file: ${relativePath}`);
    } catch {
      issues.push(`Missing file: ${relativePath}`);
    }
  }

  try {
    const scenariosContent = readFileSync(join(skillDir, "scenarios/scenarios.yaml"), "utf8");
    const scenarioCount = countScenarioIds(scenariosContent);
    if (scenarioCount < 10) {
      issues.push(`Scenario count too low: ${scenarioCount} (expected >= 10)`);
    }
  } catch {
    issues.push("Unable to read scenarios/scenarios.yaml");
  }

  try {
    const rubric = readFileSync(join(skillDir, "rubric.md"), "utf8");
    const requiredTerms = ["Helpfulness", "Humility", "Harm avoidance", "Clarity"];
    for (const term of requiredTerms) {
      if (!rubric.toLowerCase().includes(term.toLowerCase())) {
        issues.push(`Rubric missing dimension: ${term}`);
      }
    }
  } catch {
    issues.push("Unable to read rubric.md");
  }

  try {
    const rawSpec = readFileSync(join(skillDir, "skill.yaml"), "utf8");
    const parsedSpec = skillSpecSchema.safeParse(parse(rawSpec));
    if (!parsedSpec.success) {
      issues.push("Invalid skill.yaml structure");
      for (const issue of parsedSpec.error.issues) {
        issues.push(`  skill.yaml: ${issue.path.join(".") || "root"} — ${issue.message}`);
      }
    } else {
      const spec = parsedSpec.data;

      if (spec.name !== skillName) {
        issues.push(`Skill folder/name mismatch: folder='${skillName}' skill.yaml.name='${spec.name}'`);
      }

      if (!VALID_CATEGORIES.has(spec.category)) {
        issues.push(
          `Invalid category '${spec.category}'. Valid: ${[...VALID_CATEGORIES].join(", ")}`
        );
      }

      if (ESCALATION_REQUIRED_SKILLS.has(skillName)) {
        const boundaryText = spec.boundaries.join(" ").toLowerCase();
        if (!boundaryText.includes("escalat")) {
          issues.push(
            `Safety-critical skill '${skillName}' must include escalation guidance in boundaries`
          );
        }
      }
    }
  } catch {
    issues.push("Unable to parse skill.yaml");
  }

  return { skill: skillName, pass: issues.length === 0, issues };
}

export function evaluateContractConsistency(skillsRoot: string, repoRoot: string): EvalResult {
  const issues: string[] = [];

  const skillDirs = readdirSync(skillsRoot)
    .map((name: string) => join(skillsRoot, name))
    .filter((fullPath: string) => statSync(fullPath).isDirectory());

  for (const dir of skillDirs) {
    const folderName = basename(dir);
    let spec: z.infer<typeof skillSpecSchema>;

    try {
      const raw = readFileSync(join(dir, "skill.yaml"), "utf8");
      const result = skillSpecSchema.safeParse(parse(raw));
      if (!result.success) {
        issues.push(`Skipping '${folderName}' — skill.yaml failed schema validation`);
        continue;
      }
      spec = result.data;
    } catch {
      issues.push(`Skipping '${folderName}' — unable to read skill.yaml`);
      continue;
    }

    if (spec.name !== folderName) {
      issues.push(`Contract/folder mismatch: skill.yaml.name='${spec.name}' folder='${folderName}'`);
    }

    const action = spec.actions[0];
    if (!action) {
      issues.push(`No actions defined for skill '${spec.name}'`);
      continue;
    }

    // Validate that the schema files referenced in skill.yaml exist and are valid JSON
    for (const [label, relPath] of [
      ["input", action.input_schema],
      ["output", action.output_schema]
    ] as const) {
      const fullPath = normalize(join(dir, relPath));
      try {
        JSON.parse(readFileSync(fullPath, "utf8"));
      } catch {
        issues.push(`Invalid or missing JSON schema (${label}) for '${spec.name}': ${relPath}`);
      }
    }
  }

  return { skill: "contract-consistency", pass: issues.length === 0, issues };
}

export function writeMarkdownReport(results: EvalResult[], outputPath: string): void {
  const failures = results.filter((r) => !r.pass);
  const lines: string[] = [
    "# Eval Baseline Report",
    "",
    `**Date:** ${new Date().toISOString()}`,
    `**Skills checked:** ${results.length}`,
    `**Passed:** ${results.length - failures.length}`,
    `**Failed:** ${failures.length}`,
    ""
  ];

  lines.push("## Results");
  lines.push("");
  for (const result of results) {
    const icon = result.pass ? "PASS" : "FAIL";
    lines.push(`### ${icon} \`${result.skill}\``);
    if (!result.pass) {
      for (const issue of result.issues) {
        lines.push(`- ${issue}`);
      }
    }
    lines.push("");
  }

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, lines.join("\n"), "utf8");
}

function main(): void {
  // When run via `pnpm evals` from the evals/ package, cwd is the evals/ directory
  // When run from the repo root, cwd is the repo root
  const cwd = process.cwd();
  const repoRoot = basename(cwd) === "evals" ? join(cwd, "..") : cwd;
  const skillsRoot = join(repoRoot, "skills");
  const writeReport = process.env["EVAL_REPORT"] === "1";

  const skillDirs = readdirSync(skillsRoot)
    .map((name: string) => join(skillsRoot, name))
    .filter((fullPath: string) => statSync(fullPath).isDirectory());

  const results = skillDirs.map(evaluateSkill);
  results.push(evaluateContractConsistency(skillsRoot, repoRoot));

  const failures = results.filter((r: EvalResult) => !r.pass);

  for (const result of results) {
    if (result.pass) {
      console.log(`PASS  ${result.skill}`);
      continue;
    }
    console.log(`FAIL  ${result.skill}`);
    for (const issue of result.issues) {
      console.log(`      - ${issue}`);
    }
  }

  if (writeReport) {
    const reportPath = join(repoRoot, "evals", "reports", "latest.md");
    writeMarkdownReport(results, reportPath);
    console.log(`\nReport written to ${reportPath}`);
  }

  if (failures.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log(`\nAll ${results.length} checks passed.`);
}

main();

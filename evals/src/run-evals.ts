import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join, normalize } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
import { invokeAction } from "../../mcp-servers/src/handlers.js";

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

    // Handler output validation: invoke each action and validate output against schema
    const actionId = action.id;
    try {
      const testInputs: Record<string, Record<string, unknown>> = {
        wcagaaa_check: { target: "https://example.com", level: "AAA" },
        rewrite_depression_sensitive_content: { text: "test", mode: "audit" },
        supportive_reply: { message: "hello", risk_level: "low" },
        cognitive_accessibility_audit: { content: "test content" },
        cultural_context_check: { message: "hello", audience: "general" },
        deescalation_plan: { situation: "test", intensity: "low" },
        empathetic_reframe: { message: "test", tone: "neutral" },
        grief_support_response: { message: "test", support_mode: "presence" },
        neurodiversity_design_check: { ui_description: "test" },
        age_inclusive_design_check: { flow_description: "test" },
        // Crisis test inputs for safety-critical skills
        wcagaaa_check_crisis: {} as Record<string, unknown>,
        rewrite_depression_sensitive_content_crisis: { text: "I have suicidal thoughts", mode: "audit" },
        supportive_reply_crisis: { message: "I want to kill myself", risk_level: "low" },
        grief_support_response_crisis: { message: "I want to end my life", support_mode: "presence" },
      };

      const result = invokeAction(actionId, (testInputs[actionId] || { target: "test" }) as Record<string, unknown>);
      if (!result.ok) {
        issues.push(`Handler '${actionId}' returned error: ${result.error}`);
        continue;
      }

      const output = result.data.output;
      const outputSchema = JSON.parse(readFileSync(normalize(join(dir, action.output_schema)), "utf8")) as {
        properties?: Record<string, unknown>;
        required?: string[];
        additionalProperties?: boolean;
      };

      // Check extra fields (handler output not in schema)
      if (outputSchema.additionalProperties === false && outputSchema.properties) {
        for (const key of Object.keys(output)) {
          if (!(key in outputSchema.properties)) {
            issues.push(`Handler '${actionId}' outputs undeclared field '${key}' (not in output schema)`);
          }
        }
      }

      // Check missing required fields (schema field not in handler output)
      for (const req of (outputSchema.required ?? [])) {
        if (!(req in output)) {
          issues.push(`Handler '${actionId}' missing required output field '${req}'`);
        }
      }

      // Crisis resource check for safety-critical skills
      const safetyCritical = ["supportive_reply", "grief_support_response", "rewrite_depression_sensitive_content"];
      if (safetyCritical.includes(actionId)) {
        const crisisInput = (testInputs[actionId + "_crisis"] || testInputs[actionId]) as Record<string, unknown>;
        const crisisResult = invokeAction(actionId, crisisInput);
        if (crisisResult.ok) {
          const crisisOutput = crisisResult.data.output as Record<string, unknown>;
          const crisisText = JSON.stringify(crisisOutput);
          if (!crisisText.includes("988") && !crisisText.includes("741741")) {
            issues.push(`Safety-critical handler '${actionId}' missing crisis resources (988/741741) on crisis input`);
          }
        }
      }
    } catch (e) {
      issues.push(`Handler '${actionId}' invocation failed: ${String(e)}`);
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

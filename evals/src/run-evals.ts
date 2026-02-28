import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, normalize } from "node:path";
import { parse } from "yaml";
import { z } from "zod";

type EvalResult = {
  skill: string;
  pass: boolean;
  issues: string[];
};

const skillSpecSchema = z.object({
  name: z.string().min(1),
  version: z.string().min(1),
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
    .min(1)
});

const actionContractSchema = z.object({
  skill: z.string().min(1),
  action: z.string().min(1),
  inputSchemaPath: z.string().min(1),
  outputSchemaPath: z.string().min(1),
  safetyBoundary: z.string().min(1)
});

const REQUIRED_FILES = [
  "SKILL.md",
  "skill.yaml",
  "rubric.md",
  "CHANGELOG.md",
  "LICENSE",
  "scenarios/scenarios.yaml"
];

function countScenarioIds(content: string): number {
  const matches = content.match(/-\s*id:\s*/g);
  return matches ? matches.length : 0;
}

function evaluateSkill(skillDir: string): EvalResult {
  const issues: string[] = [];
  const skillName = skillDir.split("/").at(-1) ?? skillDir;

  for (const relativePath of REQUIRED_FILES) {
    const fullPath = join(skillDir, relativePath);
    try {
      const stats = statSync(fullPath);
      if (!stats.isFile()) {
        issues.push(`Missing file: ${relativePath}`);
      }
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
        issues.push(`  skill.yaml: ${issue.path.join(".") || "root"} ${issue.message}`);
      }
    } else if (parsedSpec.data.name !== skillName) {
      issues.push(`Skill folder/name mismatch: folder='${skillName}' skill.yaml.name='${parsedSpec.data.name}'`);
    }
  } catch {
    issues.push("Unable to parse skill.yaml");
  }

  return {
    skill: skillName,
    pass: issues.length === 0,
    issues
  };
}

function evaluateContractConsistency(skillsRoot: string, repoRoot: string): EvalResult {
  const issues: string[] = [];
  const mcpContractFile = join(repoRoot, "mcp-servers", "src", "index.ts");

  let contracts: z.infer<typeof actionContractSchema>[] = [];
  try {
    const source = readFileSync(mcpContractFile, "utf8");
    const objectMatches = source.match(/\{\n\s*skill:[\s\S]*?\n\s*\}/g) ?? [];
    contracts = objectMatches
      .map((entry) => {
        const skill = /skill:\s*"([^"]+)"/.exec(entry)?.[1];
        const action = /action:\s*"([^"]+)"/.exec(entry)?.[1];
        const inputSchemaPath = /inputSchemaPath:\s*"([^"]+)"/.exec(entry)?.[1];
        const outputSchemaPath = /outputSchemaPath:\s*"([^"]+)"/.exec(entry)?.[1];
        const safetyBoundary = /safetyBoundary:\s*"([^"]+)"/.exec(entry)?.[1];
        return { skill, action, inputSchemaPath, outputSchemaPath, safetyBoundary };
      })
      .filter((row) => row.skill && row.action && row.inputSchemaPath && row.outputSchemaPath && row.safetyBoundary)
      .map((row) => actionContractSchema.parse(row));
  } catch {
    issues.push("Unable to read or parse mcp-servers/src/index.ts contracts");
    return { skill: "contract-consistency", pass: false, issues };
  }

  const contractBySkill = new Map(contracts.map((contract) => [contract.skill, contract]));
  const skillDirs = readdirSync(skillsRoot)
    .map((name: string) => join(skillsRoot, name))
    .filter((fullPath: string) => statSync(fullPath).isDirectory());

  for (const dir of skillDirs) {
    const folderName = dir.split("/").at(-1) ?? dir;
    const raw = readFileSync(join(dir, "skill.yaml"), "utf8");
    const parsed = skillSpecSchema.parse(parse(raw));
    const contract = contractBySkill.get(parsed.name);

    if (!contract) {
      issues.push(`No MCP contract found for skill '${parsed.name}'`);
      continue;
    }

    if (contract.skill !== folderName) {
      issues.push(`Contract skill/folder mismatch: contract='${contract.skill}' folder='${folderName}'`);
    }

    const actionId = parsed.actions[0]?.id;
    if (actionId !== contract.action) {
      issues.push(`Action mismatch for '${parsed.name}': skill='${actionId}' contract='${contract.action}'`);
    }

    const inputPath = normalize(parsed.actions[0]?.input_schema ?? "");
    const outputPath = normalize(parsed.actions[0]?.output_schema ?? "");
    const contractInput = normalize(join("..", "..", "mcp-servers", contract.inputSchemaPath));
    const contractOutput = normalize(join("..", "..", "mcp-servers", contract.outputSchemaPath));

    if (inputPath !== contractInput) {
      issues.push(`Input schema path mismatch for '${parsed.name}'`);
    }
    if (outputPath !== contractOutput) {
      issues.push(`Output schema path mismatch for '${parsed.name}'`);
    }

    const inputSchemaFile = join(repoRoot, "mcp-servers", contract.inputSchemaPath);
    const outputSchemaFile = join(repoRoot, "mcp-servers", contract.outputSchemaPath);
    try {
      JSON.parse(readFileSync(inputSchemaFile, "utf8"));
    } catch {
      issues.push(`Invalid JSON schema file: ${contract.inputSchemaPath}`);
    }
    try {
      JSON.parse(readFileSync(outputSchemaFile, "utf8"));
    } catch {
      issues.push(`Invalid JSON schema file: ${contract.outputSchemaPath}`);
    }
  }

  return {
    skill: "contract-consistency",
    pass: issues.length === 0,
    issues
  };
}

function main(): void {
  const repoRoot = join(process.cwd(), "..");
  const skillsRoot = join(repoRoot, "skills");
  const skillDirs = readdirSync(skillsRoot)
    .map((name: string) => join(skillsRoot, name))
    .filter((fullPath: string) => statSync(fullPath).isDirectory());

  const results = skillDirs.map(evaluateSkill);
  results.push(evaluateContractConsistency(skillsRoot, repoRoot));
  const failures = results.filter((result: EvalResult) => !result.pass);

  for (const result of results) {
    if (result.pass) {
      console.log(`PASS ${result.skill}`);
      continue;
    }

    console.log(`FAIL ${result.skill}`);
    for (const issue of result.issues) {
      console.log(`  - ${issue}`);
    }
  }

  if (failures.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log(`All ${results.length} skills passed baseline checks.`);
}

main();

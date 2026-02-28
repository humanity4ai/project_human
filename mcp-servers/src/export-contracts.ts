/**
 * Generates mcp-servers/src/contracts.json from the action registry.
 * Run: pnpm --filter @humanity4ai/mcp-servers build:contracts
 * This file is consumed by the eval harness to avoid fragile TS source parsing.
 */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { actionContracts } from "./index.js";

const outPath = join(dirname(fileURLToPath(import.meta.url)), "contracts.json");
writeFileSync(outPath, JSON.stringify(actionContracts, null, 2) + "\n", "utf8");
console.log(`Wrote ${actionContracts.length} contracts to ${outPath}`);

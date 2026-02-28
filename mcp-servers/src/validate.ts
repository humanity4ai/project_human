/**
 * Runtime input validation against declared JSON schemas.
 * Validates incoming action inputs before dispatching to handlers.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const schemasDir = join(dirname(fileURLToPath(import.meta.url)), "..", "schemas");

type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] };

function loadSchema(schemaPath: string): Record<string, unknown> | null {
  try {
    const full = join(dirname(fileURLToPath(import.meta.url)), "..", schemaPath);
    return JSON.parse(readFileSync(full, "utf8")) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function validateField(
  value: unknown,
  fieldName: string,
  spec: Record<string, unknown>,
  errors: string[]
): void {
  const type = spec["type"] as string | undefined;
  const enumValues = spec["enum"] as unknown[] | undefined;

  if (enumValues && !enumValues.includes(value)) {
    errors.push(`'${fieldName}' must be one of: ${enumValues.map(String).join(", ")}`);
    return;
  }

  if (type === "string" && typeof value !== "string") {
    errors.push(`'${fieldName}' must be a string`);
  } else if (type === "number" && typeof value !== "number") {
    errors.push(`'${fieldName}' must be a number`);
  } else if (type === "boolean" && typeof value !== "boolean") {
    errors.push(`'${fieldName}' must be a boolean`);
  } else if (type === "array" && !Array.isArray(value)) {
    errors.push(`'${fieldName}' must be an array`);
  } else if (type === "object" && (typeof value !== "object" || value === null || Array.isArray(value))) {
    errors.push(`'${fieldName}' must be an object`);
  }
}

export function validateInput(
  schemaPath: string,
  input: Record<string, unknown>
): ValidationResult {
  const schema = loadSchema(schemaPath);
  if (!schema) {
    // If schema cannot be loaded, pass through with a warning assumption
    return { valid: true };
  }

  const errors: string[] = [];
  const required = (schema["required"] as string[] | undefined) ?? [];
  const properties = (schema["properties"] as Record<string, Record<string, unknown>> | undefined) ?? {};

  for (const field of required) {
    if (!(field in input) || input[field] === undefined || input[field] === null || input[field] === "") {
      errors.push(`Required field '${field}' is missing or empty`);
    }
  }

  for (const [field, spec] of Object.entries(properties)) {
    if (field in input && input[field] !== undefined) {
      validateField(input[field], field, spec, errors);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }
  return { valid: true };
}

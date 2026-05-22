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

function loadSchema(schemaPath: string): { schema: Record<string, unknown> | null; error?: string } {
  try {
    const full = join(dirname(fileURLToPath(import.meta.url)), "..", schemaPath);
    const raw = readFileSync(full, "utf8");
    const schema = JSON.parse(raw) as Record<string, unknown>;
    return { schema };
  } catch (err) {
    if (err instanceof SyntaxError) {
      return { schema: null, error: `Schema file '${schemaPath}' contains invalid JSON` };
    }
    return { schema: null, error: `Schema file '${schemaPath}' not found or unreadable` };
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

  if (type === "string") {
    if (typeof value !== "string") {
      errors.push(`'${fieldName}' must be a string`);
      return;
    }
    const minLength = spec["minLength"] as number | undefined;
    const maxLength = spec["maxLength"] as number | undefined;
    const pattern = spec["pattern"] as string | undefined;
    if (minLength !== undefined && value.length < minLength) {
      errors.push(`'${fieldName}' must be at least ${minLength} characters`);
    }
    if (maxLength !== undefined && value.length > maxLength) {
      errors.push(`'${fieldName}' must be at most ${maxLength} characters`);
    }
    if (pattern !== undefined) {
      try {
        if (!new RegExp(pattern).test(value)) {
          errors.push(`'${fieldName}' does not match required pattern`);
        }
      } catch {
        errors.push(`'${fieldName}' schema pattern is invalid`);
      }
    }
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
  const { schema, error } = loadSchema(schemaPath);
  if (!schema) {
    return { valid: false, errors: [error ?? "Schema validation error"] };
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

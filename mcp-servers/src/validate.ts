/**
 * Runtime input validation against declared JSON schemas.
 * Validates incoming action inputs before dispatching to handlers.
 *
 * Schemas are bundled as inline data (schemas-data.ts) —
 * no file I/O needed, works in all environments including Vercel/bundlers.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { SCHEMA_REGISTRY } from "./schemas-data.js";
import { basename } from "node:path";

type ValidationResult =
  | { valid: true }
  | { valid: false; errors: string[] };

function loadSchema(schemaPath: string): Record<string, unknown> | null {
  // Resolve schema by filename (e.g. "schemas/empathetic-communication.input.json")
  return SCHEMA_REGISTRY[basename(schemaPath)] ?? null;
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
  } else if (type === "array" && Array.isArray(value)) {
    // Validate array items against items schema
    const items = spec["items"] as Record<string, unknown> | undefined;
    if (items && items["type"] === "string") {
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] !== "string") {
          errors.push(`'${fieldName}[${i}]' must be a string`);
        }
      }
    }
  } else if (type === "object" && (typeof value !== "object" || value === null || Array.isArray(value))) {
    errors.push(`'${fieldName}' must be an object`);
  }

  // minLength / maxLength validation for strings
  if (type === "string" && typeof value === "string") {
    const minLength = spec["minLength"];
    const maxLength = spec["maxLength"];
    if (typeof minLength === "number" && value.length < minLength) {
      errors.push(`'${fieldName}' must be at least ${minLength} characters`);
    }
    if (typeof maxLength === "number" && value.length > maxLength) {
      errors.push(`'${fieldName}' must be at most ${maxLength} characters`);
    }
  }
}

export function validateInput(
  schemaPath: string,
  input: Record<string, unknown>
): ValidationResult {
  const schema = loadSchema(schemaPath);
  if (!schema) {
    return { valid: false, errors: [`Schema not found: ${schemaPath}`] };
  }

  const errors: string[] = [];
  const required = (schema["required"] as string[] | undefined) ?? [];
  const properties = (schema["properties"] as Record<string, Record<string, unknown>> | undefined) ?? {};

  for (const field of required) {
    // NOTE: Empty strings are treated as missing values — stricter than JSON Schema
    // spec which allows empty strings for type:string. This is intentional to catch
    // blank required inputs that would produce meaningless handler output.
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

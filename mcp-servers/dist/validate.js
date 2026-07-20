/**
 * Runtime input validation against declared JSON schemas.
 * Validates incoming action inputs before dispatching to handlers.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
function loadSchema(schemaPath) {
    try {
        const full = join(dirname(fileURLToPath(import.meta.url)), "..", schemaPath);
        return JSON.parse(readFileSync(full, "utf8"));
    }
    catch {
        return null;
    }
}
function validateField(value, fieldName, spec, errors) {
    const type = spec["type"];
    const enumValues = spec["enum"];
    if (enumValues && !enumValues.includes(value)) {
        errors.push(`'${fieldName}' must be one of: ${enumValues.map(String).join(", ")}`);
        return;
    }
    if (type === "string" && typeof value !== "string") {
        errors.push(`'${fieldName}' must be a string`);
    }
    else if (type === "number" && typeof value !== "number") {
        errors.push(`'${fieldName}' must be a number`);
    }
    else if (type === "boolean" && typeof value !== "boolean") {
        errors.push(`'${fieldName}' must be a boolean`);
    }
    else if (type === "array" && !Array.isArray(value)) {
        errors.push(`'${fieldName}' must be an array`);
    }
    else if (type === "array" && Array.isArray(value)) {
        // Validate array items against items schema
        const items = spec["items"];
        if (items && items["type"] === "string") {
            for (let i = 0; i < value.length; i++) {
                if (typeof value[i] !== "string") {
                    errors.push(`'${fieldName}[${i}]' must be a string`);
                }
            }
        }
    }
    else if (type === "object" && (typeof value !== "object" || value === null || Array.isArray(value))) {
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
export function validateInput(schemaPath, input) {
    const schema = loadSchema(schemaPath);
    if (!schema) {
        return { valid: false, errors: [`Schema not found: ${schemaPath}`] };
    }
    const errors = [];
    const required = schema["required"] ?? [];
    const properties = schema["properties"] ?? {};
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
//# sourceMappingURL=validate.js.map
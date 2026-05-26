type ValidationResult = {
    valid: true;
} | {
    valid: false;
    errors: string[];
};
export declare function validateInput(schemaPath: string, input: Record<string, unknown>): ValidationResult;
export {};
//# sourceMappingURL=validate.d.ts.map
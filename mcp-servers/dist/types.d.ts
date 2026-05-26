import { z } from "zod";
export declare const invokeRequestSchema: z.ZodObject<{
    action: z.ZodString;
    input: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, "strip", z.ZodTypeAny, {
    action: string;
    input: Record<string, unknown>;
}, {
    action: string;
    input: Record<string, unknown>;
}>;
export type InvokeRequest = z.infer<typeof invokeRequestSchema>;
export type InvokeResponse = {
    action: string;
    output: Record<string, unknown>;
    assumptions: string[];
    uncertainty: "low" | "medium" | "high";
    boundaryNotice: string;
};
//# sourceMappingURL=types.d.ts.map
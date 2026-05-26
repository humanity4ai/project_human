import { z } from "zod";
export declare const actionContractSchema: z.ZodObject<{
    skill: z.ZodString;
    action: z.ZodString;
    description: z.ZodString;
    inputSchemaPath: z.ZodString;
    outputSchemaPath: z.ZodString;
    safetyBoundary: z.ZodString;
}, "strip", z.ZodTypeAny, {
    skill: string;
    action: string;
    description: string;
    inputSchemaPath: string;
    outputSchemaPath: string;
    safetyBoundary: string;
}, {
    skill: string;
    action: string;
    description: string;
    inputSchemaPath: string;
    outputSchemaPath: string;
    safetyBoundary: string;
}>;
export type ActionContract = z.infer<typeof actionContractSchema>;
export declare const KNOWN_ACTIONS: Set<string>;
export declare const actionContracts: ActionContract[];
export declare function validateContracts(contracts: ActionContract[]): ActionContract[];
//# sourceMappingURL=index.d.ts.map
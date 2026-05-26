import { z } from "zod";
export const invokeRequestSchema = z.object({
    action: z.string().min(1),
    input: z.record(z.unknown())
});
//# sourceMappingURL=types.js.map
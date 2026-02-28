import { z } from "zod";

export const invokeRequestSchema = z.object({
  action: z.string().min(1),
  input: z.record(z.unknown())
});

export type InvokeRequest = z.infer<typeof invokeRequestSchema>;

export type InvokeResponse = {
  action: string;
  output: Record<string, unknown>;
  assumptions: string[];
  uncertainty: "low" | "medium" | "high";
  boundaryNotice: string;
};

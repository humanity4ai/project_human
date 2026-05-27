import type { InvokeResponse } from "./types.js";
type HandlerResult = {
    ok: true;
    data: InvokeResponse;
} | {
    ok: false;
    error: string;
};
export declare function invokeAction(action: string, input: Record<string, unknown>): Promise<HandlerResult>;
export {};
//# sourceMappingURL=handlers.d.ts.map
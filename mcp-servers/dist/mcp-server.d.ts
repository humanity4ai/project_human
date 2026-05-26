/**
 * Humanity4AI MCP Server — JSON-RPC 2.0 over stdio
 *
 * Implements the official Model Context Protocol (MCP) SDK JSON-RPC 2.0
 * protocol, making all Humanity4AI skills natively accessible to standard
 * MCP-compatible AI agents (Claude Code, Copilot, Manus AI, OpenCode,
 * LangChain, and any other MCP SDK client).
 *
 * Protocol: @modelcontextprotocol/sdk (JSON-RPC 2.0 over stdio)
 *
 * Usage:
 *   pnpm start
 *   npx -y @humanity4ai/mcp-servers
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
import { invokeAction } from "./handlers.js";
export declare const VERSION: string;
export declare function toMcpResult(result: ReturnType<typeof invokeAction>): {
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
};
export declare function handleWcagaaaCheck({ target, level, context, }: {
    target: string;
    level: "A" | "AA" | "AAA";
    context?: string;
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleRewriteDepressionSensitiveContent({ text, mode, domain, }: {
    text: string;
    mode: "audit" | "rewrite";
    domain?: string;
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleSupportiveReply({ message, risk_level, locale, }: {
    message: string;
    risk_level: "low" | "medium" | "high";
    locale?: string;
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleCognitiveAccessibilityAudit({ content, target_context, }: {
    content: string;
    target_context?: string;
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleCulturalContextCheck({ message, audience, region, }: {
    message: string;
    audience: string;
    region?: string;
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleDeescalationPlan({ situation, intensity, }: {
    situation: string;
    intensity: "low" | "medium" | "high";
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleEmpatheticReframe({ message, tone, }: {
    message: string;
    tone: "neutral" | "warm" | "formal";
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleGriefSupportResponse({ message, support_mode, }: {
    message: string;
    support_mode: "presence" | "practical" | "reflection";
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleNeurodiversityDesignCheck({ ui_description, focus, }: {
    ui_description: string;
    focus?: string[];
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function handleAgeInclusiveDesignCheck({ flow_description, age_groups, }: {
    flow_description: string;
    age_groups?: string[];
}): Promise<{
    isError: boolean;
    content: {
        type: "text";
        text: string;
    }[];
} | {
    content: {
        type: "text";
        text: string;
    }[];
    isError?: undefined;
}>;
export declare function main(): Promise<void>;
//# sourceMappingURL=mcp-server.d.ts.map
/**
 * Multi-language support framework for Humanity4AI MCP handlers.
 * Provides locale-aware reply templates for all 11 skills.
 *
 * Copyright (c) 2026 Ascent Partners Foundation. MIT License.
 */
export type SupportedLocale = "en" | "zh" | "es" | "fr" | "de" | "ja" | "ko" | "ar" | "pt";
export declare const SUPPORTED_LOCALES: readonly SupportedLocale[];
export declare function normalizeLocale(locale: string): SupportedLocale;
export declare function getSupportiveReply(message: string, locale: SupportedLocale): string;
export declare function getLocalizedCrisisResources(locale: SupportedLocale): {
    primary: string;
    secondary: string;
};
export declare function getLocalizedCategory(category: string, locale: SupportedLocale): string;
//# sourceMappingURL=i18n.d.ts.map
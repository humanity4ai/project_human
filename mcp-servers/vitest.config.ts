import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: [
        "src/__tests__/**",
        "src/bin.ts",
        "src/accessibility-engine.ts"
      ],
      thresholds: {
        statements: 90,
        branches: 83,
        functions: 90,
        lines: 90
      },
      reporter: ["text", "lcov"]
    }
  }
});

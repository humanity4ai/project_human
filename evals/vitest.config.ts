import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/__tests__/**"],
      thresholds: {
        statements: 78,
        branches: 65,
        functions: 80,
        lines: 78
      },
      reporter: ["text", "lcov"]
    }
  }
});

import { resolve } from "path";
import { defineConfig } from "vitest/config";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: resolve(__dirname, ".env.local") });

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./__tests__/helpers/setupTests.ts"],
    include: ["__tests__/**/*.test.ts", "__tests__/**/*.test.tsx"],
  },
});

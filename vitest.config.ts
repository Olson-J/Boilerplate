import { resolve } from "path";
import { defineConfig } from "vitest/config";
import { readFileSync } from "fs";

// Load environment variables from .env.local
try {
  const envPath = resolve(__dirname, ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && key.trim()) {
      process.env[key.trim()] = valueParts.join("=").trim();
    }
  });
} catch (error) {
  // .env.local doesn't exist yet (during initial setup)
  console.warn("⚠ .env.local not found - some integration tests may fail");
}

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

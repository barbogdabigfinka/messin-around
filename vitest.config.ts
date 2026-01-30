import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    coverage: {
      reporter: ['text', 'lcov'],
      all: true,
      provider: 'v8',
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/main.tsx', 'src/styles/**', 'src/**/*.css', 'src/utils/**'],
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
});

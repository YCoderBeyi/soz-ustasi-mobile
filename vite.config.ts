/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

const { version } = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8')) as { version: string };

export default defineConfig({
  plugins: [react()],
  // The version shown in Settings comes from package.json (the single source); build.gradle and the release manifest are audited against it.
  define: { __APP_VERSION__: JSON.stringify(version) },
  server: {
    // Windows file locks (AAB / in-place PNG rewrite) crash Vite's watcher without these guards.
    watch: {
      ignored: ['**/android/**', '**/tmp/**', '**/.git/**', '**/*.tmp.png', '**/intermediates/**'],
      awaitWriteFinish: {
        stabilityThreshold: 400,
        pollInterval: 100,
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'jsdom',
  },
});

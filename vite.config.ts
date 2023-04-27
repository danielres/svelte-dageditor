import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    setupFiles: ['src/lib/vitest/add-crypto-polyfill.ts', 'src/lib/vitest/truncate.ts'],
    globalSetup: ['src/lib/vitest/setup-teardown.ts'],
  },
})

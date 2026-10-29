import { defineConfig, devices } from '@playwright/test'

// Runs against a preview build (time travel enabled) on a phone-sized viewport.
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    // Skips the 9-second walk-in so tests reach the bar quickly (walk.spec.ts covers the walk)
    reducedMotion: 'reduce',
  },
  projects: [
    {
      name: 'iphone',
      use: {
        ...devices['iPhone 15'],
        // Chromium with iPhone metrics; add a webkit project if you install it
        browserName: 'chromium',
        launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {},
      },
    },
    {
      name: 'android',
      use: { ...devices['Pixel 7'], launchOptions: process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {} },
    },
  ],
  webServer: {
    command: 'npm run build:preview && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})

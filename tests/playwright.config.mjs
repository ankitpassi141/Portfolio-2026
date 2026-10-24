// Playwright config for the FootSal browser tests. Serves the site with the repo's own dev server on a
// spare port, or uses a server you already have running: FOOTSAL_URL=http://localhost:5173 npm run test:e2e
import { defineConfig } from '@playwright/test';

const external = process.env.FOOTSAL_URL;
export default defineConfig({
  testDir: './e2e',
  // one browser at a time: headless WebGL runs in software here and parallel workers starve each other
  workers: 1,
  timeout: 120_000,
  retries: 0,
  reporter: [['list']],
  outputDir: './test-results',
  use: {
    baseURL: external || 'http://localhost:5199',
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    deviceScaleFactor: 2,
    browserName: 'chromium',
    // the installed Edge (or FOOTSAL_CHANNEL=chrome): this machine's policy blocks Playwright's bundled
    // Chromium from starting out of AppData. Playwright gives it a throwaway profile either way.
    channel: process.env.FOOTSAL_CHANNEL || 'msedge',
    // WebGL in headless mode needs the software renderer
    launchOptions: { args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] },
  },
  webServer: external ? undefined : {
    command: 'powershell -NoProfile -ExecutionPolicy Bypass -File ../scripts/dev-server.ps1 -Port 5199',
    url: 'http://localhost:5199/footsal.html',
    reuseExistingServer: true,
    timeout: 30_000,
  },
});

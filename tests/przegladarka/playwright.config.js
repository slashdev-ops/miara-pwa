// Testy w przeglądarce: Chromium i WebKit (silnik Safari), tryb jasny i ciemny, iPhone 13 i najwęższy ekran 320 px.
// Serwer: serwer.js (pliki aplikacji); nagłówek CSP z vercel.json dokłada test (miara.spec.js).
const { defineConfig, devices } = require('@playwright/test');

const PORT = 8805;
const phone = { ...devices['iPhone 13'] };
delete phone.defaultBrowserType;
const narrow = { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true };

module.exports = defineConfig({
  testDir: '.',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  // Lokalnie okna przeglądarek są widoczne (decyzja użytkownika 11.11.2026); w CI bez okien. Bez okien lokalnie: HEADLESS=1 npm test
  use: { headless: !!process.env.CI || !!process.env.HEADLESS, baseURL: `http://127.0.0.1:${PORT}`, locale: 'pl-PL', serviceWorkers: 'block', screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'node serwer.js', env: { PORT: String(PORT) }, url: `http://127.0.0.1:${PORT}/index.html`, reuseExistingServer: !process.env.CI },
  projects: [
    { name: 'chromium-jasny', use: { ...phone, browserName: 'chromium', colorScheme: 'light' } },
    { name: 'chromium-ciemny', use: { ...phone, browserName: 'chromium', colorScheme: 'dark' } },
    { name: 'webkit-jasny', use: { ...phone, browserName: 'webkit', colorScheme: 'light' } },
    { name: 'webkit-ciemny', use: { ...phone, browserName: 'webkit', colorScheme: 'dark' } },
    { name: 'chromium-320', use: { ...narrow, browserName: 'chromium', colorScheme: 'light' } },
    { name: 'webkit-320', use: { ...narrow, browserName: 'webkit', colorScheme: 'dark' } },
  ],
});

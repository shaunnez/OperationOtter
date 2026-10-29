import { test, expect } from '@playwright/test'

// A phone in "Request Desktop Website" / "Desktop site" mode ignores the viewport
// meta tag and lays the page out ~980px wide. The app should scale itself back up
// so it still looks like the phone layout rather than shrinking every bit of text.
// (Own context, because the test runner doesn't pass a `screen` that differs from the viewport.)
test('desktop-site mode on a phone keeps the phone-sized layout', async ({ browser, baseURL }) => {
  const ctx = await browser.newContext({
    baseURL,
    viewport: { width: 980, height: 2124 },
    screen: { width: 430, height: 932 },
    isMobile: false,
    hasTouch: true,
    deviceScaleFactor: 1.3,
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  await page.goto('/')
  await expect(page.locator('html')).toHaveClass(/ui-scaled/)
  const app = page.locator('.app')
  // Laid out at the phone's real width, then scaled to fill the 980px page
  expect(await app.evaluate((el) => (el as HTMLElement).offsetWidth)).toBe(430)
  const box = await app.boundingBox()
  expect(Math.round(box!.width)).toBe(980)

  // Taps still land in the right place after scaling
  await page.getByTestId('door').tap()
  await expect(page.getByTestId('bar-stage')).toBeVisible({ timeout: 5000 })
  await page.locator('[data-hotspot][aria-label^="Case file"]').tap()
  await expect(page.getByRole('dialog')).toBeVisible()
  await ctx.close()
})

test('a normal phone is left alone', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('html')).not.toHaveClass(/ui-scaled/)
})

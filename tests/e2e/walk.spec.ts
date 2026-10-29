import { expect, test } from '@playwright/test'

test.use({ reducedMotion: 'no-preference' })

test('tapping the door plays the walk-in, which can be skipped', async ({ page }) => {
  await page.goto('/?now=2026-11-02T07:30')
  await page.getByTestId('door').click()
  const walk = page.locator('.stage__video--walk')
  await expect(walk).toHaveClass(/is-ready/)
  await expect.poll(() => walk.evaluate((v: HTMLVideoElement) => v.currentTime), { timeout: 5000 }).toBeGreaterThan(0.5)
  await page.getByRole('button', { name: 'Skip to inside the bar' }).click()
  await expect(page.getByTestId('bar-stage')).toBeVisible({ timeout: 3000 })
})

test('the walk-in ends in the bar on its own', async ({ page }) => {
  test.setTimeout(30_000)
  await page.goto('/?now=2026-11-02T07:30')
  await page.getByTestId('door').click()
  await expect(page.getByTestId('bar-stage')).toBeVisible({ timeout: 15_000 })
})

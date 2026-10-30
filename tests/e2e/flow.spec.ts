import { expect, test, type Page } from '@playwright/test'

const at = (now: string) => `/?now=${now}`

async function enterBar(page: Page) {
  await page.getByTestId('door').click()
  await expect(page.getByTestId('bar-stage')).toBeVisible({ timeout: 5000 })
}

const spot = (page: Page, prefix: string) => page.locator(`[data-hotspot][aria-label^="${prefix}"]`)

test.describe('before the case opens (Sun 1 Nov)', () => {
  test('street shows the case clock counting to Fri 6 Nov', async ({ page }) => {
    await page.goto(at('2026-11-01T20:00'))
    await expect(page.getByTestId('countdown')).toBeVisible()
    // Sun 8pm → Fri 6am = 4 days 10 hours
    await expect(page.getByTestId('countdown')).toContainText('04')
    await expect(page.getByTestId('countdown')).toContainText('10')
  })

  test('every hotspot in the bar is locked', async ({ page }) => {
    await page.goto(at('2026-11-01T20:00'))
    await enterBar(page)
    const states = await page.locator('[data-hotspot]').evaluateAll((els) => els.map((e) => e.getAttribute('data-state')))
    expect(states.length).toBe(9)
    expect(new Set(states)).toEqual(new Set(['locked']))
  })

  test('tapping a locked item shows the timeline and countdown, not the content', async ({ page }) => {
    await page.goto(at('2026-11-01T20:00'))
    await enterBar(page)
    await spot(page, 'Back room').click()
    const sheet = page.getByTestId('locked')
    await expect(sheet).toBeVisible()
    await expect(sheet).toContainText('Opens Fri 6 Nov at 6:00 am')
    await expect(page.getByTestId('locked-countdown')).toBeVisible()
    await expect(sheet.locator('.timeline__day')).toHaveCount(5)
    await expect(sheet.locator('.timeline__day.is-target')).toHaveAttribute('data-day', '5')
    await expect(sheet).not.toContainText('ASB')
  })
})

test('Monday: Pink Pony Club comes on as she walks in, clue 1 opens the first album', async ({ page }) => {
  await page.goto(at('2026-11-02T07:00'))
  await enterBar(page)
  const music = page.getByTestId('bar-music')
  await expect(music).toContainText('Pink Pony Club')
  await expect(music.locator('iframe')).toHaveAttribute('src', /GR3Liudev18/)
  await expect(spot(page, 'The jukebox')).toHaveAttribute('data-state', 'fresh')
  await expect(spot(page, 'The photo wall')).toHaveAttribute('data-state', 'fresh')
  await expect(spot(page, 'The old TV')).toHaveAttribute('data-state', 'locked')
  await spot(page, 'Case file').click()
  await expect(page.getByTestId('exhibit-1')).toHaveAttribute('data-status', 'open')
  await expect(page.getByTestId('exhibit-2')).toHaveAttribute('data-status', 'locked')
  await page.getByTestId('exhibit-1').click()
  await page.getByTestId('option-0').click() // wrong
  await expect(page.getByTestId('option-0')).toBeDisabled()
  await page.getByTestId('option-1').click() // right
  await expect(page.getByTestId('evidence')).toBeVisible({ timeout: 4000 })
  await page.getByTestId('reward-cta').click()
  await expect(page.getByTestId('album-view')).toBeVisible()
  await page.getByRole('button', { name: 'Close album' }).click()
  await expect(page.getByTestId('album-a1')).toBeVisible()
  await expect(page.getByTestId('photos').locator('.pinned-photo.is-back')).toHaveCount(4)
})

test('the jukebox waits hidden on the street, then shows as a full-width strip in the bar', async ({ page }) => {
  await page.goto(at('2026-11-02T07:00'))
  await expect(page.getByTestId('bar-music-armed')).toHaveCount(1)
  await expect(page.getByTestId('bar-music')).toHaveCount(0)
  await enterBar(page)
  await expect(page.getByTestId('bar-music-armed')).toHaveCount(0)
  const box = await page.getByTestId('bar-music').boundingBox()
  const vw = page.viewportSize()!.width
  expect(box!.width).toBeGreaterThan(vw - 2)
})

test('the bar song stops for the jukebox and stays off once closed', async ({ page }) => {
  await page.goto(at('2026-11-02T07:00'))
  await enterBar(page)
  await expect(page.getByTestId('bar-music')).toBeVisible()
  await spot(page, 'The jukebox').click()
  await expect(page.locator('[data-testid="jukebox"] iframe')).toHaveCount(0) // poster first
  await page.getByTestId('play').click()
  await expect(page.getByTestId('bar-music')).toHaveCount(0)
  await page.goBack()
  await expect(page.getByTestId('bar-music')).toHaveCount(0)
})

test('no bar song before the bar opens', async ({ page }) => {
  await page.goto(at('2026-11-01T20:00'))
  await enterBar(page)
  await page.waitForTimeout(500)
  await expect(page.getByTestId('bar-music')).toHaveCount(0)
})

test('Wednesday: booth needs the clue, then reveals the plan', async ({ page }) => {
  await page.goto(at('2026-11-04T09:00'))
  await enterBar(page)
  await spot(page, 'Back booth').click()
  await expect(page.getByTestId('clue-first')).toBeVisible()
  await page.getByRole('button', { name: 'Open today’s clue' }).click()
  await page.getByTestId('option-1').click()
  await expect(page.getByTestId('evidence')).toBeVisible({ timeout: 4000 })
  await page.getByTestId('reward-cta').click()
  await expect(page.getByTestId('reveal-wednesday')).toBeVisible()
  // Thursday and Friday still locked
  await page.goBack()
  await spot(page, 'Menu').click()
  await expect(page.getByTestId('locked')).toContainText('Thu 5 Nov')
})

test('Thursday: menu shows the cocktails once solved', async ({ page }) => {
  await page.goto(at('2026-11-05T18:00'))
  await enterBar(page)
  await spot(page, 'Case file').click()
  await page.getByTestId('exhibit-4').click()
  await page.getByTestId('option-0').click()
  await expect(page.getByTestId('reward-cta')).toBeInViewport({ timeout: 5000 })
  await expect(page.getByTestId('evidence')).toContainText('Menu unlocked')
  await page.getByTestId('reward-cta').click()
  await expect(page.getByTestId('reveal-thursday')).toBeVisible()
  await expect(page.getByTestId('wing-voucher')).toContainText('Wing foiling for two')
})

test('Friday: the back room opens', async ({ page }) => {
  await page.goto(at('2026-11-06T10:00'))
  await enterBar(page)
  await expect(spot(page, 'Back room')).toHaveAttribute('data-state', 'fresh')
  await spot(page, 'Case file').click()
  await page.getByTestId('exhibit-5').click()
  await page.getByTestId('option-3').click()
  await page.getByTestId('reward-cta').click({ timeout: 5000 })
  await expect(page.getByTestId('reveal-friday')).toBeVisible()
  await expect(page.getByTestId('reveal-friday')).toContainText('Your Goose')
})

test('back button closes overlays, then leaves the bar', async ({ page }) => {
  await page.goto(at('2026-11-03T09:00'))
  await enterBar(page)
  await spot(page, 'The old TV').click()
  await expect(page.getByTestId('tv')).toBeVisible()
  await page.goBack()
  await expect(page.getByTestId('tv')).toHaveCount(0)
  await page.goBack()
  await expect(page.getByTestId('door')).toBeVisible()
})

test('progress survives a reload', async ({ page }) => {
  await page.goto(at('2026-11-02T08:00'))
  await enterBar(page)
  await spot(page, 'Case file').click()
  await page.getByTestId('exhibit-1').click()
  await page.getByTestId('option-1').click()
  await expect(page.getByTestId('evidence')).toBeVisible({ timeout: 4000 })
  await page.reload()
  await enterBar(page)
  await spot(page, 'Case file').click()
  await expect(page.getByTestId('exhibit-1')).toHaveAttribute('data-status', 'solved')
})

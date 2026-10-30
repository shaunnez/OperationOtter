import { expect, test } from '@playwright/test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// The built bundle must not contain future content in plain text.
const SPOILERS = ['Molten glass', 'Glass blowing', 'ASB Classic', 'Wednesday, sorted', 'Happy anniversary', 'Something soft', 'The Silly Goose', 'Wing foiling', 'MadLoop']

test('no spoilers in the built JavaScript or HTML', () => {
  const dir = join(process.cwd(), 'dist')
  const files = [join(dir, 'index.html'), ...readdirSync(join(dir, 'assets')).filter((f) => f.endsWith('.js')).map((f) => join(dir, 'assets', f))]
  for (const f of files) {
    const text = readFileSync(f, 'utf8')
    for (const s of SPOILERS) expect(text, `${s} found in ${f}`).not.toContain(s)
  }
})

test('locked content is not in the DOM before its day', async ({ page }) => {
  await page.goto('/?now=2026-11-03T09:00')
  await page.getByTestId('door').click()
  await page.waitForTimeout(1500)
  const html = await page.content()
  for (const s of SPOILERS) expect(html).not.toContain(s)
})

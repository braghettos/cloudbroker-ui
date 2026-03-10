import { test } from '@playwright/test'

const routes = [
  { path: '/recommendations', name: '01-recommendations', triggerSearch: true },
  { path: '/analytics', name: '02-provider-comparison', selectProviderComparison: true },
  { path: '/providers', name: '03-providers' },
  { path: '/instances', name: '04-instances' },
  { path: '/prices', name: '05-prices' },
] as const

for (const route of routes) {
  const { path, name, triggerSearch, selectProviderComparison } = route
  test(`screenshot ${name}`, async ({ page }) => {
    // Tall viewport so main (overflow-auto) shows full content without internal scroll
    if (name === '01-recommendations') {
      await page.setViewportSize({ width: 1280, height: 2400 })
    }
    await page.goto(path)
    await page.waitForLoadState('networkidle')

    if (triggerSearch) {
      const getRecsBtn = page.getByRole('button', { name: 'Get Recommendations' })
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/recommendations') && res.request().method() === 'POST',
        { timeout: 15000 }
      )
      await getRecsBtn.click()
      await responsePromise
      await page.getByText(/recommendation|No recommendations yet/).waitFor({ state: 'visible', timeout: 5000 })
    }

    if (selectProviderComparison) {
      await page.getByRole('tab', { name: 'Provider Comparison' }).click()
      const compareBtn = page.getByRole('button', { name: 'Compare' })
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/recommendations') && res.request().method() === 'POST',
        { timeout: 15000 }
      )
      await compareBtn.click()
      await responsePromise
      await page.getByRole('button', { name: 'Compare' }).waitFor({ state: 'visible', timeout: 10000 })
      await page.getByText(/hetzner|aws|azure|aruba/, { exact: false }).first().waitFor({ state: 'visible', timeout: 10000 })
      await page.locator('.recharts-bar-rectangle').first().waitFor({ state: 'visible', timeout: 10000 })
      await page.waitForTimeout(600)
    }

    await page.screenshot({
      path: `flow-screenshots/${name}.png`,
      fullPage: true,
    })
  })
}

import { test } from '@playwright/test'

const routes = [
  { path: '/recommendations', name: '01-recommendations', triggerSearch: true },
  { path: '/analytics', name: '02-analytics', selectScorecard: true },
  { path: '/providers', name: '03-providers' },
  { path: '/instances', name: '04-instances' },
  { path: '/prices', name: '05-prices' },
] as const

for (const route of routes) {
  const { path, name, triggerSearch, selectScorecard } = route
  test(`screenshot ${path}`, async ({ page }) => {
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

    if (selectScorecard) {
      await page.getByRole('tab', { name: 'Scorecard' }).click()
      const loadBtn = page.getByRole('button', { name: 'Load Scorecard' })
      const responsePromise = page.waitForResponse(
        (res) => res.url().includes('/api/recommendations') && res.request().method() === 'POST',
        { timeout: 15000 }
      )
      await loadBtn.click()
      await responsePromise
      await page.getByRole('button', { name: 'Load Scorecard' }).waitFor({ state: 'visible', timeout: 5000 })
    }

    await page.screenshot({
      path: `flow-screenshots/${name}.png`,
      fullPage: true,
    })
  })
}

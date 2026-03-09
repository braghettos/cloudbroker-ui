import { test } from '@playwright/test'

const routes = [
  { path: '/recommendations', name: '01-recommendations' },
  { path: '/analytics', name: '02-analytics' },
  { path: '/providers', name: '03-providers' },
  { path: '/instances', name: '04-instances' },
  { path: '/prices', name: '05-prices' },
] as const

for (const { path, name } of routes) {
  test(`screenshot ${path}`, async ({ page }) => {
    await page.goto(path)
    await page.waitForLoadState('networkidle')
    await page.screenshot({
      path: `flow-screenshots/${name}.png`,
      fullPage: true,
    })
  })
}

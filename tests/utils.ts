import { Page } from '@playwright/test'

export async function login(page: Page, id: string, password: string) {
  await page.goto('https://dhlottery.co.kr/user.do?method=login&returnUrl=')

  await waitLoading(page)

  const idInput = page.locator('#userId')
  await idInput.focus()
  await idInput.fill(id)

  await page.keyboard.press('Tab')
  const passwordInput = page.locator('*:focus')
  await passwordInput.fill(password)

  await page.keyboard.press('Tab')
  const loginButton = page.locator('*:focus')
  await loginButton.click()

  await page.waitForTimeout(1000)
  await waitLoading(page)
}

export async function waitLoading(
  page: Page,
  passNetworkIdle: boolean = false,
) {
  await page.waitForLoadState('load')
  await page.waitForLoadState('domcontentloaded')
  if (!passNetworkIdle) {
    await page.waitForLoadState('networkidle')
  }
}

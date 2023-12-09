import { test, expect, Page } from '@playwright/test'
import { login, waitLoading } from './utils'

test('연금복권 구매', async ({ page }) => {
  const id = process.env.USER_ID
  const password = process.env.USER_PW
  const amount = process.env.AMOUNT
  const smoke = process.env.SMOKE === 'true'
  if (!id || !password || !amount) {
    return
  }

  expect(id).not.toBeFalsy()
  expect(password).not.toBeFalsy()
  expect(parseInt(amount)).not.toBeNaN()

  await login(page, id, password)
  await buy(page, parseInt(amount), smoke)
})

async function buy(page: Page, amount: number, smoke: boolean) {
  await page.goto('https://el.dhlottery.co.kr/game/pension720/game.jsp')
  await waitLoading(page)

  await page.locator('.lotto720_btn_auto_number').click()
  await page.locator('.lotto720_btn_confirm_number').click()

  await page.locator('.lotto720_btn_pay').click()

  const text = smoke ? '취소' : '구매하기'
  await page.locator('#lotto720_popup_confirm').getByText(text).click()

  await page.waitForTimeout(1000)
}

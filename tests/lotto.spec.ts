import { test, expect, Page } from '@playwright/test'
import { login, waitLoading } from './utils'
import { getSelectedNumbers } from './numberSelector'

test('로또 구매', async ({ page }) => {
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
  await buyLotto(page, parseInt(amount), smoke)
})

async function buyLotto(page: Page, amount: number, smoke: boolean) {
  await page.goto('https://ol.dhlottery.co.kr/olotto/game/game645.do')
  await waitLoading(page)
  await page.waitForSelector('label[for="check645num1"]')

  if (await page.locator('#popupLayerAlert').isVisible()) {
    await page.locator('#popupLayerAlert').getByText('확인').click()
  }

  const numbers = getSelectedNumbers()
  console.log({ numbers })

  for (const num of numbers) {
    await page.locator(`label[for="check645num${num}"]`).click()
  }

  await page.locator('#amoundApply').selectOption(`${amount}`)

  await page.locator('#btnSelectNum').click()
  await page.locator('#btnBuy').click()

  const text = smoke ? '취소' : '확인'
  await page.locator('#popupLayerConfirm').getByText(text).click()

  await page.waitForTimeout(1000)
}

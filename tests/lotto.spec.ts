import { test, expect, Page } from '@playwright/test';

test.describe('복권 구매 자동화', () => {
    test('로또 구매', async ({ page }) => {
        const id = process.env.USER_ID;
        const password = process.env.USER_PW;
        const amount = process.env.AMOUNT;
        const smoke = process.env.SMOKE === 'true'
        if (!id || !password || !amount) {
            return;
        }

        expect(id).not.toBeFalsy();
        expect(password).not.toBeFalsy();
        expect(parseInt(amount)).not.toBeNaN();

        await login(page, id, password);
        await gotoLottoPage(page);
        await buyLotto(page, parseInt(amount), smoke);
    });
})

async function login(page: Page, id: string, password: string) {
    await page.goto('https://dhlottery.co.kr/user.do?method=login&returnUrl=');

    await waitLoading(page);

    const idInput = page.locator('#userId');
    await idInput.focus();
    await idInput.fill(id);

    await page.keyboard.press('Tab');
    const passwordInput = page.locator('*:focus');
    await passwordInput.fill(password)

    await page.keyboard.press('Tab');
    const loginButton = page.locator('*:focus');
    await loginButton.click();

    await page.waitForTimeout(1000);
    await waitLoading(page);
}

async function gotoLottoPage(page: Page) {
    await page.goto('https://el.dhlottery.co.kr/game/TotalGame.jsp?LottoId=LO40');
    await waitLoading(page);
}

function getRandomNumbers() {
    return Array
        .from({ length: 45 })
        .map((_, i) => i + 1)
        .sort(() => Math.random() > 0.5 ? 1 : -1)
        .slice(0, 6)
        .sort((a, b) => (a - b));
}

async function buyLotto(page: Page, amount: number, smoke: boolean) {
    const frame = page.frameLocator('#ifrm_tab');
    const numbers = getRandomNumbers()

    for (const num of numbers) {
        await frame.locator(`label[for="check645num${num}"]`).click();
    }

    await frame.locator('#amoundApply').selectOption(`${amount}`)

    await frame.locator('#btnSelectNum').click();
    await frame.locator('#btnBuy').click();

    const text = smoke ? '취소' : '확인';
    await frame.locator('#popupLayerConfirm').getByText(text).click();

    await page.waitForTimeout(1000);
}

async function waitLoading(page: Page) {
    await page.waitForLoadState('load');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
}

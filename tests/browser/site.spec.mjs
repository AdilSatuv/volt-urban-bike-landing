import { test,expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("configuration controls update price and product",async({page},info)=>{await page.goto("/#configure");await page.getByRole("button",{name:"Цвет Терракота",exact:true}).click();await page.getByRole("button",{name:/Long \/ 540 Wh/}).click();await expect(page.getByText(/151.000 ₽/)).toBeVisible();await expect(page.getByRole("img",{name:"VOLT One, цвет Терракота",exact:true})).toBeVisible();await page.screenshot({path:info.outputPath("configuration.png"),animations:"disabled"});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();});
test("range responds to route and demo request validates email",async({page})=>{await page.goto("/#range");await page.getByLabel("Твой маршрут",{exact:true}).selectOption("hills");await expect(page.locator("#range strong").filter({hasText:"31"})).toBeVisible();await page.getByLabel("Электронная почта",{exact:true}).fill("rider@example.com");await page.getByRole("button",{name:"Проверить демо-заявку",exact:true}).click();await expect(page.locator("#ride-status")).toContainText("тест-райд не забронирован");});
test("page has no serious automated accessibility findings",async({page},info)=>{await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");await expect(page.getByRole("heading",{level:1})).toBeVisible();await page.screenshot({path:info.outputPath("home.png"),animations:"disabled"});const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();expect(result.violations.filter(v=>["serious","critical"].includes(v.impact))).toEqual([]);});

test("configuration links restore product and range conditions",async({page})=>{
 await page.goto('/?finish=ember&battery=long&assist=3&terrain=hills#configure');
 await expect(page.getByRole('button',{name:'Цвет Терракота',exact:true})).toHaveAttribute('aria-pressed','true');
 await expect(page.getByText(/151.000 ₽/)).toBeVisible();
 await expect(page.getByLabel('Твой маршрут',{exact:true})).toHaveValue('hills');
 await page.getByRole('button',{name:'Поделиться комплектацией ↗',exact:true}).click();
 await expect(page.getByLabel('Ссылка на комплектацию',{exact:true})).toHaveValue(/finish=ember&battery=long&assist=3&terrain=hills#configure$/);
});

test("missing page offers a useful route back",async({page})=>{const response=await page.goto('/this-page-does-not-exist/');expect(response.status()).toBe(404);await expect(page.getByText('404 / СТРАНИЦА НЕ НАЙДЕНА',{exact:true})).toBeVisible();await expect(page.getByRole('navigation',{name:'Вернуться на сайт',exact:true})).toBeVisible();});

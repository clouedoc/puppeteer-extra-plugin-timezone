import puppeteer from "puppeteer-extra"
import TimezonePlugin from "./plugin"

puppeteer.use(TimezonePlugin())

jest.setTimeout(50000)

it("emulates the given timezone", async () => {
  const browser = await puppeteer.launch({
    headless: false
  })

  const page = await browser.newPage()

  await page.goto("https://whoer.net")

  const stealth = await Promise.race([
    page
      .waitForSelector(
        "#main > section.section.section_ip-check.section_white > div > div > div > div.tab.tab_lite > div.row > div:nth-child(2) > div:nth-child(1) > div > div > div.card__data > div:nth-child(1) > div.card__col.card__col_value.matched.highlighted_red"
      )
      .then(() => false),
    page
      .waitForSelector(
        "#main > section.section.section_ip-check.section_white > div > div > div > div.tab.tab_lite > div.row > div:nth-child(2) > div:nth-child(1) > div > div > div.card__data > div:nth-child(1) > div.card__col.card__col_value.matched.highlighted_green"
      )
      .then(() => true)
  ])

  await browser.close()

  expect(stealth).toBe(true)
})

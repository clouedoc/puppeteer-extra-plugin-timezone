import { Browser } from "puppeteer"
import puppeteer from "puppeteer-extra"
import TimezonePlugin from "./plugin"

jest.setTimeout(50000)

const TEST_PROXY_SERVER = "45.95.96.187:8746"

async function isStealth(browser?: Browser) {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--proxy-server=" + TEST_PROXY_SERVER]
    })
  }

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
  return stealth
}

it("isn't stealth when not using the timezone plugin (use a VPN!)", async () => {
  await expect(isStealth()).resolves.toBe(false)
})

it("emulates the right timezone for the current IP", async () => {
  puppeteer.use(TimezonePlugin())
  await expect(isStealth()).resolves.toBe(true)
})

it("emulates the right timezone for multiple browsers concurrently", async () => {
  const proxyBrowser = await puppeteer.launch({
    headless: true,
    args: ["--proxy-server=45.95.96.187:8746"]
  })

  const normalBrowser = await puppeteer.launch({
    headless: true
  })

  // the second browser opening should have overidden the timezone context of the first
  await expect(isStealth(proxyBrowser)).resolves.toBe(true)

  await Promise.all([proxyBrowser.close(), normalBrowser.close()])
})

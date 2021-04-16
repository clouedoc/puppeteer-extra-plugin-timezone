import { Browser } from "puppeteer"
import puppeteer from "puppeteer-extra"
import { TESTING_PROXY_SERVER } from "./constants"
import TimezonePlugin, { TimezonePlugin as TimezonePluginType } from "./plugin"
import { TargetInfoSchema } from "./schemas"

jest.setTimeout(50000)

async function isStealth(browser?: Browser) {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--proxy-server=" + TESTING_PROXY_SERVER]
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

it("isn't stealth when not using the timezone plugin", async () => {
  await expect(isStealth()).resolves.toBe(false)
})

let plugin: TimezonePluginType
plugin = TimezonePlugin()
puppeteer.use(plugin)

it("emulates the right timezone for the current IP", async () => {
  await expect(isStealth()).resolves.toBe(true)
})

it("emulates the right timezone for multiple browsers concurrently", async () => {
  const proxyBrowser = await puppeteer.launch({
    headless: true,
    args: ["--proxy-server=" + TESTING_PROXY_SERVER]
  })

  const normalBrowser = await puppeteer.launch({
    headless: true
  })

  // the second browser opening should have overidden the timezone context of the first
  await expect(isStealth(proxyBrowser)).resolves.toBe(true)

  await Promise.all([proxyBrowser.close(), normalBrowser.close()])
})

async function getBrowserId(browser: Browser) {
  const browserInfo = TargetInfoSchema.parse(
    await (await browser.target().createCDPSession()).send(
      "Target.getTargetInfo"
    )
  )
  return browserInfo.targetInfo.targetId
}

it("does not keep the cache entry once the browser is closed", async () => {
  const browser = await puppeteer.launch({
    headless: true
  })

  const browserId = await getBrowserId(browser)

  expect(plugin.ctx.get(browserId)).toBeDefined()

  await browser.close()

  expect(plugin.ctx.get(browserId)).toBeUndefined()
})

import { Page } from "puppeteer"
import { IP_REFLECTION_URL } from "./constants"
import { LumResponseSchema } from "./schemas"
import { LumResponse, TrackedTimezone } from "./types"

/**
 * Gets the timezone of a page from Luminati.
 *
 * @throws When timezone is not returned.
 * @param {Page} page
 * @return {Promise<string>}
 */
export async function getTimezone(page: Page): Promise<TrackedTimezone> {
  await page.goto(IP_REFLECTION_URL)
  const content: string = await page.evaluate(
    () => document.querySelector("body")?.textContent || ""
  )
  const info: LumResponse = LumResponseSchema.parse(JSON.parse(content))
  return {
    ip: info.ip,
    tz: info.geo.tz,
    ctx: info
  }
}

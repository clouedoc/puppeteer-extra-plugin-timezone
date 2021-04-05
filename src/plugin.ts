import { Browser, Page } from "puppeteer"
import { PuppeteerExtraPlugin } from "puppeteer-extra-plugin"
import {
  DEFAULT_FALLBACK_TIMEZONES,
  IP_REFLECTION_URL,
  PLUGIN_NAME
} from "./constants"
import { getTimezone } from "./provider"
import { TargetInfoSchema } from "./schemas"
import { TimezonePluginOptions, TrackedTimezone } from "./types"

type BrowserID = string

/**
 * Puppeteer Extra Timezone Plugin
 *
 * @class
 * @classdesc Reflects public IP context and adjusts Chrome timezone to match expectation.
 */
export class TimezonePlugin extends PuppeteerExtraPlugin {
  /**
   * Tracks the pages resolved by tests.
   * @type {TrackedTimezone | undefined}
   */
  public ctx: Map<BrowserID, TrackedTimezone>

  /**
   * Provide fallbacks if resolution fails.
   * @type {string}
   * @protected
   */
  protected _fallbackTz: string | undefined

  /**
   * Constructor
   * Receives standard puppeteer-extra plugin config options.
   *
   * @param {TimezonePluginOptions} opts
   */
  public constructor(opts: TimezonePluginOptions = {}) {
    super(opts)
    this._setFallbackTz(opts.fallbackTz)
    this.ctx = new Map()
  }

  /**
   * Describe the identifier for plugin.
   * @return {string}
   */
  public get name() {
    return PLUGIN_NAME
  }

  /**
   * Accessor to previously resolved timezone strings.
   *
   * @return {string | undefined}
   */
  getTz(browserId: BrowserID): string | undefined {
    return this.ctx.get(browserId)?.tz
  }

  /**
   * @returns the unique TargetID of a given Browser.
   * @see https://chromedevtools.github.io/devtools-protocol/tot/Target/#method-getTargetInfo
   */
  protected async getBrowserID(browser: Browser): Promise<BrowserID> {
    const session = await browser.target().createCDPSession()

    const browserInfo = TargetInfoSchema.parse(
      await session.send("Target.getTargetInfo")
    )

    return browserInfo.targetInfo.targetId
  }

  /**
   * Upon browser launch, attempt to resolve the timezone, if not already resolved.
   *
   * @param {Browser} browser
   * @return {Promise<void>}
   */
  public async onBrowser(browser: Browser): Promise<void> {
    const browserID = await this.getBrowserID(browser)

    try {
      // Create a new page to resolve ip context.
      const page: Page = await browser.newPage()
      // Save the ip context result to local property for future access.
      this.ctx.set(browserID, await getTimezone(page))
      // Clean up.
      await page.close()
      this.debug(
        `Detected timezone (${IP_REFLECTION_URL}): ${this.getTz(browserID)}`,
        this.ctx
      )
    } catch (err) {
      this.debug(`Error getting timezone for ip: ${err.message}`)
      this.debug(err.stack ?? err)
    }
  }

  /**
   * Each new page creation event, emulate the resolved timezone.
   *
   * @param {Page} page
   * @return {Promise<void>}
   */
  public async onPageCreated(page: Page): Promise<void> {
    const browserID = await this.getBrowserID(page.browser())

    try {
      // Get the resolved timezone or fallback timezone.
      const tz = this.getTz(browserID) || this._fallbackTz

      // Do not emulate if we couldn't get any one of them.
      if (!tz) {
        this.debug(
          `No timezone was resolved upon browser construction, no emulation occurring.`
        )
        return
      }

      await page.emulateTimezone(tz)
      this.debug(`Emulating timezone ${tz} for ${page.url()}`)
    } catch (err) {
      this.debug(
        `Error emulating timezone for page (${page.url()}): ${err.message}`
      )
      this.debug(err.stack ?? err)
    }
  }

  /**
   * Set the fallback value from options or defaults.
   *
   * @param {string | string[] | undefined} zones
   * @protected
   */
  protected _setFallbackTz(zones: string | string[] | undefined): void {
    let fallbacks: string[] = DEFAULT_FALLBACK_TIMEZONES
    if (zones) {
      fallbacks = typeof zones === "string" ? [zones] : zones
    }
    this._fallbackTz = fallbacks[Math.floor(Math.random() * fallbacks.length)]
  }
}

/**
 * Export plugin factory as default export.
 * @return {TimezonePlugin}
 */
export default () => new TimezonePlugin()

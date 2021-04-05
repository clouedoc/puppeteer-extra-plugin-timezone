import { Browser, Page } from "puppeteer"
import { PuppeteerExtraPlugin } from "puppeteer-extra-plugin"
import {
  DEFAULT_FALLBACK_TIMEZONES,
  IP_REFLECTION_URL,
  PLUGIN_NAME
} from "./constants"
import { getTimezone } from "./provider"
import {
  PuppeteerExtraTimezonePlugin,
  TimezonePluginOptions,
  TrackedTimezone
} from "./types"

/**
 * Puppeteer Extra Timezone Plugin
 *
 * @class
 * @classdesc Reflects public IP context and adjusts Chrome timezone to match expectation.
 */
export class TimezonePlugin
  extends PuppeteerExtraPlugin
  implements PuppeteerExtraTimezonePlugin {
  /**
   * Tracks the pages resolved by tests.
   * @type {TrackedTimezone | undefined}
   */
  public ctx: TrackedTimezone | undefined

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
  }

  /**
   * Describe the identifier for plugin.
   * @return {string}
   */
  public get name() {
    return PLUGIN_NAME
  }

  /**
   * Shortcut accessor to the resolved timezone string, if any.
   *
   * @return {string | undefined}
   */
  public get tz(): string | undefined {
    return this.ctx?.tz
  }

  /**
   * Upon browser launch, attempt to resolve the timezone, if not already resolved.
   *
   * @param {Browser} browser
   * @return {Promise<void>}
   */
  public async onBrowser(browser: Browser): Promise<void> {
    try {
      // Create a new page to resolve ip context.
      const page: Page = await browser.newPage()
      // Save the ip context result to local property for future access.
      this.ctx = await getTimezone(page)
      // Clean up.
      await page.close()
      this.debug(
        `Detected timezone (${IP_REFLECTION_URL}): ${this.tz}`,
        this.ctx
      )
    } catch (err) {
      this.debug(`Error getting timezone for page: ${err.message}`)
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
    try {
      // Get the resolved timezone or fallback timezone.
      const tz: string | undefined = this.tz || this._fallbackTz
      // If either are available, emulate it.
      if (tz) {
        await page.emulateTimezone(tz)
        this.debug(`Emulating timezone ${tz} for ${page.url()}`)
      } else {
        this.debug(
          `No timezone was resolved upon browser construction, not emulation occurring.`
        )
      }
    } catch (err) {
      this.debug(`Error getting timezone for page: ${err.message}`)
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

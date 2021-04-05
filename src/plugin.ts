import { Page } from "puppeteer"
import { PuppeteerExtraPlugin } from "puppeteer-extra-plugin"
import { IP_REFLECTION_URL, PLUGIN_NAME } from "./constants"
import { getTimezone } from "./provider"
import { PuppeteerExtraTimezonePlugin, TzPageTracker } from "./types"

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
   * @type {TzPageTracker[]}
   */
  public readonly trackedPages: TzPageTracker[] = []

  /**
   * Constructor
   * Receives standard puppeteer-extra plugin config options.
   * @param {{}} opts
   */
  public constructor(opts = {}) {
    super(opts)
  }

  /**
   * Describe the identifier for plugin.
   * @return {string}
   */
  public get name() {
    return PLUGIN_NAME
  }

  /**
   * Implement plugin logic on page creation.
   *
   * @param {Page} page
   * @return {Promise<void>}
   */
  public async onPageCreated(page: Page): Promise<void> {
    try {
      const tz: string = await getTimezone(page)
      const url: string = page.url()
      this.trackedPages.push({
        url,
        tz
      })
      this.debug(`Detected timezone (${IP_REFLECTION_URL}): ${tz}`)
      await page.emulateTimezone(tz)
    } catch (err) {
      this.debug(`Error getting timezone for page: ${err.message}`)
      this.debug(err.stack ?? err)
    }
  }
}

/**
 * Export plugin as default export.
 * @return {TimezonePlugin}
 */
export default () => new TimezonePlugin()

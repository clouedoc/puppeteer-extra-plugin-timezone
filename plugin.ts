import { Page } from "puppeteer";
import { PuppeteerExtraPlugin } from "puppeteer-extra-plugin";
import { getTimezoneLuminati } from "./lumtest";

export class TimezonePlugin extends PuppeteerExtraPlugin {
  constructor(opts = {}) {
    super(opts);
  }

  _lumPages: string[] = [];

  get name() {
    return "timezone";
  }

  async onPageCreated(page: Page) {
    try {
      var tz = await getTimezoneLuminati(page);
      this.debug("Detected timezone (lumtest): " + tz);
    } catch (err) {
      this.debug("Error getting timezone for page: " + err.stack ?? err);
      return;
    }

    await page.emulateTimezone(tz);
  }
}

export default () => new TimezonePlugin();

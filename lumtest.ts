import { Page } from "puppeteer";
import * as z from "zod";

/**
 * Gets the Timezone of a page from Luminati
 * @throws when it can't get the timezone
 */
export async function getTimezoneLuminati(page: Page) {
  await page.goto("https://lumtest.com/myip.json");
  const content = await page.$eval("body", (el) =>
    JSON.parse((el as HTMLElement).innerText ?? "")
  );

  const info = z
    .object({
      geo: z
        .object({
          tz: z.string(),
        })
        .nonstrict(),
    })
    .nonstrict()
    .parse(content);

  return info.geo.tz;
}

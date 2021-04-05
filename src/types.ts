import { PuppeteerExtraPlugin } from "puppeteer-extra"
import { z } from "zod"
import { LumResponseSchema } from "./schemas"

export type LumResponse = z.infer<typeof LumResponseSchema>

export interface PuppeteerExtraTimezonePlugin extends PuppeteerExtraPlugin {
  readonly trackedPages: TzPageTracker[]
}

export interface TzPageTracker {
  url: string
  tz: string
}

import { PuppeteerExtraPlugin } from "puppeteer-extra"
import { PluginOptions } from "puppeteer-extra-plugin"
import { z } from "zod"
import { LumResponseSchema } from "./schemas"

export type LumResponse = z.infer<typeof LumResponseSchema>

export interface PuppeteerExtraTimezonePlugin extends PuppeteerExtraPlugin {
  ctx: TrackedTimezone | undefined
  tz: string | undefined
}

export interface TrackedTimezone {
  ip: string
  tz: string
  ctx?: LumResponse
}

export interface TimezonePluginOptions extends PluginOptions {
  fallbackTz?: string | string[]
}
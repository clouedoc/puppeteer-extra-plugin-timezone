import { z } from "zod"

/**
 * Define the expected shape of the lumtest response.
 * @type {z.ZodObject}
 */
export const LumResponseSchema = z.object({
  geo: z.object({
    tz: z.string()
  })
})

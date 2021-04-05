import { z } from "zod"

/**
 * Define the expected shape of the lumtest.com response.
 * @type {z.ZodObject}
 */
export const LumResponseSchema = z.object({
  ip: z.string(),
  country: z.string().optional(),
  asn: z.any().optional(),
  geo: z.object({
    city: z.string().optional(),
    region: z.string().optional(),
    region_name: z.string().optional(),
    postal_code: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    tz: z.string()
  })
})

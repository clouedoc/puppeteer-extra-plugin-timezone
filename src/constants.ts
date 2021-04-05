/**
 * Define the plugin name to report to extra.
 * @type {string}
 */
export const PLUGIN_NAME: string = "timezone"

/**
 * Specify primary ip reflection url.
 * @type {string}
 */
export const IP_REFLECTION_URL: string = "https://lumtest.com/myip.json"

/**
 * Define an array of fallback zones to randomly select from.
 * @type {string[]}
 */
export const DEFAULT_FALLBACK_TIMEZONES: string[] = [
  "Eastern Standard Time",
  "Central Standard Time",
  "Mountain Standard Time",
  "Pacific Standard Time"
]

/**
 * The proxy server that will be used for testing.
 *
 * Warning: it has to be located in a location that has a different timezone than your system is using.
 * Otherwise, the testing suite will fail.
 *
 * Note: you can get free proxies that works for testing from webshare.
 * @type {string}
 */
export const TESTING_PROXY_SERVER = "45.95.96.132:8691"

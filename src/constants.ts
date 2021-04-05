export const PLUGIN_NAME: string = "timezone"
export const IP_REFLECTION_URL: string = "https://lumtest.com/myip.json"
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
 * Note: you can get free proxies that works for testing from Webshare.
 */
export const TESTING_PROXY_SERVER = "45.95.96.132:8691"

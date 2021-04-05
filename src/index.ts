/**
 * Export public modules.
 */
export * from "./types"
export * from "./provider"
export * from "./plugin"
export * from "./constants"

/**
 * Export plugin factory as default export.
 * @return {TimezonePlugin}
 */
import { TimezonePlugin } from "./plugin"

export default () => new TimezonePlugin()

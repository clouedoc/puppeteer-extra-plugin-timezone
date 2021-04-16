# puppeteer-extra-plugin-timezone

Sets the correct timezone based in IP geolocation for each page that opens.

The correct timezone is fetched and saved to cache once a `Browser` intance opens. All the pages belonging to it will have their timezone emulated.

For IPs where the timezone can't be detected, a warning will be thrown using the standard `puppeteer-extra` logger.

## Installation

```bash
yarn add puppeteer-extra-plugin-timezone
# or
npm install puppeteer-extra-plugin-timezone
```

## Usage

First of all, you have to register the plugin with `puppeteer-extra`.

JavaScript:

```js
puppeteer.use(require('puppeteer-extra-plugin-timezone')())
```

TypeScript:

```ts
import TimezonePlugin from 'puppeteer-extra-plugin-timezone';
puppeteer.use(TimezonePlugin())
```

You can then use puppeteer as usual:

```javascript
const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.goto('https://whoer.net')
```

## Testing

The tests are defined in `src/plugin.spec.ts`.

1. You need to add a proxy server IP in `src/constants.ts`
2. You can run the tests using either `yarn test` or `npm test`.

## Debugging

You can see the package's logs by setting the `DEBUG=puppeteer-extra-plugin:timezone` env variable.

Example: `DEBUG=puppeteer-extra-plugin:timezone npm test`

### Base Puppeteer-Extra Plugin System

See the core Puppeteer-Extra Plugin docs for additional information:
<https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin>

## Contributing

We appreciate all contributions.

What's needed:

- [ ] Get timezone from other fallback iptest websites

Done:

- [x] Fix memory leak (remove timezone informations on browser disconnect)
- [x] Make it work somehow *(prescience)*
- [x] Specifying a default fallback timezone *(prescience)*
- [x] Sticky per-browser timezone (save the timezone for each browser to avoid unnecessary calls to Lumtest)

## License

MIT

## Resources

- [Puppeteer documentation](https://pptr.dev)
- [Puppeteer-Extra plugin documentation](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin)
- [CDP documentation](https://chromedevtools.github.io/devtools-protocol/)

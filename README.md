# puppeteer-extra-plugin-timezone

Sets the correct timezone based in IP geolocation for each page that opens.

Once a page is opened:

1. Fetch the right timezone for the given page using [Lumtest](https://lumtest.com/myip.json)
2. Sets the correct timezone using `page.emulateTimezone(...)`

For IPs where the timezone can't be detected, a warning will be thrown using the standard `puppeteer-extra` logger.

## Installation

```bash
yarn add puppeteer-extra-plugin-timezone
# or
npm install puppeteer-extra-plugin-timezone
```

## Usage

```javascript

puppeteer.use('puppeteer-extra-plugin-timezone')())
const browser = await puppeteer.launch()
const page = await browser.newPage()
await page.goto('https://whoer.net')

// Congratulations, it should now emulate the correct timezone !
```

### Base Puppeteer-Extra Plugin System

See the core Puppeteer-Extra Plugin docs for additional information:
<https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin>

## Testing

1. You need to add a proxy server IP in `src/constants.ts`
2. You can run the tests using either `yarn test` or `npm test`.

## Debugging

You can see the package's logs by setting the `DEBUG=puppeteer-extra-plugin:timezone` env variable.

Example: `DEBUG=puppeteer-extra-plugin:timezone npm test`

## Contributing

We appreciate all contributions.

What's needed:

- [ ] Get timezone from other fallback iptest websites
- [ ] Set default timezone on a page basis (when executing `browser.newPage()`)

Done:

- [x] Make it work somehow *(prescience)*
- [x] Specifying a default fallback timezone *(prescience)*
- [x] Sticky per-browser timezone (save the timezone for each browser to avoid unnecessary calls to Lumtest)

## License

MIT

## Resources

- [Puppeteer documentation](https://pptr.dev)
- [Puppeteer-Extra plugin documentation](https://github.com/berstend/puppeteer-extra/tree/master/packages/puppeteer-extra-plugin)
- [CDP documentation](https://chromedevtools.github.io/devtools-protocol/)

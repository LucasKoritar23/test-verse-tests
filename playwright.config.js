// @ts-check
const { devices } = require('@playwright/test');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * @see https://playwright.dev/docs/test-configuration
 * @type {import('@playwright/test').PlaywrightTestConfig}
 */

require('dotenv').config();
require('log-timestamp');

const config = {
    testDir: './tests',
    timeout: 90 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 30000
    },
    workers: undefined,
    fullyParallel: true,
    reporter: [
        ['allure-playwright', { outputFolder: 'allure-results' }],
        ['html', { outputFolder: 'reports/playwright-report', open: 'never' }],
        ['list'],
        ['junit', { outputFile: 'reports/junit/results.xml', open: 'never' }]
    ],
    use: {
        ignoreHTTPSErrors: true
    }
};
module.exports = config;
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { SuiteClient } = require('../clients/suiteClient');
const { Contract } = require('../../../helpers/contract');
const { ExamplesConvert } = require('../../../helpers/examplesConvert');

test.describe('Validate GET Suite API @allGetSuite @testVerse @crudSuite', () => {
    test('Should show all suites @getSuite', async ({ request }) => {
        const suiteClient = new SuiteClient(request);
        await suiteClient.getAllSuites();
    });

    test('Should show filter by ID suite @getSuiteByID', async ({ request }) => {
        const suiteClient = new SuiteClient(request);
        const apiResponse = await suiteClient.createSuite()
        const idSuite = apiResponse.apiResponse.id_suite
        await suiteClient.getSuiteByID(idSuite);
    });

    const recordsPostSuite = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesGetSuite.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPostSuite) {
        test(`Should validate show suite filled in the field ${record.field} with the value ${record.value} @getSuite @exploratorGetSuiteByID`, async ({ request }) => {
            const suiteClient = new SuiteClient(request);
            const idSuite = new ExamplesConvert().transformData(record.value);
            await (await suiteClient.getSuiteByID(idSuite, parseInt(record.code))).apiResponse;
        });
    }
});
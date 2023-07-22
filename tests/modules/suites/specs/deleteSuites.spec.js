const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { SuiteClient } = require('../clients/suiteClient');
const { Contract } = require('../../../helpers/contract');
const { ExamplesConvert } = require('../../../helpers/examplesConvert');

test.describe('Validate DELETE Suite API @deleteSuite @testVerse @crudSuite', () => {
    test('Should delete suite by Id @deleteSuiteByID', async ({ request }) => {
        const suiteClient = new SuiteClient(request);
        const apiResponse = await suiteClient.createSuite()
        const idSuite = apiResponse.apiResponse.id_suite
        await suiteClient.deleteSuiteByID(idSuite);
    });

    const recordsPostSuite = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesDeleteSuiteID.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPostSuite) {
        test(`Should validate delete suite filled in the field ${record.field} with the value ${record.value} @deleteSuite @exploratoryDeleteSuiteByID`, async ({ request }) => {
            const suiteClient = new SuiteClient(request);
            const idSuite = new ExamplesConvert().transformData(record.value);
            await (await suiteClient.deleteSuiteByID(idSuite, parseInt(record.code))).apiResponse;
        });
    }
});
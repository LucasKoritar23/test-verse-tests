const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { TestCasesClient } = require('../clients/testCasesClient');
const { Contract } = require('../../../helpers/contract');
const { ExamplesConvert } = require('../../../helpers/examplesConvert');

test.describe('Validate DELETE Test Case API @deleteTestCase @testVerse @crudTestCase', () => {
    test('Should delete test case by Id @deleteTestCaseByID', async ({ request }) => {
        const testCaseClient = new TestCasesClient(request);
        const apiResponse = await testCaseClient.createTestCase()
        const idTestCase = apiResponse.apiResponse.id_teste
        await testCaseClient.deleteTestCaseByID(idTestCase);
    });

    const recordsDeleteTestCase = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesDeleteTestCase.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsDeleteTestCase) {
        test(`Should validate delete test case filled in the field ${record.field} with the value ${record.value} @deleteTestCase @exploratoryDeleteTestCaseByID`, async ({ request }) => {
            const testCaseClient = new TestCasesClient(request);
            const idTestCase = new ExamplesConvert().transformData(record.value);
            await (await testCaseClient.deleteTestCaseByID(idTestCase, parseInt(record.code))).apiResponse;
        });
    }
});
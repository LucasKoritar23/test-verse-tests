const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { TestCasesClient } = require('../clients/testCasesClient');
const { Contract } = require('../../../helpers/contract');
const { ExamplesConvert } = require('../../../helpers/examplesConvert');

test.describe('Validate GET Test Cases API @allGetTestCases @testVerse @crudTestCase', () => {
    test('Should show all suites @getSuite', async ({ request }) => {
        const testCaseClient = new TestCasesClient(request);
        await testCaseClient.getAllTestCases();
    });

    test('Should show filter by ID test case @getTestCaseByID', async ({ request }) => {
        const testCaseClient = new TestCasesClient(request);
        const apiResponse = await testCaseClient.createTestCase()
        const idTestCase = apiResponse.apiResponse.id_teste
        await testCaseClient.getTestCaseByID(idTestCase);
    });

    const recordsGetTestCases = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesGetTestCase.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsGetTestCases) {
        test(`Should validate show test cases filled in the field ${record.field} with the value ${record.value} @getTestCase @exploratorGetTestCaseByID`, async ({ request }) => {
            const testCaseClient = new TestCasesClient(request);
            const idTestCase = new ExamplesConvert().transformData(record.value);
            await (await testCaseClient.getTestCaseByID(idTestCase, parseInt(record.code))).apiResponse;
        });
    }
});
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { ApiUtils } = require('../../../helpers/apiUtils');
const { Contract } = require('../../../helpers/contract');
const { TestCasesClient } = require('../clients/testCasesClient');
const { SuiteClient } = require('../../suites/clients/suiteClient');

test.describe('Validate POST test-cases API @allPostTestCases @testVerse @crudTestCases', () => {
    test('Should create test-cases @postTestCases', async ({ request }) => {
        const suiteClient = new SuiteClient(request);
        const apiResponse = (await suiteClient.createSuite()).apiResponse
        const suiteId = apiResponse.id_suite
        const testCases = new TestCasesClient(request);
        const payload = require('../mocks/postTestCases').payloadPostTestCases(suiteId);
        const reqTestCases = (await testCases.postTestCases(payload, 201)).apiResponse
        new Contract().validateContract(reqTestCases, path.join(__dirname, '../schemas/postTestCases.json'));
    });

    const recordsPosTestCase = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesPostTestCase.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPosTestCase) {
        test(`Should validate create test-case filled in the field ${record.field} with the value ${record.value} @postTestCase @exploratoryPostTestCase`, async ({ request }) => {
            const suiteClient = new SuiteClient(request);
            const apiUtils = new ApiUtils();
            const apiResponse = (await suiteClient.createSuite()).apiResponse
            const suiteId = apiResponse.id_suite
            const testCases = new TestCasesClient(request);
            const originalPayload = require('../mocks/postTestCases').payloadPostTestCases(suiteId);
            const payload = await apiUtils.payloadExploratoryReturn(JSON.parse(originalPayload), record);
            await (await testCases.postTestCases(payload, parseInt(record.code))).apiResponse;
        });
    }
});

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { ApiUtils } = require('../../../helpers/apiUtils');
const { Contract } = require('../../../helpers/contract');
const { TestCasesClient } = require('../clients/testCasesClient');

test.describe('Validate PUT test-cases API @allPutTestCases @testVerse @crudTestCases', () => {
    let suiteId;
    let testCaseId;

    test.beforeEach(async ({ request }) => {
        const testCase = new TestCasesClient(request);
        const reqCrateTestCase = await testCase.createTestCase(null, 201);
        suiteId = reqCrateTestCase.apiResponse.id_suite
        testCaseId = reqCrateTestCase.apiResponse.id_teste
    });

    test('Should edit test-cases @putTestCases', async ({ request }) => {
        const testCases = new TestCasesClient(request);
        const payload = require('../mocks/putTestCases').payloadPutTestCases(suiteId);
        const reqPutTestCases = (await testCases.putTestCases(testCaseId, payload, 200)).apiResponse
        new Contract().validateContract(reqPutTestCases, path.join(__dirname, '../schemas/putTestCases.json'));
    });

    const recordsPutTestCase = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesPutTestCase.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPutTestCase) {
        test(`Should validate edit test-case filled in the field ${record.field} with the value ${record.value} @putTestCase @exploratoryPutTestCase`, async ({ request }) => {
            const apiUtils = new ApiUtils();
            const testCases = new TestCasesClient(request);
            const originalPayload = require('../mocks/putTestCases').payloadPutTestCases(suiteId);
            const payload = await apiUtils.payloadExploratoryReturn(JSON.parse(originalPayload), record);
            await (await testCases.putTestCases(testCaseId, payload, parseInt(record.code))).apiResponse;
        });
    }
});

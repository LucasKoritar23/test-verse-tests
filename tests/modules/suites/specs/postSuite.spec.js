const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { SuiteClient } = require('../clients/suiteClient');
const { ApiUtils } = require('../../../helpers/apiUtils');
const { Contract } = require('../../../helpers/contract');

test.describe('Validate POST Suite API @allPostSuite @testVerse @crudSuite', () => {
    test('Should create suite @postSuite', async ({ request }) => {
        const suiteClient = new SuiteClient(request);
        const reqPostSuite = (await suiteClient.createSuite()).apiResponse
        new Contract().validateContract(reqPostSuite, path.join(__dirname, '../schemas/postSuiteDefault.json'));
    });

    test('Should create suite with basic Payload @postSuiteBasicPayload', async ({ request }) => {
        const suiteClient = new SuiteClient(request);
        const payload = require('../mocks/postSuite').payloadPostSuite();
        const reqPostSuite = (await suiteClient.postSuite(payload, 201)).apiResponse
        new Contract().validateContract(reqPostSuite, path.join(__dirname, '../schemas/postSuiteDefault.json'));
    });

    const recordsPostSuite = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesPostSuite.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPostSuite) {
        test(`Should validate create suite filled in the field ${record.field} with the value ${record.value} @postSuite @exploratoryPostSuite`, async ({ request }) => {
            const apiUtils = new ApiUtils();
            const suiteClient = new SuiteClient(request);
            const originalPayload = require('../mocks/postSuite').payloadPostSuite();
            const payload = await apiUtils.payloadExploratoryReturn(JSON.parse(originalPayload), record);
            await (await suiteClient.postSuite(payload, parseInt(record.code))).apiResponse;
        });
    }
});

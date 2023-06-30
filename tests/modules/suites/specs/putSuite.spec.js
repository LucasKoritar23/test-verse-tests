const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { SuiteClient } = require('../clients/suiteClient');
const { ApiUtils } = require('../../../helpers/apiUtils');
const { ExamplesConvert } = require('../../../helpers/examplesConvert');

test.describe('Validate PUT Suite API @allPutSuite @testVerse @crudSuite', () => {
    let idSuite;

    test.beforeAll(async ({ request }) => {
        const suiteClient = new SuiteClient(request);
        const apiResponse = await suiteClient.createSuite()
        idSuite = apiResponse.apiResponse.id_suite
    });

    test('Should edit suite @putSuite', async ({ request }) => {
        const suiteClient = new SuiteClient(request);
        await suiteClient.editSuite(idSuite);
    });

    const recordsPutSuite = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesPutSuite.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPutSuite) {
        test(`Should validate edit suite filled in the field ${record.field} with the value ${record.value} @putSuite @exploratoryPutSuite`, async ({ request }) => {
            const apiUtils = new ApiUtils();
            const suiteClient = new SuiteClient(request);

            const originalPayload = require('../mocks/putSuite').payloadPutSuite();
            const payload = await apiUtils.payloadExploratoryReturn(JSON.parse(originalPayload), record);
            await (await suiteClient.putSuite(idSuite, payload, parseInt(record.code))).apiResponse;
        });
    }

    const recordsPutSuiteID = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesPutSuiteID.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPutSuiteID) {
        test(`Should validate edit suite ID filled in the field ${record.field} with the value ${record.value} @putSuiteValidateID @exploratoryPutSuiteID`, async ({ request }) => {
            const apiUtils = new ApiUtils();
            const suiteClient = new SuiteClient(request);
            const suiteId = new ExamplesConvert().transformData(record.value);
            await suiteClient.editSuite(suiteId, null, parseInt(record.code));
        });
    }
});

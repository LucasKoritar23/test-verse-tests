const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { ApiUtils } = require('../../../helpers/apiUtils');
const { StepsClient } = require('../clients/stepsClient');
const { Contract } = require('../../../helpers/contract');

test.describe('Validate PUT steps API @allPutSteps @testVerse @crudStep', () => {
    let suiteId;
    let testCaseId;
    let stepId;

    test.beforeAll(async ({ request }) => {
        const stepsClient = new StepsClient(request);
        const reqCreateStep = await stepsClient.createStep();
        suiteId = reqCreateStep.apiResponse.id_suite;
        testCaseId = reqCreateStep.apiResponse.id_test_case;
        stepId = reqCreateStep.apiResponse.id_test_step;
    });

    test('Should edit steps @putSteps', async ({ request }) => {
        const stepsClient = new StepsClient(request);
        const payloadPutSteps = require('../mocks/putSteps').payloadPutSteps(suiteId, testCaseId);
        const reqPutStep = await stepsClient.putSteps(stepId, payloadPutSteps, 200);
        new Contract().validateContract(reqPutStep.apiResponse, path.join(__dirname, '../schemas/putStep.json'));
    });

    const recordsPostSteps = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesPutSteps.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPostSteps) {
        test(`Should validate edit steps filled in the field ${record.field} with the value ${record.value} @putSteps @exploratoryPutSteps`, async ({ request }) => {
            const apiUtils = new ApiUtils();
            const stepsClient = new StepsClient(request);
            const orignalPayloadPutSteps = require('../mocks/putSteps').payloadPutSteps(suiteId, testCaseId);
            const payload = await apiUtils.payloadExploratoryReturn(JSON.parse(orignalPayloadPutSteps), record);
            await stepsClient.putSteps(stepId, payload, parseInt(record.code));
        });
    }
});

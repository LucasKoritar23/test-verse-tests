const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { ApiUtils } = require('../../../helpers/apiUtils');
const { StepsClient } = require('../clients/stepsClient');
const { TestCasesClient } = require('../../test-cases/clients/testCasesClient');
const { Contract } = require('../../../helpers/contract');

test.describe('Validate POST steps API @allPostSteps @testVerse @crudStep', () => {
    let suiteId;
    let testCaseId;

    test.beforeAll(async ({ request }) => {
        const stepsClient = new StepsClient(request);
        const reqCreateStep = await stepsClient.createStep();
        suiteId = reqCreateStep.apiResponse.id_suite;
        testCaseId = reqCreateStep.apiResponse.id_test_case;
    });

    test('Should create steps @postSteps', async ({ request }) => {
        const stepsClient = new StepsClient(request);
        const payloadPostSteps = require('../mocks/postSteps').payloadPostSteps(suiteId, testCaseId);
        const reqCreateStep = await stepsClient.postSteps(payloadPostSteps, 201);
        new Contract().validateContract(reqCreateStep.apiResponse, path.join(__dirname, '../schemas/postStep.json'));
    });

    const recordsPostSteps = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesPostSteps.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsPostSteps) {
        test(`Should validate create steps filled in the field ${record.field} with the value ${record.value} @postSteps @exploratoryPostSteps`, async ({ request }) => {
            const apiUtils = new ApiUtils();
            const stepsClient = new StepsClient(request);
            const orignalPayloadPostSteps = require('../mocks/postSteps').payloadPostSteps(suiteId, testCaseId);
            const payload = await apiUtils.payloadExploratoryReturn(JSON.parse(orignalPayloadPostSteps), record);
            await stepsClient.postSteps(payload, parseInt(record.code));
        });
    }
});

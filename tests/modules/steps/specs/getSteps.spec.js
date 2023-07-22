const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { Contract } = require('../../../helpers/contract');
const { ExamplesConvert } = require('../../../helpers/examplesConvert');
const { StepsClient } = require('../clients/stepsClient');

test.describe('Validate GET steps API @allGetSteps @testVerse @crudStep', () => {
    test('Should show all steps @getSteps', async ({ request }) => {
        const stepsClient = new StepsClient(request);
        await stepsClient.getAllSteps(200);
    });

    test('Should show steps by Id @getStepsByID', async ({ request }) => {
        const stepsClient = new StepsClient(request);
        const reqCreateStep = await stepsClient.createStep();
        const stepId = reqCreateStep.apiResponse.id_test_step;
        await stepsClient.getStepsByID(stepId, 200);
    });

    test('Should show steps by Name @getStepsByName', async ({ request }) => {
        const stepsClient = new StepsClient(request);
        const reqCreateStep = await stepsClient.createStep();
        const stepName = reqCreateStep.apiResponse.nome_step;
        await stepsClient.getStepsByName(stepName, 200);
    });

    test('Should show steps by TestCaseID @getStepsByTestCaseID', async ({ request }) => {
        const stepsClient = new StepsClient(request);
        const reqCreateStep = await stepsClient.createStep();
        const testCaseID = reqCreateStep.apiResponse.id_test_case;
        await stepsClient.getStepsByTestCaseID(testCaseID, 200);
    });

    const recordsGetStepsById = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesGetStepsID.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsGetStepsById) {
        test(`Should validate GET step by ID filled in the field ${record.field} with the value ${record.value} @getStepByID @exploratoryGetStepByID`, async ({ request }) => {
            const stepsClient = new StepsClient(request);
            const stepId = new ExamplesConvert().transformData(record.value);
            await stepsClient.getStepsByID(stepId, parseInt(record.code));
        });
    }

    const recordsGetStepsByName = parse(fs.readFileSync(path.join(__dirname, '../examples/examplestGetStepsName.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsGetStepsByName) {
        test(`Should validate GET step by Name filled in the field ${record.field} with the value ${record.value} @getStepByName @exploratoryGetStepByName`, async ({ request }) => {
            const stepsClient = new StepsClient(request);
            const stepName = new ExamplesConvert().transformData(record.value);
            await stepsClient.getStepsByName(stepName, parseInt(record.code));
        });
    }

    const recordsGetStepsByTestCaseId = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesGetStepsByTestCaseId.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsGetStepsByTestCaseId) {
        test(`Should validate GET step by testCaseId filled in the field ${record.field} with the value ${record.value} @getStepByTestCaseId @exploratoryGetStepByTestCaseId`, async ({ request }) => {
            const stepsClient = new StepsClient(request);
            const stepsByTestCaseId = new ExamplesConvert().transformData(record.value);
            await stepsClient.getStepsByTestCaseID(stepsByTestCaseId, parseInt(record.code));
        });
    }
});
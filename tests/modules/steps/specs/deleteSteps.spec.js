const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { Contract } = require('../../../helpers/contract');
const { StepsClient } = require('../clients/stepsClient');
const { ExamplesConvert } = require('../../../helpers/examplesConvert');

test.describe('Validate DELETE Steps API @deleteStep @testVerse @crudStep', () => {
    test('Should delete step by Id @deleteTestCaseByID', async ({ request }) => {
        const stepsClient = new StepsClient(request);
        const reqCreateStep = await stepsClient.createStep();
        const stepId = reqCreateStep.apiResponse.id_test_step;
        await stepsClient.deleteStepsByID(stepId, 200);
    });

    const recordsDeleteTestCase = parse(fs.readFileSync(path.join(__dirname, '../examples/examplesDeleteStepsID.csv')), {
        columns: true,
        skip_empty_lines: false
    });

    for (const record of recordsDeleteTestCase) {
        test(`Should validate delete step filled in the field ${record.field} with the value ${record.value} @deleteStep @exploratoryDeleteStepByID`, async ({ request }) => {
            const stepsClient = new StepsClient(request);
            const stepId = new ExamplesConvert().transformData(record.value);
            await stepsClient.deleteStepsByID(stepId, parseInt(record.code));
        });
    }
});
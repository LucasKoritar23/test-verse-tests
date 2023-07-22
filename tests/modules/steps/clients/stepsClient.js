const { expect } = require("@playwright/test");
const { SuiteClient } = require("../../suites/clients/suiteClient");
const { TestCasesClient } = require("../../test-cases/clients/testCasesClient");

class StepsClient {
    /**
   * @param {import('playwright').APIRequest} request
   */

    constructor(request) {
        this.request = request;
        this.baseUri = process.env.URI_API;
        this.basePath = '/test-steps'
    }

    headers() {
        return JSON.stringify({
            "Content-Type": "application/json"
        });
    }

    async postSteps(payload, statusCode = 201) {
        const uri = this.baseUri + this.basePath;
        console.log(`Starting Request POST: ${this.basePath}`);
        console.log("Uri: " + uri);
        console.log("Payload: " + payload);
        const apiRequest = await this.request.post(uri, {
            data: JSON.parse(payload),
            headers: JSON.parse(this.headers()),
        });
        const apiResponse = await apiRequest.json();
        console.log(`Response ${[this.basePath]}: `);
        console.log(apiResponse);
        console.log(`StatusCode ${this.basePath}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { "apiResponse": apiResponse, "payloadSended": payload }
    }

    async putSteps(stepId, payload, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/${stepId}`;
        console.log(`Starting Request PUT: ${this.basePath}`);
        console.log("Uri: " + uri);
        console.log("Payload: " + payload);
        const apiRequest = await this.request.put(uri, {
            data: JSON.parse(payload),
            headers: JSON.parse(this.headers()),
        });
        const apiResponse = await apiRequest.json();
        console.log(`Response ${[this.basePath]}: `);
        console.log(apiResponse);
        console.log(`StatusCode ${this.basePath}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { "apiResponse": apiResponse, "payloadSended": payload }
    }

    async getAllSteps(statusCode = 200) {
        const uri = this.baseUri + this.basePath;
        console.log(`Starting Request GET: ${this.basePath}`);
        console.log("Uri: " + uri);
        const apiRequest = await this.request.get(uri, {
            headers: JSON.parse(this.headers()),
        });
        const apiResponse = await apiRequest.json();
        console.log(`Response ${[this.basePath]}: `);
        console.log(apiResponse);
        console.log(`StatusCode ${this.basePath}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { "apiResponse": apiResponse, "payloadSended": null }
    }

    async getStepsByID(stepId, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/id/${stepId}`;
        console.log(`Starting Request GET by ID: ${this.basePath}`);
        console.log("Uri: " + uri);
        const apiRequest = await this.request.get(uri, {
            headers: JSON.parse(this.headers()),
        });
        const apiResponse = await apiRequest.json();
        console.log(`Response ${[this.basePath]}: `);
        console.log(apiResponse);
        console.log(`StatusCode ${this.basePath}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { "apiResponse": apiResponse, "payloadSended": null }
    }

    async getStepsByName(stepName, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/name/${stepName}`;
        console.log(`Starting Request GET by ID: ${this.basePath}`);
        console.log("Uri: " + uri);
        const apiRequest = await this.request.get(uri, {
            headers: JSON.parse(this.headers()),
        });
        const apiResponse = await apiRequest.json();
        console.log(`Response ${[this.basePath]}: `);
        console.log(apiResponse);
        console.log(`StatusCode ${this.basePath}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { "apiResponse": apiResponse, "payloadSended": null }
    }

    async getStepsByTestCaseID(testCaseID, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/test/${testCaseID}`;
        console.log(`Starting Request GET by ID: ${this.basePath}`);
        console.log("Uri: " + uri);
        const apiRequest = await this.request.get(uri, {
            headers: JSON.parse(this.headers()),
        });
        const apiResponse = await apiRequest.json();
        console.log(`Response ${[this.basePath]}: `);
        console.log(apiResponse);
        console.log(`StatusCode ${this.basePath}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { "apiResponse": apiResponse, "payloadSended": null }
    }

    async deleteStepsByID(stepId, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/${stepId}`;
        console.log(`Starting Request GET by ID: ${this.basePath}`);
        console.log("Uri: " + uri);
        const apiRequest = await this.request.delete(uri, {
            headers: JSON.parse(this.headers()),
        });
        const apiResponse = await apiRequest.json();
        console.log(`Response ${[this.basePath]}: `);
        console.log(apiResponse);
        console.log(`StatusCode ${this.basePath}: ` + apiRequest.status());
        expect(apiRequest.status()).toEqual(statusCode);
        return { "apiResponse": apiResponse, "payloadSended": null }
    }
    async createStep() {
        const testCasesClient = new TestCasesClient(this.request);
        const reqCreateTestCase = await (await testCasesClient.createTestCase(null, 201)).apiResponse;

        const suiteId = reqCreateTestCase.id_suite;
        const testCaseId = reqCreateTestCase.id_teste;

        const payloadPostSteps = require('../mocks/postSteps').payloadPostSteps(suiteId, testCaseId);
        return await this.postSteps(payloadPostSteps, 201);
    }

}

module.exports = { StepsClient };
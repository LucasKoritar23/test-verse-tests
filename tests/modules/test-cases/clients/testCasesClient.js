const { expect } = require("@playwright/test");
const { SuiteClient } = require("../../suites/clients/suiteClient");

class TestCasesClient {
    /**
   * @param {import('playwright').APIRequest} request
   */

    constructor(request) {
        this.request = request;
        this.baseUri = process.env.URI_API;
        this.basePath = '/test-cases'
    }

    headers() {
        return JSON.stringify({
            "Content-Type": "application/json"
        });
    }

    async postTestCases(payload, statusCode = 201) {
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

    async putTestCases(testCaseId, payload, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/${testCaseId}`;
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

    async getAllTestCases(statusCode = 200) {
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

    async getTestCaseByID(idTestCase, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/${idTestCase}`;
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

    async createTestCase(payload = null, statusCode = 201) {
        const suiteClient = new SuiteClient(this.request);
        const reqCreateSuite = await suiteClient.createSuite(null, statusCode)
        const suiteId = JSON.parse(JSON.stringify(reqCreateSuite)).apiResponse.id_suite

        if (payload == null) {
            const payloadFile = require("../mocks/postTestCases");
            payload = payloadFile.payloadPostTestCases(suiteId);
        }

        return await this.postTestCases(payload, statusCode)
    }
    
}

module.exports = { TestCasesClient };
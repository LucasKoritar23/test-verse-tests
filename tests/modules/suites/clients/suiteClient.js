const { expect } = require("@playwright/test");

class SuiteClient {
    /**
   * @param {import('playwright').APIRequest} request
   */

    constructor(request) {
        this.request = request;
        this.baseUri = process.env.URI_API;
        this.basePath = '/suites'
    }

    headers() {
        return JSON.stringify({
            "Content-Type": "application/json"
        });
    }

    async postSuite(payload, statusCode = 201) {
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

    async putSuite(idSuite, payload, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/${idSuite}`;
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

    async getSuiteByID(idSuite, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/${idSuite}`;
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

    async deleteSuiteByID(idSuite, statusCode = 200) {
        const uri = this.baseUri + this.basePath + `/${idSuite}`;
        console.log(`Starting Request DELETE by ID: ${this.basePath}`);
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

    async getAllSuites(statusCode = 200) {
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

    async createSuite(payload = null, statusCode = 201) {
        if (payload == null) {
            const payloadFile = require("../mocks/postSuite");
            payload = payloadFile.payloadPostSuite();
        }
        return await this.postSuite(payload, statusCode)
    }

    async editSuite(suiteId, payload = null, statusCode = 200) {
        if (payload == null) {
            const payloadFile = require("../mocks/putSuite");
            payload = payloadFile.payloadPutSuite();
        }
        return await this.putSuite(suiteId, payload, statusCode)
    }
}

module.exports = { SuiteClient };
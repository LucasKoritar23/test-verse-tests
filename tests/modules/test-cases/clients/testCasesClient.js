const { expect } = require("@playwright/test");

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
}

module.exports = { TestCasesClient };
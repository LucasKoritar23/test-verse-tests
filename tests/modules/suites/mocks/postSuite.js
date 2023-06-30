const { DataFaker } = require('../../../helpers/dataFaker');
const { faker } = require('@faker-js/faker');

function defaultCompletePayload() {
    const dataFaker = new DataFaker()
    return JSON.stringify({
        "nomeSuite": `PW Test ${dataFaker.getFullName()} ${dataFaker.getCompanyName()}`,
        "statusUltimaExec": null,
        "statusAtual": "new"
    });
}

function basicPayloadPostSuite() {
    const dataFaker = new DataFaker()
    return JSON.stringify({
        "nomeSuite": `PW Test ${dataFaker.getFullName()} ${dataFaker.getCompanyName()}`
    });
}

function payloadPostSuite() {
    return defaultCompletePayload();
}

module.exports = { payloadPostSuite, basicPayloadPostSuite };
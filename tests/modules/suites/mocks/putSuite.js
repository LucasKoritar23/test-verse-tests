const { DataFaker } = require('../../../helpers/dataFaker');
const { faker } = require('@faker-js/faker');

function defaultCompletePayload() {
    const dataFaker = new DataFaker()
    return JSON.stringify({
        "nomeSuite": `PW Test ${dataFaker.getFullName()} ${dataFaker.getCompanyName()} Edited`,
        "statusUltimaExec": null,
        "statusAtual": "new"
    });
}

function payloadPutSuite() {
    return defaultCompletePayload();
}

module.exports = { payloadPutSuite };
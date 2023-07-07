const { DataFaker } = require('../../../helpers/dataFaker');
const { faker } = require('@faker-js/faker');

function payloadPostTestCases(suiteId = null) {
    const dataFaker = new DataFaker()
    return JSON.stringify({
        "nomeTeste": `Validar o teste ${dataFaker.getFullName()}`,
        "ultimaExec": dataFaker.getCurrentDate('yyyy-MM-DDTH:m:s'),
        "statusUltimaExec": null,
        "idSuite": suiteId,
        "statusAtual": "new",
        "zipEvidencia": "/algum-caminho-aqui",
        "nomeExecutor": "Lucas Koritar"
    });
}

module.exports = { payloadPostTestCases };
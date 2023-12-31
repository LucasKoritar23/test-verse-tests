const { DataFaker } = require('../../../helpers/dataFaker');
const { faker } = require('@faker-js/faker');

function payloadPutTestCases(suiteId = null) {
    const dataFaker = new DataFaker()
    return JSON.stringify({
        "nomeTeste": `Validar o teste ${dataFaker.getFullName()} Edited`,
        "ultimaExec": dataFaker.getCurrentDate('yyyy-MM-DDTHH:mm:ss'),
        "statusUltimaExec": null,
        "idSuite": suiteId,
        "statusAtual": "new",
        "zipEvidencia": "/algum-caminho-aqui",
        "nomeExecutor": "Lucas Koritar"
    });
}

module.exports = { payloadPutTestCases };
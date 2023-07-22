const { DataFaker } = require('../../../helpers/dataFaker');
const { faker } = require('@faker-js/faker');

function payloadPutSteps(suiteId = null, testCaseId = null) {
  const dataFaker = new DataFaker()
  return JSON.stringify({
    "nomeStep": `Validar o preenchimento do campo nome completo com o valor ${dataFaker.getFullName()} edited`,
    "ultimaExec": dataFaker.getCurrentDate('yyyy-MM-DDTHH:mm:ss'),
    "statusUltimaExec": "new",
    "idSuite": suiteId,
    "idTestCase": testCaseId,
    "statusAtual": "running",
    "nomeExecutor": dataFaker.getFullName()
  });

}

module.exports = { payloadPutSteps };
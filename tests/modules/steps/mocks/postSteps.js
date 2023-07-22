const { DataFaker } = require('../../../helpers/dataFaker');
const { faker } = require('@faker-js/faker');

function payloadPostSteps(suiteId = null, testCaseId = null) {
  const dataFaker = new DataFaker()
  return JSON.stringify({
    "nomeStep": `Validar o preenchimento do campo nome completo com o valor ${dataFaker.getFullName()}`,
    "ultimaExec": dataFaker.getCurrentDate('yyyy-MM-DDTHH:mm:ss'),
    "statusUltimaExec": "new",
    "idSuite": suiteId,
    "idTestCase": testCaseId,
    "statusAtual": "new",
    "nomeExecutor": dataFaker.getFullName()
  });

}

module.exports = { payloadPostSteps };
class ApiUtils {
  async payloadExploratoryReturn(payload, record) {
    const { ExamplesConvert } = require("../helpers/examplesConvert");
    if (record.field.includes(".")) {
      const objects = record.field.split(".");
      payload[objects[0]][objects[1]][objects[2]] =
        new ExamplesConvert().transformData(record.value);
    } else {
      payload[record.field] = new ExamplesConvert().transformData(record.value);
    }
    return JSON.stringify(payload);
  }

  async decodeJWT(token) {
    const jwt = require("jsonwebtoken");
    const options = {
      complete: true,
    };

    const tokenWithoutBearer = token.split("Bearer ")[1];
    const decoded = jwt.decode(tokenWithoutBearer, options);
    return decoded["payload"];
  }
}

module.exports = { ApiUtils };

const { expect } = require('@playwright/test');

class Contract {
    validateContract(res, schemaFile) {
        let Validator = require('jsonschema').Validator;
        let v = new Validator();
        let path = require('path');
        let fs = require('fs');
        let schema = fs.readFileSync(path.resolve(__dirname, schemaFile));
        let schemaParsed = JSON.parse(schema);
        v.addSchema(schemaParsed, '');

        try {
            console.log('Starting API Contract Validation');
            console.log('Contract name to be validated: ', schemaFile);
            expect(v.validate(res, schemaParsed).errors).toEqual([]);
            console.log('Successfully validated contract');
        } catch (error) {
            console.error('Contract validation error: ', error);
            throw error;
        }
    }
}

module.exports = { Contract };
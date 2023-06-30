const { DataFaker } = require('../helpers/dataFaker');
const { faker } = require('@faker-js/faker');
class ExamplesConvert {
    constructor() {
    }

    transformData(value) {
        switch (value) {
            case "":
                return "";
            case "negativeNumberInt":
                return -1;
            case "negativeNumberFloat":
                return -1.0;
            case 'randomFloat':
                let min = 0.01;
                let max = 9999.99;
                let random = (Math.random() * (max - min) + min).toFixed(2);
                return JSON.parse(random);
            case value.match(/.randomNumbers/)?.input:
                let numbers = null;
                parseInt(value.split('.')[0]) > 15 ? numbers = faker.random.numeric(value.split('.')[0]).toString() : numbers = Number(faker.random.numeric(value.split('.')[0]));
                return numbers;
            // return new DataFaker().getRandomNumber(value.split('.')[0]);
            case value.match(/.stringNumbers/)?.input:
                return faker.random.numeric(value.split('.')[0]).toString();
            case value.match(/.stringValue/)?.input:
                let charsNumber = value.split('.')[0];
                let numCharsCreate = parseInt(charsNumber);
                let stringValue = '';
                let characters = 'abcdefghijklmnopqrstuvwxyz';
                for (var i = 0; i < numCharsCreate; i++) {
                    stringValue += characters.charAt(Math.floor(Math.random() * characters.length));
                }
                return stringValue;
            default:
                try {
                    return JSON.parse(value);
                } catch (error) {
                    return value;
                }
        }
    }
}

module.exports = { ExamplesConvert };
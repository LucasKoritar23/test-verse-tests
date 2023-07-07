const { faker } = require('@faker-js/faker');

class DataFaker {
    constructor() {
    }

    getFirstName(gender = null) {
        const genders = ['female', 'male'];
        gender == null ? gender = genders[Math.floor(Math.random() * genders.length)] : gender
        return faker.name.firstName(gender);
    }

    getUUID() {
        const uuid = require('uuid');
        return uuid.v4();
    }

    getLastName() {
        //remove replace later
        return faker.name.lastName().replace(/['"]+/g, '');
    }

    getCompanyName() {
        //remove replace later
        return faker.company.name().replace(/['"]+/g, '');
    }

    getFullName(gender = null) {
        const genders = ['female', 'male'];
        gender == null ? gender = genders[Math.floor(Math.random() * genders.length)] : gender
        return this.getFirstName(gender) + " " + this.getLastName().replace(/['"]+/g, '');
    }

    getEmail(completeName = null) {
        let numbers = this.getTimestamp();
        if (completeName == null) {
            return faker.internet.email('', `${numbers}`).toLowerCase();
        }
        else {
            return faker.internet.email('', completeName[1].toLowerCase() + `${numbers}`).toLowerCase();
        }
    }

    getPassword(characters) {
        return faker.internet.password(characters);
    }

    getNumberFloat() {
        return faker.datatype.float({ min: 50, max: 100 });
    }

    getTimestamp() {
        return Date.now();
    }

    getRandomNumber(max) {
        return faker.datatype.number({ min: 1, max: max });
    }

    getCurrentDate(format) {
        const moment = require('moment');
        return moment(new Date()).format(format);
    }
}

module.exports = { DataFaker };
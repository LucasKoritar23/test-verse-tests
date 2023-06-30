class JsonUtils {
    sortInAlphabetical(json) {
        const sortedKeys = Object.keys(json).sort();

        const sortedJson = {};

        for (const key of sortedKeys) {
            sortedJson[key] = json[key];
        }

        return sortedJson
    }
}

module.exports = { JsonUtils };

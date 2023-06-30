const { Pool } = require('pg');

class PostgreSQLClient {
    constructor(user, host, database, password, port) {
        console.log('Starting Connection Database');
        this.pool = new Pool({
            user: user,
            host: host,
            database: database,
            password: password,
            port: port,
        });
    }

    async queryExecute(query) {
        try {
            console.log('Starting database search');
            const result = await this.pool.query(query);
            console.log('Database search completed');
            return result.rows;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async close() {
        console.log('Finishing Connection Database');
        await this.pool.end();
    }
}

module.exports = { PostgreSQLClient };
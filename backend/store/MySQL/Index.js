const pool = require('./Connection');

class MySQL {
    static instance;

    static getInstance() {
        if (!MySQL.instance) {
            MySQL.instance = new MySQL();
        }
        return MySQL.instance;
    }

    constructor() {
        this.pool = pool;
        this.executeQuery = this.executeQuery.bind(this);
    }

    /**
     * @param {string} query - The query to execute.
     * @returns {Array} The result of the query.
     */

    async executeQuery(query, values) {
        const time1 = new Date().getTime();
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err, connection) => {
                if (err) {
                    console.error('Error getting connection:', err);
                    reject(err);
                } else {
                    connection.query(query, values, (error, results, fields) => {
                        connection.release();
                        if (error) {
                            console.error('Error executing query:', error);
                            reject(error);
                        } else {
                            const time2 = new Date().getTime();
                            console.log('Time to execute query mysql:', time2 - time1, 'ms');
                            resolve(results);
                        }
                    });
                }
            });
        });
    }
}

module.exports = MySQL;
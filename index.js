var mysql = require("mysql");
var Rx = require("rxjs/Rx");

class SQLService {

    constructor(dbConfig) {
        //SQLService.sharedPool = mysql.createPool(dbConfig);
        if(!SQLService.sharedPool) {
            SQLService.sharedPool = mysql.createPool(dbConfig);
        }
    }

    releasePool(query) {
        const promise = new Promise((resolve, reject) => {
            SQLService.sharedPool.end((err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        return promise;
    }

    executeQuery(query) {
        const promise = new Promise((resolve, reject) => {
            SQLService.sharedPool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    connection.query(query, (err1, rows) => {
                        if (err1) {
                            connection.release();
                            reject(err1);
                            return;
                        }

                        const str = JSON.stringify(rows);
                        const result = JSON.parse(str);
                        connection.release();
                        resolve(result);
                    });
                }
            });
        });
        return Rx.Observable.fromPromise(promise);
    }

    executeQuery1(query) {
        const promise = new Promise((resolve, reject) => {
            SQLService.sharedPool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    connection.query(query, (err1, rows) => {
                        if (err1) {
                            connection.release();
                            reject(err1);
                            return;
                        }

                        const str = JSON.stringify(rows);
                        const result = JSON.parse(str);
                        connection.release();
                        resolve(result);
                    });
                }
            });
        });
        return promise;
    }

    // TODO - Refactor
    getSingle(query) {
        const promise = new Promise((resolve, reject) => {
            SQLService.sharedPool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    connection.query(query, (err1, rows) => {
                        if (err1) {
                            connection.release();
                            reject(err1);
                            return;
                        }

                        if (rows && rows.length > 0) {
                            const str = JSON.stringify(rows[0]);
                            const result = JSON.parse(str);
                            connection.release();
                            resolve(result);
                        } else {
                            connection.release();
                            resolve(null);
                        }
                    });
                }
            });
        });
        return Rx.Observable.fromPromise(promise);
    }

    getSingle1(query) {
        const promise = new Promise((resolve, reject) => {
            SQLService.sharedPool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    connection.query(query, (err1, rows) => {
                        if (err1) {
                            connection.release();
                            reject(err1);
                            return;
                        }

                        if (rows && rows.length > 0) {
                            const str = JSON.stringify(rows[0]);
                            const result = JSON.parse(str);
                            connection.release();
                            resolve(result);
                        } else {
                            connection.release();
                            resolve(null);
                        }
                    });
                }
            });
        });
        return promise;
    }

    executeBulkQuery(query, values) {
        const promise = new Promise((resolve, reject) => {
            SQLService.sharedPool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    connection.query(query, [values], (err1, rows) => {
                        if (err1) {
                            connection.release();
                            reject(err1);
                            return;
                        }

                        const str = JSON.stringify(rows);
                        const result = JSON.parse(str);
                        connection.release();
                        console.log(result);
                        resolve(result);
                    });
                }
            });
        });
        return Rx.Observable.fromPromise(promise);
    };

    executeBulkQuery1(query, values) {
        const promise = new Promise((resolve, reject) => {
            SQLService.sharedPool.getConnection((err, connection) => {
                if (err) {
                    reject(err);
                    return;
                } else {
                    connection.query(query, [values], (err1, rows) => {
                        if (err1) {
                            connection.release();
                            reject(err1);
                            return;
                        }

                        const str = JSON.stringify(rows);
                        const result = JSON.parse(str);
                        connection.release();
                        console.log(result);
                        resolve(result);
                    });
                }
            });
        });
        return promise;
    };

    getTable(tableName, id) {
        let query = `select * from ${tableName} where id = ${id}`;
        return Rx.Observable.create((observer) => {
            SQLService.sharedPool.getConnection((err, connection) => {
                connection.query(query, (err1, rows) => {
                    if (err1) {
                        connection.release();
                        observer.error(err1);
                        observer.complete();
                        return;
                    }

                    if (rows && rows.length > 0) {
                        const str = JSON.stringify(rows[0]);
                        const result = JSON.parse(str);
                        connection.release();
                        observer.next(result);
                        observer.complete();
                    } else {
                        connection.release();
                        observer.next(null);
                        observer.complete();
                    }
                });
            });
        });
    }
}


SQLService.sharedPool;

module.exports = SQLService;
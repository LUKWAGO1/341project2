const dotenv = require('dotenv');
dotenv.config();
MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
    if (database) {
        return callback(null, database);
    }
    MongoClient.connect(process.env.MONGODB_URL)
        .then((client) => {
            database = client;
        callback(null, database);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDatabase = () => {
     if (!database) {
        throw Error('Database not initialized');
    }
    return database;

};

module.exports = {
    initDb,
    getDatabase
};
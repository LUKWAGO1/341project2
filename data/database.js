const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let database;

const initDb = (callback) => {
    if (database) {
        console.log('✅ Using existing database connection');
        return callback(null, database);
    }

    console.log('🌐 Attempting MongoDB connection...');
    MongoClient.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    })
    .then((client) => {
        database = client.db(process.env.DB_NAME); // Explicitly specify DB
        console.log('✅ Successfully connected to MongoDB');
        callback(null, database);
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        callback(new Error(`Failed to connect to MongoDB: ${err.message}`));
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
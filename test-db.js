require('dotenv').config();
const { initDb } = require('./data/database');

initDb((err, db) => {
    if (err) {
        console.error('Test failed:', err);
    } else {
        console.log('Test successful! Database connection works');
        db.collection('test').findOne({}, () => process.exit());
    }
});
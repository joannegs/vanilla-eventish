const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./src/database/database.db");

module.exports = db;

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            password TEXT
        );
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT,
        date DATE TEXT,
        initial_hour TEXT,
        final_hour TEXT,
        user_id INTEGER, 
        FOREIGN KEY(user_id) REFERENCES users(id)
    );
`);
});


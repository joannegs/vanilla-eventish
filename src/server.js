const express = require('express');
const nunjucks = require("nunjucks");
const db = require("./database/db.js");

const server = express();

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use(express.static("public"));


server.use(express.urlencoded({ extended: true }));

nunjucks.configure("src/views", {
    express: server,
    noCache: true
});

function afterInsertData(err) {
    if (err) res.status(500).send("Intern error");
}

server.get("/", (req, res) => {
    return res.render("index.html");
});

server.get("/sign-up", (req, res) => {
    return res.render("sign-up.html");
});

server.post("/save-user", (req, res) => {
    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?);`;
    const values = [req.body.name, req.body.email, req.body.password];

    db.run(query, values, afterInsertData);
       
    db.get(`SELECT seq FROM sqlite_sequence WHERE name="users"`, [], (err, row) => {
        // return res.redirect(`events/${row.seq}`);
        return res.send({user_id: row.seq});
    });
});

server.get("/events/:user_id", (req, res) => {
    const query = `SELECT * FROM events WHERE user_id = ?;`;

    db.all(query, [req.params.user_id], (err, rows) => {
        afterInsertData(err);
        return res.render("initial-page.html", { events: rows, events_total: rows.length })
    });
});

server.post("/login", (req, res) => {
    const query = `SELECT * FROM users WHERE email = ?;`;
    const values = [req.body.email];

    db.get(query, values, (err, row) => {
        afterInsertData(err);

        if (row) {
            if (row.password === req.body.password) {
                res.status(200).send({logged_user_id: row.id});
            } else {
                return res.status(400);
            }
        }
    });
});

server.post("/save-event", (req, res) => {
    const query = `INSERT INTO events (description, date, initial_hour, final_hour, user_id) VALUES (?, ?, ?, ?, ?);`;
    const values = [req.body.description, req.body.date, req.body.initial_hour, req.body.final_hour, req.body.user_id];

    db.run(query, values, afterInsertData);
    res.redirect(`/events/${req.body.user_id}`);
});

server.get("/get-event/:event_id", (req, res) => {
    db.get(`SELECT * FROM events WHERE id = ?;`, [req.params.event_id], (err, row) => {
        afterInsertData(err);
        res.status(200).send({status: 500, event_data: row});
    });
});


server.get("/delete-event/:event_id", (req, res) => {
    db.run(`DELETE FROM events WHERE id = ?;`, [req.params.event_id], afterInsertData);
    res.send({status: 200});
});

server.post("/update-event/:event_id", (req, res) => {
    const query = `UPDATE events SET (description, date, initial_hour, final_hour) = (?, ?, ?, ?) where id = ?;`;
    const values = [req.body.description, req.body.date, req.body.initial_hour, req.body.final_hour, req.params.event_id];

    db.run(query, values, afterInsertData);
    res.redirect(`/events/${req.body.user_id}`);
});

server.listen(3000);


const express = require('express');
const nunjucks = require("nunjucks");
const db = require("./database/db.js");

const server = express();

server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }));

nunjucks.configure("src/views", {
    express: server,
    noCache: true
});

server.get("/", (req, res) => {
    return res.render("index.html");
});

server.get("/sign-up", (req, res) => {
    return res.render("sign-up.html")
});

server.post("/save-user", (req, res) => {
    const query = `INSERT INTO users (name, email, password) VALUES (?, ?, ?);`;
    const values = [req.body.name, req.body.email, req.body.password];

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.status(500).send("An error occurred while trying to sign-up");
        }
        // redirecionar para a pagina inicial
        return res.status("Ok, it worked");
    }

    db.run(query, values, afterInsertData)
});

server.post("/login", (req, res) => {
    const query = `SELECT * FROM users WHERE email = ?;`;
    const values = [req.body.email];

    function afterInsertData(err) {
        if (err) res.status(500).send("Intern error");
    }

    db.get(query, values, (err, row) => {
        afterInsertData(err);

        if (row) {
            row.password === req.body.password ? res.status(200).send("logado") : res.status(403).send("não logado")
        } else {
            res.status(404).send("não existe registro");
        }
    });
});

server.listen(3000);


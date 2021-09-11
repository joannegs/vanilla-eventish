const express = require('express');
const nunjucks = require("nunjucks");
const db = require("./database/db.js");

const server = express();

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
})


server.listen(3000);


const fs = require("fs");
const path = require("path");
let jsonDb = require("../db/db.json");

module.exports = (app) => {
    const readPromise = () =>
    new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });

    app.get("/api/notes", (req, res) => {
        readPromise().then((result) => {
            res.json(JSON.parse(result));
        }).catch(err => console.log(err));
    });

    
}
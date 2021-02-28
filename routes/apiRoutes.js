const fs = require("fs");
const path = require("path");
let jsonDb = require("../db/db.json");

module.exports = (app) => {
    /**
     * promise to provide data by reading storage file db.json
     */
    const readPromise = () =>
    new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, "../db/db.json"), "utf8", (err, data) => {
            if (err) reject(err);
            resolve(data);
        });
    });

    /**
     *  promise to write new data into db.json depends upon operation as delete or post
     */
    const writePromise = (data, operationType) =>
    new Promise((resolve, reject) => {
        let resolveResult;
        switch(operationType){
            case "post":
                jsonDb.push(data);
                break;
            case "delete":
                jsonDb.splice(0,jsonDb.length); //clearing the array for new data
                jsonDb = data;
                break;
        }
        fs.writeFile(path.join(__dirname, "../db/db.json"), JSON.stringify(jsonDb), (err) => {
            if (err) reject(err);
            resolveResult = (operationType == "post")?"<< WRITTEN !! >>":"<< DELETED !! >>"; 
            resolve(resolveResult);
        });
    });

    /**
     * api of getting the all data from db.json
     */
    app.get("/api/notes", (req, res) => {
        readPromise().then((result) => {
            res.json(JSON.parse(result));
        }).catch(err => console.log(err));
    });

    /**
     * api of adding user into db.json 
     * */ 
    app.post("/api/notes", (req, res) => {
        if(jsonDb.length != 0){
            // return sort of storage data in descending order
            let getSortData = jsonDb.sort((x,y)=>{
                return parseInt(y.id) - parseInt(x.id);
            });
            let getHighestIdAndAddOne = parseInt(getSortData[0].id) + 1; // generates 'id' by adding 1 with highest 'id' of exisiting json data
            req.body.id = JSON.stringify(getHighestIdAndAddOne);
        }else{
            req.body.id = "1"; // if json array is blank than it adds 'id' as 1
        }
        writePromise(req.body, "post")
        .then(res => console.log(res))
        .catch(err => console.log(err));;
        res.json(true);
    });

    /**
     * removes the user delete data from storage file
     */
    app.delete("/api/notes/:id",(req,res)=>{
        readPromise().then(data=>{
            let getID = req.params.id.toString();
            let parse = JSON.parse(data);
            let filteredData =  parse.filter(result => result.id.toString() != getID); // removes the data from array if ids matches           
            writePromise(filteredData,"delete")
            .then(res=>console.log(res))
            .catch(err => console.log(err));
        })
        res.json(true);
    });

    /**
     * gets the user by selection with its id
     */

    app.get("/api/notes/:id", function(req,res) {
        res.json(jsonDb[req.params.id]);
    });
}
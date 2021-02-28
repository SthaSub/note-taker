const path = require("path");

module.exports = (app)=>{

    /**
     * forward to notes page
     */
    app.get("/notes",(request,response)=>{
        response.sendFile(path.join(__dirname,"../public/notes.html"));
    });

    /**
     * redirect to index page
     */

    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    /**
     * loading application direct the index page
     */
    app.get("*",(request,response)=>{
        response.sendFile(path.join(__dirname,"../public/index.html"));
    })
};
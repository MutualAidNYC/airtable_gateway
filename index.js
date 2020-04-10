var express = require("express");

var app = express();

const port = process.env.PORT;
app.listen(port, () => {
    console.log('Server running on port ' + port);
});

app.get("/", (req, res, next) => {
    res.json("MANYC Airtable Gateway Web Server")
});

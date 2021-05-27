"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var PORT = 8080;
app.get('/', function (req, res) { return res.send("woot"); });
app.listen(PORT, function () {
    console.log("[server]: Server is running at http://localhost:" + PORT);
});

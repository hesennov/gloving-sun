const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(__dirname + "/public"));
app.use("/node_modules", express.static(path.join(__dirname, "node_modules")));
app.listen(4000, () => console.log("Visit http://127.0.0.1:4000"));

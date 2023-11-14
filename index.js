require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

// ME START
// body parser middleware to decode data from the http verb POST (from the request body)
// middleware must be mounted before all the routes that depend on it
let bodyParser = require("body-parser");
let middlewareParse = bodyParser.urlencoded({ extended: false });
app.use(middlewareParse);

// require the DNS core module as suggested by FCC
const dns = require("node:dns");

//--- setup mongoose
const mongoose = require("mongoose");
// connect to MongoDB described in .env MONGO_URI without depricated warnings.
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("database connected.");
}).catch((err) => console.log(err.message));
//--- end mongoose.

// ME END

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
    res.json({ greeting: "hello API" });
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

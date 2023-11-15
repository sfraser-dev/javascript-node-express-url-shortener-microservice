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
mongoose.Promise = require("bluebird");
// connect to MongoDB described in .env MONGO_URI without depricated warnings.
mongoose
    .connect(process.env.MONGO_URI, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("database connected.");
    })
    .catch((err) => console.log(err.message));
// create mongoose schema, structure of document
const urlSchema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true,
    },
});
// create a model from the scheme to perform CRUD
const Url = new mongoose.model("Url", urlSchema);
//--- end mongoose.
// ME END

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
    res.sendFile(process.cwd() + "/views/index.html");
});

// ME START
// Your first API endpoint
app.post("/api/shorturl", function (req, res) {
    // grab the received url
    let receivedUrl = req.body.url;

    // validate the recieved url from the form using JS's in-built URL module
    let urlObject;
    try {
        urlObject = new URL(receivedUrl);
    } catch {
        res.json({ error: "invalid url" });
        return;
    }

    // promise producing code
    // use the dns module to see if the url exists
    // dns lookup function is asynchronous, wrap in promise 
    const dnsLookupPromise = new Promise(function (resolve, reject) {
        // If domain exists, it'll return the address
        dns.lookup(urlObject.hostname, function (err, address) {
            if (err) reject(err);
            resolve(address);
        });
    });
    // promise consuming code (.then (resolved) and .catch (rejected))
    dnsLookupPromise
        .then(function () {
            let originalUrl = urlObject.href;
            // checks complete (url validated and url exists)
            // write to mongodb database ("Url" is the mongoose model)
            const url = new Url({
                original_url: originalUrl,
            });
            // mongoose save() returns a promise
            const savePromise = url.save();
            savePromise
                .then(function () {
                    // on successful save, use "_id" of the document for the short url
                    res.json({
                        original_url: originalUrl,
                    });
                })
                .catch(function () {
                    res.json({ error: "invalid url" });
                });
        })
        .catch(function () {
            res.json({ error: "invalid url" });
        });
});
// ME END

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

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
    // log the body data from the form (gives... {url: www.test.com})
    console.log(req.body);
    // grab the received url
    let receivedUrl = req.body.url;

    // validate the recieved url (correct format?) using JS's in-built URL module
    let urlObject;
    try {
        urlObject = new URL(receivedUrl);
        console.log(urlObject);
    } catch {
        res.json({ error: "invalid url" });
        return;
    }

    // use the dns module to see if the url exists
    // dns lookup function is asynchronous, wrap in promise, producing code
    const lookupPromise = new Promise(function (resolve, reject) {
        // If domain exists, it'll return the address
        dns.lookup(urlObject.hostname, function (err, address) {
            if (err) reject(err);
            resolve(address);
        });
    });
    // consumer code (.then (resolved) and .catch (rejected))
    let shortUrl = 101;
    let longUrl;
    lookupPromise
        .then(function (promiseResolved) {
            console.log(promiseResolved);
            longUrl = urlObject.href;
            res.json({ long_url: longUrl, short_url: shortUrl });
        })
        .catch(function (promiseRejected) {
            console.log(promiseRejected);
            res.json({ error: "invalid url" });
        });
});
// ME END

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

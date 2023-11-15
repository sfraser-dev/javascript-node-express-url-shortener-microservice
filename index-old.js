"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const bodyParser = require("body-parser");

////////// Setup Mongoose.
const mongoose = require("mongoose");
// Connect to MongoDB described in .env MONGO_URI without
// depricated warnings.
mongoose.connect(process.env.MONGO_URI, {
    // dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    // useCreateIndex: true,
}).then(() => {
    console.log("database connected.");
}).catch((err) => console.log(err.message));

// grabbing Schema and model out of mongoose
const { Schema } = mongoose;
const { model } = mongoose;

const urlSchema = new Schema({
    longurl: { type: String, required: true }
});

const Url = model("Url", urlSchema);
////////// End Mongoose.


// Basic Configuration (skeleton)
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

// Get the short URL
app.post(
    "/api/shorturl",
    bodyParser.urlencoded({ extended: false }),
    async function (req, res) {
        if (req.body.url.toString().match(/^https:/)) {
            const newurl = await new Url({
                longurl: req.body.url
            });

            const shorturl = await newurl.save();

            res.json({ original_url: req.body.url, short_url: shorturl._id });
        } else {
            res.json({ error: "invalid url" });
        }
    }
);

// Redirect to the long URL
app.get(
    "/api/shorturl/:short",
    function (req, res) {
        function getShortUrl() {
            Url.findById(req.params.short).limit(1).exec(function (err, data) {
                if (err) return console.log(err);
                console.log(data);
                res.redirect(data.longurl);
            });
        }
        getShortUrl();
    }
);

// Listener
app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});

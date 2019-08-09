//==============
// DB 
var express = require("express");
var app = express()
var db = require("./models");
var PORT = 3000;
var mongoose = require("mongoose");

//var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";
//mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
mongoose.connect("mongodb://localhost/news", { useNewUrlParser: true })
//==============

//==============
//Scrapping tools
var axios = require("axios");
var cheerio = require("cheerio");
//==============

//==============
//Setting the app (inputs & folder)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
//==============



// +++++++++++++
// Scrapping the website and adding the data
// to the Data base
app.get("/scrape", function (req, res) {
    axios.get("https://www.npr.org/sections/news/").then(function (response) {
        var $ = cheerio.load(response.data);

        $("div.item-info").each(function (i, element) {
            var result = {};
            result.title = $(element)
                .find("h2.title")
                .children("a")
                .text();
            result.link = $(element)
                .find("h2.title")
                .children("a")
                .attr("href");
            result.summary = $(element)
                .find("p.teaser")
                .children("a")
                .text();

            db.Article.create(result)
                .then(function (ArticledDB) {
                    console.log(ArticledDB);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                })
        });
    });
    res.sendStatus(200)
})

// +++++++++++++
//  Finding all the articles in our DB
app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (ArticleDB) {
            res.json(ArticleDB);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// +++++++++++++
// Populate the articles with the comments
app.get("/articles/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id })
        .populate("comment")
        .then(function (ArticleDB) {
            res.json(ArticleDB);
        })
        .catch(function (err) {
            res.json(err);
        });
});



// +++++++++++++
// Save and update that Article ID
app.post("/articles/:id", function (req, res) {
    db.Comment.create(req.body)
        .then(function (CommentDB) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {comment: CommentDB._id}}, { new: true });
        })
        .then(function (ArticleDB) {
            res.json(ArticleDB);
        })
        .catch(function (err) {
            res.json(err);
        });
});

// +++++++++++++
// Connecting to the DB
app.listen(PORT, function () {
    console.log("App running on port localhost:" + PORT);
})
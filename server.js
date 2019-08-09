

//++++++++++++++
//SCRAPPING TOOLS
var axios = require("axios");
var cheerio = require("cheerio");

axios.get("https://www.npr.org/sections/news/").then(function (response) {

    // Load the body of the HTML into cheerio
    var $ = cheerio.load(response.data);

    // Empty array to save our scraped data
    var results = [];

    // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
    $("div.item-info").each(function (i, element) {

        title = $(element)
            .find("h2.title")
            .children("a")
            .text();
        link = $(element)
            .find("h2.title")
            .children("a")
            .attr("href");
        summary = $(element)
            .find("p.teaser")
            .children("a")
            .text();

        // Make an object with data we scraped for this h4 and push it to the results array
        results.push({
            headline: title,
            summary: summary,
            URL: link,
        });
    });
    // After looping through each h4.headline-link, log the results
    console.log(results);
});




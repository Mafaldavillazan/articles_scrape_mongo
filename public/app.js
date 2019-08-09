// Grab the articles as a json
$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    $("#articles").append("<p data-id='" + data[i]._id + "'>"
      + data[i].title
      + "<br />"
      + data[i].summary
      + "<br />"
      + data[i].link
      + "</p>");
  }
});

// Creating the note
$(document).on("click", "p", function () {

  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  //Get the article id
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {
      console.log(data);

      //Create the note to display
      $("#notes").append("<h2>" + data.title + "</h2>");
      $("#notes").append("<input id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savecomment'>Save Note</button>");

      // If there's a note in the article
      if (data.comment) {
        $("#titleinput").val(data.comment.title);
        $("#bodyinput").val(data.comment.body);
      }
    });
});

// Posting the note to that particular article
$(document).on("click", "#savecomment", function () {

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
    .then(function (data) {
      console.log(data);
      $("#notes").empty();
      $.ajax({
        method: "GET",
        url: "/comments/" + data.comment
      }).then(function (data) {
        console.log(data)
        $("#commentTittle").append("<h2>" + data.title + "</h2>");
        $("#comment").append("<h4>" + data.body + "</h4>");
      })
    });




  $("#titleinput").val("");
  $("#bodyinput").val("");
});
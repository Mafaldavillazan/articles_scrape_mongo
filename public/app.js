// Grab the articles as a json
$.getJSON("/articles", function (data) {
  for (var i = 0; i < 5; i++) {
    // Display the values with handle bars
    $("#articles").append("<div class='card' style='width: 35rem;' id='article' data-id='" + data[i]._id + "'>"
      + " <div class='card-body'>"
      + "<h5 class='card-title'>"
      + data[i].title
      + "<h5/>"
      + "<p class='card-text'>"
      + data[i].summary
      + "</p>"
      + "<a class='btn btn-info' href="
      + data[i].link
      + "> Link to article </a>"
      + "</div>"
      + "</div>");
  }

  for (var i = 5; i < 10; i++) {
    // Display the values with handle bars
    $("#articles2").append("<div class='card' style='width: 35rem;' id='article' data-id='" + data[i]._id + "'>"
      + " <div class='card-body'>"
      + "<h5 class='card-title'>"
      + data[i].title
      + "<h5/>"
      + "<p class='card-text'>"
      + data[i].summary
      + "</p>"
      + "<a class='btn btn-info' href="
      + data[i].link
      + "> Link to article </a>"
      + "</div>"
      + "</div>");
  }
});

// Creating the note
$(document).on("click", "#article", function () {
  $("#comment").empty()
  $("#notes").empty();
  var thisId = $(this).attr("data-id");

  //Get the article id
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    .then(function (data) {


      //Create the note to display
      $("#notes").append("<h4>" + data.title + "</h4>");
      $("#notes").append("<textarea id='titleinput' name='title' >");
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      $("#notes").append("<button data-id='" + data._id + "' id='savecomment'>Save Note</button>");

      // If there's a note in the article
      if (data.comment) {
        renderComment(data)
        console.log(data)
      }
      //Be able to delete the article
      $(document).on("click", ".delete", function () {
        var commentID = $(this).attr("id")
        console.log(commentID)
        $.ajax({
          method: "DELETE",
          url: "/comment/" + thisId + "/" + commentID
        }).then(function (deleteData) {
          location.reload()
        })
      })

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
            $("#notes").empty()
            $("#comment").empty()
          })

        $("#titleinput").val("");
        $("#bodyinput").val("");
      });

    });
})

//+++++++
// Functions

function renderComment(data) {

  for (var i = 0; i < data.comment.length; i++) {
    $newDiv = $("<br><div>")
    $newDiv.append("Title: " + data.comment[i].title);
    $newDiv.append("<br> About: " + data.comment[i].body)

    $newButton = $("<br> <button class='delete' id='"
      + data.comment[i]._id
      + "'> X </button>")

    $newDiv.append($newButton)

    $("#comment").append($newDiv);
  }

}

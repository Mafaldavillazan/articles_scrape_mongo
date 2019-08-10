// Grab the articles as a json
$.getJSON("/articles", function (data) {
  for (var i = 0; i < data.length; i++) {
    // Display the values with handle bars
    $("#articles").append("<p id='article' data-id='" + data[i]._id + "'>"
      + data[i].title
      + "<br/>"
      + "<a class='btn btn-info' href="
      + data[i].link
      + "> Link to article </a>"
      + "<button id='saved' class='btn btn-secondary'> Save article </button>"
      + "</p>");
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

    });

  //Be able to delete the article
  $(document).on("click", ".delete", function () {
    var commentID = $(this).attr("id")
    console.log(commentID)
    $.ajax({
      method: "DELETE",
      url: "/comment/" + thisId + "/" + commentID
    }).then(function (deleteData) {
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
        .then(function (data) {
          location.reload()
        });

    })

  })
  // Posting the note to that particular article
  $(document).on("click", "#savecomment", function () {

    var thisId = $(this).attr("data-id");

    console.log("++++++ Inside +++++++")

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
      })

    $("#titleinput").val("");
    $("#bodyinput").val("");
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

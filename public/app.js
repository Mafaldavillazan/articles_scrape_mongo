// Grab the articles as a json
$.getJSON("/articles", function (data) {

  article1 = "#articles"
  getArticles(article1, 0, 5, data)

  article2 = "#articles2"
  getArticles(article2, 5, 10, data)

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

      commentDisplay(data)

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
            c
          })

        $("#titleinput").val("");
        $("#bodyinput").val("");
      });

    });
})

//+++++++
// Functions

//Render all comments
function renderComment(data) {
  for (var i = 0; i < data.comment.length; i++) {
    $newDiv = $("<div class='col-sm-3'>")
    $newCard = $("<div class='card'>")
    $cardBody = $("<div class='card-body'>")


    $cardBody.append("<h5 class='card-title'>" + data.comment[i].title + "</h5>");
    $cardBody.append("<p class='card-text'>" + data.comment[i].body + "</p>")

    $newButton = $("<button class='delete btn btn-info' id='"
      + data.comment[i]._id
      + "'> delete </button>")

    $cardBody.append($newButton)

    $newCard.append($cardBody)
    $newDiv.append($newCard)
    $("#comment").append($newDiv)
  }

}

//Display the articles
function getArticles(jqueyCall, num1, num2, data) {
  for (var i = num1; i < num2; i++) {
    // Display the values with handle bars
    $(jqueyCall).append("<div class='card' style='width: 30rem;' id='article' data-id='" + data[i]._id + "'>"
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
}

//Create the note to display
function commentDisplay(data) {

  $("#notes").append("<h5 class='card-title'>" + data.title + "</h5>");
  $("#notes").append("<p class='form-inline card-text'>What do you want to say?</p>")


  var $newDiv = $("<div class= col-3>")
  $($newDiv).append("<input type='text' class='form-control center' id='titleinput' placeholder='title:' name='title'>");
  $($newDiv).append("<textarea type='text' class='form-control center'  id='bodyinput'  placeholder='body:' name='body'></textarea>");
  $("#notes").append($newDiv)


  $("#notes").append("<button class='btn btn-info' data-id='" + data._id + "' id='savecomment'>Save Note</button>");
}

// Grab the articles as a json
$.getJSON("/articles", function (data) {

  article1 = "#articles"
  getArticles(article1, 5, data)

  article2 = "#articles2"
  getArticles(article2, 10, data)

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

//Display the articles
function getArticles(jqueyCall, num, data) {
  for (var i = 0; i < num; i++) {
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
function commentDisplay(data){
  
  $("#notes").append("<h5 class='card-title'>" + data.title + "</h5>");
  $("#notes").append("<p class='form-inline card-text'>What do you want to say?</p>")

  
  var $newDiv = $("<div class= col-3>")
  $($newDiv).append("<input type='text' class='form-control center' id='titleinput' placeholder='title:' name='title'>");
  $($newDiv).append("<textarea type='text' class='form-control center'  id='bodyinput'  placeholder='body:' name='body'></textarea>");
  $("#notes").append($newDiv)


  $("#notes").append("<button class='btn btn-primary' data-id='" + data._id + "' id='savecomment'>Save Note</button>");
}

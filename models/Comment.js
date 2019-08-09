var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  title: String,
  body: String,
  deleted: false
});

//Add a delete functionality
var Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
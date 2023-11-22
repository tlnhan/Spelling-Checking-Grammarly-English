const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  No: String,
  ID: String,
  LV_NAME: String,
  LS_NAME: String,
  LS_TITLE: String,
  WRITE_CONTENTS: String,
  EDIT_CONTENTS: String,
  Correct_Date: String,
  // SPELLING_CHECKING: String,
  Spelling_Checking_Date: String,
});

const Post = mongoose.model("essays", postSchema);

module.exports = Post;

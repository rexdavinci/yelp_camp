var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User" //refers to the Schema to get the info from
        },
        username: "String"
    }
});

module.exports = mongoose.model("Comment", commentSchema);
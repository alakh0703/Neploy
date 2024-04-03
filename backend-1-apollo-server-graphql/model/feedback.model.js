const mongoose = require("mongoose");



const feedbackSchema = new mongoose.Schema({
    feedbackId: String,
    userName: String,
    userEmail: String,
    issueType: String,
    feedbackMessage: String,

});


const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = { Feedback };
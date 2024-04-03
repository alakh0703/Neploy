const mongoose = require("mongoose");


const projectSchema = new mongoose.Schema({
    pId: String,
    title: String,
    description: String,
    url: String,
    git_link: String,
    deployed: Boolean,
    date_created: String,
    profileUrl: String

});

const userSchema = new mongoose.Schema({
    userId: String,
    username: String,
    display_name: String,
    email: String,
    git_username: String,
    git_url: String,
    linkedin_url: String,
    personal_website: String,
    projects: [projectSchema],
    notification: {
        type: Boolean,
        default: false

    }
});

const User = mongoose.model("User", userSchema);
module.exports = { User };



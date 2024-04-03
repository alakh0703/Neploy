const mongoose = require("mongoose");


const logsSchema = new mongoose.Schema({
    event_id: String,
    deployment_id: String,
    log: String,
    timestamp: String
})
const buildSchema = new mongoose.Schema({
    buildId: String,
    projectId: String,
    buildStatus: String,
    buildDate: String,
    buildLog: String,
    timeToBuild: String,

});


const projectSchema = new mongoose.Schema({
    pId: String,
    userId: String,
    title: String,
    description: String,
    git_link: String,
    deployed: Boolean,
    status: String,
    date_created: String,
    url: String,
    profileUrl: String,
    date_latest_deploy: String,
    builds: [buildSchema]

});



const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
const mongoose = require("mongoose");

const stat = new mongoose.Schema({
    date: Date,
    count: Number
});


const analyticsSchema = new mongoose.Schema({
    projectUrl: String,
    analytic: [stat]

});



const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
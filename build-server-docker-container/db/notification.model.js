const mongoose = require("mongoose");



const notiSchema = new mongoose.Schema({
    notificationId: String,
    userId: String,
    notificationType: Boolean,
    notificationMessage: String,
    notificationDate: String,
    notificationProjectName: String,
});


const Notificat = mongoose.model("Notificat", notiSchema);

module.exports = { Notificat };
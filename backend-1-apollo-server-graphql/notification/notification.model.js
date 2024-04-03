const { Notificat } = require('../model/notification.model');
const { User } = require('../model/user.model');
async function getNotifications() {
    try {
        const notifications = await Notificat.find();
        return notifications;
    }
    catch (error) {
        console.error("Error getting notification:", error);
        throw error;
    }
}
async function getAllNotifications(userId) {
    try {
        const notifications = await Notificat.find({ userId: userId });
        if (notifications.length == 0) {
            return [];
        }



        return notifications;

    }
    catch (error) {
        console.error("Error getting all notifications:", error);
        throw error;
    }
}

async function setNotificationFalse(userId) {
    try {
        const user = await User.findOne({ userId: userId });
        user.notification = false;
        await user.save();
        return true;
    }
    catch (error) {
        console.error("Error setting notification false:", error);
        return false
    }


}
module.exports = {
    getAllNotifications,
    getNotifications,
    setNotificationFalse
}
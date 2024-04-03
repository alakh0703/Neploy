const notificationModel = require('./notification.model')
module.exports = {
    Query: {
        notifications: (parent, args) => {
            return notificationModel.getNotifications()
        }
    },
    Mutation: {
        getNotification: (parent, args) => {
            return notificationModel.getAllNotifications(args.userId)
        },
        setNotificationFalse: (parent, args) => {
            return notificationModel.setNotificationFalse(args.userId)
        }
    }
}


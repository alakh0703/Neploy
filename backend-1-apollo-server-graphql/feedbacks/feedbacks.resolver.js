
const feedbackModel = require("./feedbacks.model")
module.exports = {
    Query: {
        feedbacks: (_, parent) => {
            return feedbackModel.getAllFeedbacks()
        }
    },
    Mutation: {
        addFeedback: (_, args) => {
            return feedbackModel.addFeedback(args.userName, args.userEmail, args.issueType, args.feedbackMessage)
        }
    }
}



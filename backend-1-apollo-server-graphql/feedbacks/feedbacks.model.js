const { v4: uuidv4 } = require('uuid')
const { Feedback } = require('../model/feedback.model')
// const feedbacks = [
//     {
//         feedbackId: '1',
//         userName: 'John Doe',
//         userEmail: 'johndoe@gmail.com',
//         issueType: 'Bug',
//         feedbackMessage: 'This is a bug'
//     }
// ]

async function getAllFeedbacks() {
    const feedbacks = await Feedback.find()
    return feedbacks
}
async function addFeedback(userName, userEmail, issueType, feedbackMessage) {
    console.log('addFeedback')
    const feedbackId = uuidv4()
    const newFeedback = {
        feedbackId: feedbackId,
        userName,
        userEmail,
        issueType,
        feedbackMessage
    }
    const feedback = new Feedback(newFeedback)
    await feedback.save()
    return newFeedback
}
module.exports = {
    getAllFeedbacks,
    addFeedback
}
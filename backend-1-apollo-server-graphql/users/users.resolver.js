
const usersModel = require("./users.model")
module.exports = {
    Query: {
        users: (parent) => {
            return usersModel.getAllUsers()
        },

    },
    Mutation: {
        registerNewUser: (_, args) => {
            const userId = args.userId
            const email = args.email
            const git_username = args.git_username
            const display_name = args.display_name

            return usersModel.registerNewUser(userId, email, git_username, display_name)
        },
        updateGithubInfo: (_, args) => {
            const userId = args.userId
            const git_username = args.git_username
            const git_profile_url = args.git_profile_url

            return usersModel.updateGithubInfo(userId, git_username, git_profile_url)

        },
        updateLinkedInUrl: (_, args) => {
            const userId = args.userId
            const linkedin_url = args.linkedin_url
            return usersModel.updateLinkedInUrl(userId, linkedin_url)

        },
        updatePersonalWebsite: (_, args) => {
            const userId = args.userId
            const personal_website = args.personal_website
            return usersModel.updatePersonalWebsite(userId, personal_website)
        },
        getUserById: (_, args) => {
            return usersModel.getUserById(args.email)

        },
        deleteUserById: (_, args) => {
            return usersModel.deleteUserById(args.userId)
        }
    }
}



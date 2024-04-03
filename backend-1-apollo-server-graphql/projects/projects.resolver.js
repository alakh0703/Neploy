
const projectsModel = require('./projects.model')
module.exports = {
    Query: {
        projects: (parent) => {
            return projectsModel.getAllProjects()
        },
        getProjectById: (_, args) => {
            return projectsModel.getProjectById(args.pId)
        }

    },
    Mutation: {
        addNewProject: (_, args) => {
            const userId = args.userId;
            const title = args.title;
            const githubLink = args.githubLink;

            return projectsModel.addNewProject(userId, title, githubLink)
        },
        getProjectDetails: (_, args) => {
            return projectsModel.getProjectDetails(args.pId)

        },
        deleteProject: (_, args) => {
            return projectsModel.deleteProject(args.pId)
        },
        startDeploy: (_, args) => {
            return projectsModel.startDeploy(args.title, args.pId, args.git_link, args.url)
        },
        updateProjectName: (_, args) => {
            return projectsModel.updateProjectName(args.pId, args.title, args.userId)
        },
        updateGitHubUrl: (_, args) => {
            console.log("updateGitHubUrl mutation")
            return projectsModel.updateGitHubUrl(args.pId, args.newUrl, args.userId)
        },
        updateProjectDescription: (_, args) => {
            return projectsModel.updateProjectDescription(args.pId, args.newDescription, args.userId)
        }


    }
}


const { default: axios } = require('axios');
const { Project } = require('../model/project.model');

const addProjectToUser = require('../users/users.model').addProjectToUser
const removeProjectFromUser = require('../users/users.model').removeProjectFromUser
const updateProjectTitle = require('../users/users.model').updateProjectTitle
const updateGithubUrlUser = require('../users/users.model').updateGithubUrlUser
const updateProjectDescription0 = require('../users/users.model').updateProjectDescription0
const uuidv4 = require("uuid").v4


async function getAllProjects() {
    const projects = await Project.find()
    return projects;
}
async function getProjectById(pId) {
    const project = await Project.findOne({ pId: pId })
    if (!project) {
        return new Error('Project not found')
    }
    return project;
}


async function addNewProject(userId, title, githubLink) {
    console.log('ADDING NEW PROJECT ----MUTATION----')

    const projectId = generateProjectId()
    const title2 = title.split(' ').join('-').toLowerCase() + generateRandomString()
    const projectUrl = `http://${title2}.localhost:8000`
    const newProject = {
        pId: projectId,
        userId,
        title,
        url: projectUrl,
        description: 'this is a description of the project',
        profileUrl: "https://t3.ftcdn.net/jpg/04/56/00/16/360_F_456001627_vYt7ZFjxEQ1sshme67JAXorKRPo8gsfN.jpg",
        git_link: githubLink,
        deployed: false,
        status: 'not started',
        date_created: new Date().toISOString(),
        date_latest_deploy: null,
        builds: []
    }

    const userProject = {
        pId: projectId,
        title: title,
        url: projectUrl,
        description: 'this is a description of the project',
        git_link: githubLink,
        deployed: false,
        date_created: new Date().toISOString(),
        profileUrl: "https://t3.ftcdn.net/jpg/04/56/00/16/360_F_456001627_vYt7ZFjxEQ1sshme67JAXorKRPo8gsfN.jpg"


    }
    const apu_res = await addProjectToUser(userId, userProject)
    if (!apu_res) {
        throw new Error('Error adding project to user')
    }

    const project = new Project(newProject)
    await project.save()
    return newProject


}

async function getProjectDetails(pId2) {
    console.log('GETTING PROJECT BY ID ----- MUTATION -------')
    const project = await Project.findOne({ pId: pId2 })
    if (!project) {
        throw new Error('Project not found')
    }
    return project

}


async function deleteProject(pId) {
    console.log('DELETING PROJECT ----- MUTATION -----')
    const project0 = await Project.findOne({ pId: pId })
    const url = project0.url;

    if (project0.deployed) {
        console.log('Project not deployed')
        // url = 'http://localhost:9000/removeProject'
        const res0 = await axios.post(`${process.env.API_SERVER_URL}/removeProject`, {
            projectSlug: url
        })

        if (res0.data.error) {
            throw new Error(res0.data.error)
        }
    }
    const project = await Project.deleteOne({ pId: pId })
    if (project.deletedCount === 0) {
        throw new Error('Project not found')
    }
    const res = await removeProjectFromUser(project0.userId, pId)
    if (!res) {
        console.log("ERROR")
        throw new Error('Error removing project from user')
    }
    return project0

}

async function startDeploy(title, pId, git_link, url) {
    try {
        const buildId = generateProjectId()
        console.log('STARTING DEPLOYMENT ----- MUTATION -----')
        const build = {
            buildId: buildId,
            projectId: pId,
            buildStatus: 'in progress',
            buildDate: new Date().toISOString(),
            buildLog: "Building project...",
            timeToBuild: 'calculating...'
        }
        const project = await Project.findOne({ pId: pId })
        project.builds.push(build)

        const rId = extractKey2(url)
        if (!rId) {
            throw new Error('Invalid URL')
        }
        const res = await axios.post(`${process.env.API_SERVER_URL}/project`, {
            slug: rId.trim().toLowerCase(),
            projectId: pId,
            gitURL: git_link,
            buildId: buildId
        })


        if (res.data.error) {
            throw new Error(res.data.error)
        }

        await project.save()

        const data = res.data.data
        data['buildId'] = buildId
        return data

    }
    catch (error) {
        console.log(error)
        throw new Error('Error starting deployment')
    }
}

async function updateProjectName(pId, title, userId) {
    try {
        // Update the project name in the database
        console.log("Updating project name")
        const projectUpdateResult = await Project.updateOne({ pId: pId }, { title: title });

        // Check if the project update was successful
        // If successful, update the project title for the user

        await updateProjectTitle(userId, pId, title);

    } catch (error) {
        // Handle any errors that occur during the update operation
        console.error("Error updating project name:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
}


async function updateGitHubUrl(pId, newUrl, userId) {
    try {
        await Project.updateOne({ pId: pId }, { git_link: newUrl })
        const project = await Project.findOne({ pId: pId })


        await updateGithubUrlUser(userId, pId, newUrl)
        return project

    } catch (error) {
        console.error("Error updating project name:", error);
        throw error;
    }

}


async function updateProjectDescription(pId, description, userId) {
    try {
        const res = await Project.updateOne({ pId: pId }, { description: description })
        if (res.modifiedCount === 0) {
            throw new Error('Project not found')
        }

        const res2 = await updateProjectDescription0(userId, pId, description)
        if (!res2) {
            throw new Error('Error updating project description for user')
        }
        return true

    }
    catch (error) {
        console.error("Error updating project description:", error);
        throw error;
    }
}

// utitlity functions
function generateProjectId() {
    return uuidv4()
}

const generateRandomString = () => {
    const randomString = uuidv4()
    return "-" + randomString.slice(0, 5)
}
function extractKey(link) {
    // Regular expression to match the desired part of the URL
    const regex = /\/\/(.*?)\./;
    // Extracting the matched portion from the URL
    const match = link.match(regex);
    // Checking if there's a match
    if (match && match.length > 1) {
        // Returning the matched portion (excluding the protocol part)
        const arr = match[1].split('-')
        const arrLen = arr.length
        const rId = arr[arrLen - 1]
        return rId;
    } else {
        // If no match found, return null or handle the error as needed
        return null;
    }
}
function extractKey2(link) {
    // Regular expression to match the desired part of the URL
    const regex = /\/\/(.*?)\./;
    // Extracting the matched portion from the URL
    const match = link.match(regex);
    // Checking if there's a match
    if (match && match.length > 1) {
        // Returning the matched portion (excluding the protocol part)
        // const arr = match[1].split('-')
        // const arrLen = arr.length
        // const rId = arr[arrLen - 1]
        return match[1];
    } else {
        // If no match found, return null or handle the error as needed
        return null;
    }
}
module.exports = {
    getAllProjects,
    getProjectById,
    addNewProject,
    getProjectDetails,
    deleteProject,
    startDeploy,
    updateProjectName,
    updateGitHubUrl,
    updateProjectDescription
}


const { User } = require("../model/user.model")
const { Project } = require("../model/project.model");
const { default: axios } = require("axios");
const deleteProject = require("../projects/projects.model").deleteProject


//  fetch all the users from the database
async function getAllUsers() {
    const users = await User.find()
    return users;
}

//  register a new user
async function registerNewUser(userId, email, git_username, display_name) {
    const oldUser = await User.findOne({ email: email })

    if (oldUser) {
        console.log("User already exists")
        return oldUser
    }


    const git_username2 = git_username || '';
    const git_url = ''
    const newUser = {
        userId,
        email,
        git_username: git_username2,
        display_name,
        git_url,
        linkedin_url: '',
        personal_website: '',
        projects: []
    }
    const user = new User(newUser)
    await user.save(user)

    return newUser
}


// update the github info of the user
async function updateGithubInfo(userId, git_username, git_profile_url) {

    const res = await User.updateOne({ userId: userId }, { $set: { git_username: git_username, git_url: git_profile_url } })

    if (res.modifiedCount > 0) {
        return true
    }
    else {
        return false
    }
}

// =============================================== UTILITY FUNCTIONS =============================================== 


// get the user by email
async function getUserById(email) {

    const user = await User.findOne({ email: email })
    return user
}
async function getUserById2(userId) {

    const user = await User.findOne({ userId: userId })
    return user
}
// remove a project from the user
async function removeProjectFromUser(userId, projectId) {
    console.log('NO WAY', projectId, userId)
    const user = await getUserById2(userId)
    console.log('USER', user)
    if (!user) {
        return new Error("User not found")
    }
    user.projects = user.projects?.filter(project => project.pId !== projectId)
    await user.save()
    return user
}

// update the project title
async function updateProjectTitle(userId, projectId, newTitle) {

    const user = await User.updateOne({ userId: userId, "projects.pId": projectId }, { $set: { "projects.$.title": newTitle } })

}

// update the github url of the user
async function updateGithubUrlUser(userId, pId, newGitUrl) {

    await User.updateOne({ userId: userId, "projects.pId": pId }, { $set: { "projects.$.git_link": newGitUrl } })

}


// update the linkedin url of the user
async function updateLinkedInUrl(userId, newLinkedInUrl) {
    const res = await User.updateOne({ userId: userId }, { $set: { linkedin_url: newLinkedInUrl } })
    if (res.modifiedCount > 0) {
        return true
    }
    else {
        return false
    }

}

// update the personal website of the user
async function updatePersonalWebsite(userId, newWebsite) {
    const res = await User.updateOne({ userId: userId }, { $set: { personal_website: newWebsite } })
    if (res.modifiedCount > 0) {
        return true
    }
    else {
        return false
    }


}



// add a project to the user
async function addProjectToUser(userId, project) {

    try {
        const user = await getUserById2(userId)
        if (!user) {
            return new Error("User not found")
        }
        user.projects.push(project)
        await user.save()
        return true
    }
    catch (err) {
        console.log(err)
        return false
    }

}

// update the project description
async function updateProjectDescription0(userId, projectId, newDescription) {
    try {
        const user = await User.findOne({ userId: userId })

        const project = user.projects.find(project => project.pId === projectId)
        project.description = newDescription

        await user.save()
        return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}

async function deleteProject2(pId) {
    console.log('DELETING PROJECT ----- MUTATION -----')
    const project0 = await Project.findOne({ pId: pId })
    const url = project0.url;
    console.log(url)
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
async function deleteUserById(userId) {
    try {
        const user = await User.findOne({ userId: userId });
        console.log('DELETING USER', user?.userId);
        const projects = user?.projects;

        for (const project of projects) {
            const projectId = project?.pId;
            console.log('DELETING PROJECT', projectId);
            if (!projectId) {
                continue;
            }

            console.log("yeah");
            const project2 = await deleteProject2(projectId);
            console.log("yeah yeah", project2);
        }

        await User.deleteOne({ userId: userId });
        console.log('User deleted successfully');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { deleteUserById, updateProjectDescription0, getAllUsers, getUserById, getUserById2, registerNewUser, addProjectToUser, removeProjectFromUser, updateProjectTitle, updateGithubUrlUser, updateGithubInfo, updateLinkedInUrl, updatePersonalWebsite }
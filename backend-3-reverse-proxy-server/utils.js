const Analytics = require("./model/analytic.model")

const updateCount = async (url) => {
    const projectAna = await Analytics.findOne({ projectUrl: url })
    try {
        if (projectAna) {
            const stat = {
                date: new Date(),
                count: 1



            }

            projectAna.analytic.push(stat)
            await projectAna.save()
        }

        else {
            const newProject = new Analytics({
                projectUrl: url,
                analytic: [{
                    date: new Date(),
                    count: 1
                }]
            })
            await newProject.save()
        }
    }
    catch (error) {
        console.log(error)
        return
    }


}


module.exports = { updateCount }
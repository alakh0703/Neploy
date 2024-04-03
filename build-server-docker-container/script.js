const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mime = require('mime-types')

const { Kafka } = require('kafkajs')
const { connect } = require('./db/db')
const { Project } = require('./db/project.model')
const { User } = require('./db/user.model')
const { Notificat } = require("./db/notification.model")

const s3Client = new S3Client({
    region: "",

    credentials: {
        accessKeyId: "",
        secretAccessKey: ""
    }
})


const PROJECT_ID = process.env.PROJECT_ID
const PROJECT_REAL_ID = process.env.PROJECT_REAL_ID
const DEPLOYMENT_ID = process.env.DEPLOYMENT_ID
const MONGODB_URL = process.env.MONGODB_URL || ""
const TIME_STARTED = process.env.TIME_STARTED || new Date().toISOString()

const kafka = new Kafka({
    clientId: `docker-build-server-${DEPLOYMENT_ID}`,
    brokers: [''],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, 'kafka.pem'), 'utf-8')]
    },
    sasl: {
        username: '',
        password: '',
        mechanism: ''
    }
})

const producer = kafka.producer()
connect(MONGODB_URL)

async function publishLog(log) {
    await producer.send({
        topic: ``, messages: [{
            key: 'log',
            value: JSON.stringify({ PROJECT_ID, DEPLOYMENT_ID, log })
        }]
    })
}

async function init() {
    await producer.connect()
    console.log('Executing script.js')
    await publishLog('Build Started...')

    const project = await Project.findOne({ pId: PROJECT_REAL_ID })
    const userId = project.userId;
    const user = await User.findOne({ userId: userId })
    project.status = 'BUILDING'
    const build = project.builds.find(b => b.buildId === DEPLOYMENT_ID)
    build.buildStatus = 'BUILDING'

    await project.save()





    const outDirPath = path.join(__dirname, 'output')

    const p = exec(`cd ${outDirPath} && npm install && npm run build`)

    p.stdout.on('data', async function (data) {
        console.log(data.toString())
        await publishLog(data.toString())
    })

    p.stdout.on('error', async function (data) {
        console.log('Error', data.toString())
        await publishLog(`error: ${data.toString()}`)
    })

    p.on('close', async function () {
        console.log('Build Complete')
        await publishLog(`Build Complete`)
        const distFolderPath = path.join(__dirname, 'output', 'build')
        exec(`ls ${distFolderPath}`, (err, stdout, stderr) => {
            console.log('stdout', stdout)
            console.log('stderr', stderr)
        }
        )

        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true })

        await publishLog(`Starting to upload`)
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file)
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath)
            await publishLog(`uploading ${file}`)

            const command = new PutObjectCommand({
                Bucket: '',
                Key: ``,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            })

            await s3Client.send(command)
            await publishLog(`uploaded ${file}`)
            console.log('uploaded', filePath)
        }



        project.status = 'DEPLOYED'
        project.deployed = true
        build.buildStatus = 'DEPLOYED'



        const TIME_ENDED = new Date().toISOString()

        const timeStarted = new Date(TIME_STARTED)
        const timeEnded = new Date(TIME_ENDED)

        const timeTaken = timeEnded - timeStarted

        build.timeToBuild = timeTaken
        const userProject = user.projects.find(p => p.pId === PROJECT_REAL_ID)
        userProject.deployed = true
        user.notification = true
        const noti = {
            notificationId: Math.random().toString(36).substring(7),
            userId: userId,
            notificationType: true,
            notificationMessage: `Project ${project?.title} has been deployed successfully`,
            notificationDate: new Date().toISOString(),
            notificationProjectName: project?.title,
        }
        const newNotification = new Notificat(noti)
        await newNotification.save()
        await user.save()
        await project.save()

        await publishLog(`Done`)
        process.exit(0)
    })
}


async function cleanup() {
    const project = await Project.findOne({ pId: PROJECT_REAL_ID })
    project.status = 'FAILED'
    const noti = {
        notificationId: Math.random().toString(36).substring(7),
        userId: project.userId,
        notificationType: false,
        notificationMessage: `Project ${project?.title} has failed to deploy`,
        notificationDate: new Date().toISOString(),
        notificationProjectName: project?.title,
    }

    const newNotification = new Notificat(noti)
    await newNotification.save()
    await project.save()
}
try {

    init()
}
catch (e) {
    console.log(e)
    cleanup()
    process.exit(1)
}

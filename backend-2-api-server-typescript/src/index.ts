require('dotenv').config()
import { Request, Response } from 'express';
import { Socket } from "socket.io";

const express = require('express')
const { generateSlug } = require('random-word-slugs')
const { ECSClient, RunTaskCommand } = require('@aws-sdk/client-ecs')
const { DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const AWS = require('aws-sdk');
const { Server } = require('socket.io')
const { createClient } = require('@clickhouse/client')
// const { Kafka } = require('kafkajs')
const { v4: uuidv4 } = require('uuid')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const { get } = require('http')
const e = require('./utils')
const {connect} = require('./DB/db_connection')


let PORT = parseInt(process.env.PORT || '9001', 10);
const s3client  = new AWS.S3({
    region: "us-east-1",

    credentials: {
        accessKeyId: "",
        secretAccessKey: ""
    }
})


const app = express()
app.use(cors())


/*Write your query here...*/
// CREATE TABLE log_events (
//     event_id UUID,
//     timestamp DateTime MATERIALIZED now(),
//     deployment_id Nullable(String),
//     log String,
//     metadata Nullable(String)
//   )
//   ENGINE=MergeTree PARTITION BY toYYYYMM(timestamp)
//   ORDER BY (timestamp);
const kafka = new Kafka({
    clientId: `${process.env.API_SERVER}`,
    brokers: [process.env.BROKER1],
    ssl: {
        ca: [fs.readFileSync(path.join(__dirname, 'kafka.pem'), 'utf-8')]
    },
    sasl: {
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD,
        mechanism: process.env.KAFKA_MECHANISM
    }
})


const client = createClient({
    host: process.env.CLICKHOUSE_HOSTNAME,
    database: 'default',
    username: process.env.CLICKHOUSE_USERNAME,
    password: process.env.CLICKHOUSE_PASSWORD
})


const consumer = kafka.consumer({ groupId: process.env.KAFKA_CONSUMER_GROUPID })

const io = new Server({ cors: '*' })

io.on('connection', (socket :Socket) => {
    socket.on('subscribe', (channel) => {
        socket.join(channel)
        socket.emit('message', `Joined ${channel}`)
    })
})
io.listen(9002, () => console.log('Socket Server 9002'))

const ecsClient = new ECSClient({
    region: process.env.AWS_ECS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ECS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ECS_SECRET_ACCESS_KEY
    }
})


const config = {
    CLUSTER: process.env.AWS_CONFIG_CLUSTER,
    TASK: process.env.AWS_CONFIG_TASK_DEFINITION
}


app.use(express.json())



app.post('/project', async (req: Request, res: Response) => {
    const { gitURL, slug, projectId, buildId }: { gitURL: string, slug: string, projectId: string, buildId: string } = req.body;
    const projectSlug : string = slug ? slug : generateSlug()
    // TO THE CURRENT TIME AND PASS TO THE CONTAINER AS ENV VARIABLE

    const CURRENT_TIME: string = new Date().toISOString();


    // Spin the container
    const command = new RunTaskCommand({
        cluster: config.CLUSTER,
        taskDefinition: config.TASK,
        launchType:process.env.AWS_RUNTASK_LAUNCHTYPE,
        count: 1,
        networkConfiguration: {
            awsvpcConfiguration: {
                assignPublicIp: process.env.AWS_RUNTASK_PUBLICIP,
                subnets: [process.env.AWS_RUNTASK_SUBNET1,
                    process.env.AWS_RUNTASK_SUBNET2,
                    process.env.AWS_RUNTASK_SUBNET3,
                    process.env.AWS_RUNTASK_SUBNET4,
                    process.env.AWS_RUNTASK_SUBNET5,
                    process.env.AWS_RUNTASK_SUBNET6],
                securityGroups: [process.env.AWS_RUNTASK_SECURITYGROUP1]
            }
        },
        overrides: {
            containerOverrides: [
                {
                    name: process.env.AWS_RUNTASK_OVERRIDE,
                    environment: [
                        { name: process.env.AWS_RUNTASK_OVERRIDE_ENV1, value: gitURL },
                        { name: process.env.AWS_RUNTASK_OVERRIDE_ENV2, value: projectSlug },
                        { name: process.env.AWS_RUNTASK_OVERRIDE_ENV3, value: projectId },
                        { name: process.env.AWS_RUNTASK_OVERRIDE_ENV4, value: buildId },
                        { name: process.env.AWS_RUNTASK_OVERRIDE_ENV5, value: CURRENT_TIME },
                        { name: process.env.AWS_RUNTASK_OVERRIDE_ENV6, value: process.env.AWS_RUNTASK_OVERRIDE_MONGOURL }
                    ]
                }
            ]
        }
    })

    await ecsClient.send(command);

    return res.json({ status: 'queued', data: { projectSlug, url: `http://${projectSlug}.localhost:8000`, buildId: buildId } })

})


app.get('/logs/:id', async (req: Request, res:Response) => {
    const id : string = req.params.id;
    const logs = await client.query({
        query: `SELECT event_id, deployment_id, log, timestamp from log_events where deployment_id = {deployment_id:String}`,
        query_params: {
            deployment_id: id
        },
        format: 'JSONEachRow'
    })

    const rawLogs = await logs.json()

    return res.json({ logs: rawLogs })
})

app.post("/removeProject", async (req : Request, res : Response) => {
    const projectSlug : string = req.body?.projectSlug

    const projectSlug2 : string = e.extractKey(projectSlug)

    console.log(projectSlug2)

    const lol = await emptyS3Directory("neploy-1", '__outputs/' + projectSlug2 + '/')

    console.log(lol)
    return res.json({ status: 'deleted' })
});

async function initKafkaConsumer() {
    await consumer.connect()
    await consumer.subscribe({ topics: [process.env.KAFKA_TOPIC] })

    await consumer.run({
        autoCommit: false,
        eachBatch: async function ({ batch, heartbeat, commitOffsetsIfNecessary, resolveOffset } :any) {
            const messages = batch.messages;
            console.log(`Received ${messages.length} messages ..`)
            for (const message of messages) {
                const stringMessage = message.value.toString()
                const { PROJECT_ID, DEPLOYMENT_ID, log } = JSON.parse(stringMessage)
                try {
                    const { query_id } = await client.insert({
                        table: process.env.KAFKA_TABLE,
                        values: [{
                            event_id: uuidv4(),
                            deployment_id: DEPLOYMENT_ID,
                            log: log
                        }],
                        format: process.env.KAFKA_TABLE_FORMAT
                    })
                    resolveOffset(message.offset)
                    await commitOffsetsIfNecessary(message.offset)

                    await heartbeat()
                    console.log(`Inserted ${query_id}`)
                } catch (e) {
                    console.log('Error', e)
                }

            }
        }
    })
}

async function emptyS3Directory(bucket : string, dir : string) : Promise<void> {
    const listParams = {
        Bucket: bucket,
        Prefix: dir
    };

    const listedObjects = await s3client.listObjectsV2(listParams).promise();

    if (listedObjects.Contents.length === 0) return;

    const deleteParams = {
        Bucket: bucket,
        Delete: { Objects: [] as { Key: string }[] } 
    };

    listedObjects.Contents.forEach(({ Key }: any) => {
        deleteParams.Delete.Objects.push({ Key });
    });
    

    await s3client.deleteObjects(deleteParams).promise();

    if (listedObjects.IsTruncated) await emptyS3Directory(bucket, dir);
}

connect(process.env.CONNECT_MONGOURL)

initKafkaConsumer()


app.listen(PORT, () => {

    console.log(`API Server Running..${PORT}`)
})


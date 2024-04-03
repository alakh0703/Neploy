require('dotenv').config();
const express = require('express');
const path = require('path')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { loadFilesSync } = require('@graphql-tools/load-files')
const { ApolloServer } = require('apollo-server-express')

const cors = require('cors');

const typesArray = loadFilesSync('**/*', {
    extensions: ['graphql'],
    recursive: true
});
const resolversArray = loadFilesSync('**/*', {
    extensions: ['resolver.js'],
    recursive: true

})




async function startApolloServer() {
    const app = express();
    app.use(cors());

    const corsOptions = {
        origin: process.env.ORIGIN,
        credentials: true
    };

    const schema = makeExecutableSchema({
        typeDefs: typesArray,
        resolvers: resolversArray
    })

    const server = new ApolloServer({
        schema: schema,
        cors: corsOptions

    })

    await server.start()
    server.applyMiddleware({ app, path: '/graphql' })
    require("./DB/db").connect();

    app.listen(4000, () => {
        console.log('Running GraphQL server on 4000 :)');
    }
    );

}


startApolloServer()



require('dotenv').config();
const express = require('express');
const httpProxy = require('http-proxy');
const { connect } = require('./db-config');
const { updateCount } = require('./utils');

const app = express();
const PORT = 8000

const BASE_PATH = process.env.BASE_PATH

const proxy = httpProxy.createProxy()

app.use((req, res) => {
    const hostname = req.hostname;
    const url = "http://" + req.hostname + ":8000"
    console.log(url)
    const subdomain = hostname.split('.')[0];

    updateCount(url)

    const resolvesTo = `${BASE_PATH}/${subdomain}`
    console.log(resolvesTo)

    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true })

})

proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'

})
connect(process.env.MONGO_DB_URI)

app.listen(PORT, () => console.log(`Reverse Proxy Running..${PORT}`))
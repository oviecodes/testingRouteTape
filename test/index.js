
const bent = require('bent')
const getPort = require('get-port')
const nock = require('nock')
const tape = require('tape')

const server = require('../index')
const response = require('./response')

const getJSON = bent('json')

const scope = nock(`https://nodejs.org`)
    .get(`/dist/index.json`)
    .reply(200, response)

const context = {}

tape('setup', async function (t) {
    const port = await getPort()
    context.server = server.listen(port)
    context.origin = `http://localhost:${port}`

    t.end()
})

tape('test latest release', async(t) => {
    const json = await getJSON(`${context.origin}/latest-release`)
    const v14max = json[`v14`].version
    const v13max = json[`v13`].version

    
    t.equal(v14max, 'v14.9.0', 'v14 should match')
    t.equal(v13max, 'v13.14.0', 'v13 should match')
    t.end()
})

tape('Teardown', async(t) => {
    context.server.close()
    t.end()
})



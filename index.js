

const express = require('express')
const bent = require('bent')
const semverMaxSatisfying = require('semver/ranges/max-satisfying')
const port = 3000

const getJSON = bent('json')

const app = express()

app.get('/latest-release', async(req, res) => {
    const response = await getJSON(`https://nodejs.org/dist/index.json`)
    const versions = response.map(el => el.version)
    const maxVersions = []
    const verNum = []
    const finalRes = { }

    versions.forEach((el, i) => {
        verNum.push(Number(el.split('.')[0].split('v')[1]))
    })

    const max = Math.max(...verNum)
    const min = Math.min(...verNum)

    for(let i = min; i < max + 1; i++) {
        maxVersions.push(semverMaxSatisfying(versions, `>=${i} <${i+1}`))
    }

    maxVersions.forEach((ver, i) => {
        if(ver !== null) {
            finalRes[`v${i}`] = response.find(el => el.version === ver)
        } 
    })
    
    res.send(finalRes)
})


app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})

module.exports = app

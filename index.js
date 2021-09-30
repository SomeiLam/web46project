require('dotenv').config()
const path = require('path')

console.log(`web46 rulez`)
console.log(process.argv[2])
console.log(process.env.USER)

const express = require('express')

const server = express()
server.use(express.json())
server.use(express.static(
    path.join(__dirname, 'client/build')
))

server.get('/api/user', (req, res) => {
    res.status(200).json({
        name: "Amy"
    })
})

server.get('*', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'client/build', 'index.html')
    )
})

server.get('/hello', (req, res) => {
    res.send('<h1>HELLO THERE!<h1>')
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`listening on ${port}`)
})
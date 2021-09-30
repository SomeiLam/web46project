require('dotenv').config()
const path = require('path')
const cors = require('cors')
const MaskData = require('maskdata')

const Users = require('./users/model')

const express = require('express')

const server = express()
server.use(cors())
server.use(express.json())
server.use(express.static(
    path.join(__dirname, 'client/build')
))

const maskPasswordOptions = {
    // Character to mask the data. default value is '*'
    maskWith: "*",
    // To limit the *s in response. Also useful in hiding the password length
    // Default max value is 16
    maxMaskedCharacters: 16
};

const maskUser = user => {
    const maskedUser = {
        ...user,
        password: MaskData.maskPassword(user.password, maskPasswordOptions)
    }
    console.log(user)
    console.log(maskedUser)
    return maskedUser;
}

const maskUsers = userArr => {
    return userArr.map((user) => {
        return {
            ...user,
            password: MaskData.maskPassword(user.password, maskPasswordOptions)
        }
    })
}

server.get('/api/users', async (req, res) => {
    try {
        const users = await Users.find()
        // res.status(200).json(users)
        res.status(200).json(maskUsers(users))
    } catch (err) {
        res.status(500).json({
            message: "The users information could not be retrieved"
        })
    }
})

server.post('/api/register', async (req, res) => {
    try {
        const { name, password } = req.body
        if (!name || !password) {
            res.status(400).json({
                message: 'Name and password are required'
            })
        } else {
            const newUser = await Users.create({ name, password })
            res.status(200).json(maskUser(newUser))
        }
    } catch (err) {
        res.status(500).json({
            message: "Fail to create new user"
        })
    }
})

server.post('/api/login', async (req, res) => {
    try {
        const { name, password } = req.body
        const userMaybe = await Users.check({ name, password })
        if (!userMaybe) {
            res.status(404).json({
                message: `Name or password doesn't match`
            })
        } else {
            res.status(200).json({
                message: `Welcome, ${name}`
            })
        }
    } catch (err) {
        res.status(500).json({
            message: "Fail to login"
        })
    }
})

server.get('/hello', (req, res) => {
    res.send('<h1>HELLO THERE!<h1>')
})

server.get('*', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'client/build', 'index.html')
    )
})

module.exports = server;
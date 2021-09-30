const { nanoid } = require('nanoid')

function getId() {
    return nanoid().slice(0, 5)
}

let users = [
    { id: getId(), name: 'amy', password: '1234' },
    { id: getId(), name: 'marco', password: '1234' },
]

const find = () => {
    return users
}

const check = ({ name, password }) => {
    const user = users.find(u => u.name === name && u.password === password)
    return Promise.resolve(user)
}

const create = ({ name, password }) => {
    const newUser = { id: getId(), name, password }
    users.push(newUser)
    return newUser
}

module.exports = {
    find,
    check,
    create,
}

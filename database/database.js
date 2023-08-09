const { Sequelize } = require('sequelize')
const connection = new Sequelize('guiaperguntas', 'root', null, {
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = connection
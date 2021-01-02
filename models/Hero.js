const Sequelize = require('sequelize')
const sequelize = require('../db/htDb')

const Wall = sequelize.define('hero', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    powerStats: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    biography: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    appearance: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    connections: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },
    tags: {
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = Wall

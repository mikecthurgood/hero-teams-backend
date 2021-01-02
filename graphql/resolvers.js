const Hero = require('../models/Hero')


module.exports = {  
    heroes: async ({}, req) => {
        try {
            const heroes = await Hero.findAll()
            const heroCount = await Hero.findAndCountAll({ distinct : true })
            return {heroes, heroCount: heroCount.count}
        } catch (err) {
            console.log(err)
        }
    },
}
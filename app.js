require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql');
// const graphqlHttp = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const sequelize = require('./db/htDb');
const Hero = require('./models/Hero');
const heroList = require('./db.json')

const port = process.env.PORT;
const app = express();
const cors = require('cors');

app.use(cors())
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// app.use(auth)

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err
      }
      const data = err.originalError.data
      const message = err.message || "An error occurred"
      const status = err.originalError.code || 500
      return {message, status, data}
    }
  })
)

app.get('/seedDb', async (req, res, next) => {
  const seed = () => {
    heroList.heroes.forEach(hero => {
      Hero.create({
        name: hero.name,
        powerStats: JSON.stringify(hero.powerstats),
        biography: JSON.stringify(hero.biography),
        appearance: JSON.stringify(hero.appearance),
        connections: JSON.stringify(hero.connections),
        imageUrl: hero.image.url
      })
    })
  }
  try {
    await seed()
    return res
    .status(200)
    .json({ message: 'DB Seeded.,' });
  } catch (err) {
    console.log(err)
  }
})

app.get('/deleteNulls', async (req, res, next) => {
  try {
    const heroes = await Hero.findAll();
    let count = 0;
    const mappedHeroes = heroes.map(hero => {
      const { id, name, powerStats, biography, appearance, connections, imageUrl } = hero
      return {
        id,
        name,
        powerstats: JSON.parse(powerStats),
        biography: JSON.parse(biography),
        appearance: JSON.parse(appearance),
        connections: JSON.parse(connections),
        imageUrl
      }
    }).filter(hero => hero.powerstats.intelligence === "null");
    mappedHeroes.forEach(hero => {
      Hero.destroy({where: {id: hero.id}})
      count ++
    });
    return res
      .status(200)
      .json({message: `${count} records purged`})


    // const cleanse = await Hero.destroy({where: { intelligence: "null" }})
    // return res
    //   .status(200)
    //   .json({ message: 'DB Cleansed.,' });
  } catch (err) {
    console.log(err)
  }
})

app.get('/test-url', async (req, res, next) => {
  try {
    return res
    .status(200)
    .json(heroList);
  }
  catch (err) {
      console.log(err)
  }
  
})

app.use((err, req, res, next) => {
  console.log(err);
  const status = err.statusCode || 500;
  const message = err.message;
  const data = err.data;
  res.status(status).json({ message: message, data: data });
});

// Review.belongsTo(User, {as: 'author', constraints: true, onDelete: 'CASCADE' })
// Review.belongsTo(Wall)
// Wall.hasMany(Review)

try {
    sequelize
    .sync()
    // .sync({ force: true })
    .then(result => {
      app.listen(port || 4000, () => console.log(`${process.env.NODE_ENV.toUpperCase()} SERVER listening on port ${port}...`));
    })
    
}
catch(err) {
    console.log(err)
}
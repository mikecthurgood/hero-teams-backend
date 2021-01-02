const {buildSchema} = require('graphql');

module.exports = buildSchema(`
    type Hero {
        id: ID!
        name: String!
        powerStats: String!
        biography: String!
        appearance: String!
        connections: String!
        imageUrl: String!
        tags: String
    }

    type HeroData {
        heroes: [Hero!]!
        heroCount: Int!
    }

    type RootQuery {
        heroes: HeroData!
    }

    schema {
        query: RootQuery
    }
`)
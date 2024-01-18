var express = require('express')
var { buildSchema} = require('graphql')
var { graphqlHTTP } = require('express-graphql')

var schema = buildSchema(`
  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int]
  }

  type Query {
    getDie(numSides: Int!): RandomDie
  }
`)

class RandomDie {
  constructor(numSides) {
    this.numSides = numSides
  }

  rollOnce = () => {
    return 1 + Math.floor(Math.random()*this.numSides)
  }

  roll = ({numRolls}) => {
    var output = [];

    for(var i = 0; i< numRolls; i++) {
      output.push(1 + Math.floor(Math.random()*this.numSides));
    }

    return output
  }
}

var root = {
  getDie: ({numSides}) => {
    return new RandomDie(numSides);
  }
}

var app = express()
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true
  })


)

app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")

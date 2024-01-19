var express = require('express')
var {buildSchema, GraphQLSchema, GraphQLString, GraphQLObjectType} = require('graphql')
var {graphqlHTTP} = require('express-graphql')

var fakeDatabse = {
  a: {
    id: 'a',
    name: 'alice'
  },
  b: {
    id: 'b',
    name: 'bob'
  }
}

// var schema = buildSchema(`
//   type User {
//     id: String
//     name: String
//   }

//   type Query {
//     user(id: String): User
//   }
// `)

var userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    name: {type: GraphQLString}
  }
})

var queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: userType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve: (_, {id}) => {
        return fakeDatabse[id];
      }
    }
  }
})


var schema = new GraphQLSchema({query: queryType})

var app = express()

app.use('/graphql', graphqlHTTP({schema, graphiql: true}))

app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")


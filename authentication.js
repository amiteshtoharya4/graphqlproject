var express = require('express')
var { buildSchema } = require('graphql')
var {graphqlHTTP} = require('express-graphql')

var schema = buildSchema(`
  type Query {
    ip: String
  }
`)

const loggingMiddleWare = (req, res, next) => {
  console.log(req.ip)
  next()
}

var root = {
  ip: (args, request) => {
    return request.ip
  }
}

var app = express()
app.use(loggingMiddleWare);
app.use('/graphql', graphqlHTTP({schema, rootValue: root, graphiql: true}))

app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")

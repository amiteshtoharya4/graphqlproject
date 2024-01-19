var express = require('express')
var {buildSchema} = require('graphql')
var {graphqlHTTP} = require('express-graphql')

var schema = buildSchema(`
  input MessageInput {
    content: String!
    author: String!
  }

  type Message {
    content: String
    author: String
    id: ID!
  }

  type Mutation {
    createMessage(input: MessageInput!): Message
    updateMessage(id: ID!, input: MessageInput!): Message
  }

  type Query {
    getMessage(id: ID!): Message
  }
`)

class Message {
  constructor(id, {content, author}) {
    this.id = id;
    this.content = content;
    this.author = author;
  }
}

var idPoint = 1;
var fakeDatabse = {}

const root = {
  getMessage: ({id}) => {
    if(!fakeDatabse[id]) {
      throw new Error('Message does not exist with id' + id);
    }
    return new Message(id, fakeDatabse[id]);
  },

  createMessage: ({input}) =>{
    fakeDatabse = {
      ...fakeDatabse,
      [idPoint]: {...input}
    }
    return new Message(idPoint, fakeDatabse[idPoint++]);
  },

  updateMessage: ({id, input}) =>{
    if(!fakeDatabse[id]) {
      throw new Error('Message does not exist with id' + id);
    }
    fakeDatabse[id]= input
    return new Message(id, fakeDatabse[id]);
  },
}

var app = express()

app.use('/graphql',
graphqlHTTP({
  rootValue: root,
  schema,
  graphiql: true,
})
)

app.listen(4000)
console.log("Running a GraphQL API server at http://localhost:4000/graphql")

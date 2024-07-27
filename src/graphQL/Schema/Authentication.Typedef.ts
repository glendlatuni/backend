// src/schema.ts
import { gql } from "apollo-server-express";

export const AuthenticationtypeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
    Member: Members
  }

  type Query {

    users: [User!]!

  }

  type Mutation {
    # User section
    getUser(id: ID!): Members
    createUser(email: String!, password: String!): User!
    updateUser(id: ID!, email: String, password: String): User!
    deleteUser(id: ID!): User!
  }
`;

import { gql } from "apollo-server";

export default gql`
  enum Role {
    ADMIN
    PUBLIC
  }

  type User {
    id: ID
    email: String
    username: String
    password: String
    role: Role
  }

  type AuthOutput {
    token: String
  }

  input UserCreateInput {
    email: String!
    username: String!
    password: String
    role: Role!
  }

  input UserLoginInput {
    usernameOrEmail: String!
    password: String!
  }

  type Mutation {
    register(args: UserCreateInput!): AuthOutput
    login(args: UserLoginInput!): AuthOutput
  }

  type Query {
    _empty: String
  }
`;

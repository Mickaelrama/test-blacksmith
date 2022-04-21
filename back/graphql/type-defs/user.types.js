import { gql } from "apollo-server";

export default gql`
  input GetUsersInput {
    role: Role
    keyword: String!
    limit: Int!
    offset: Int!
  }

  type GetUsersOutput {
    users: [User!]
    count: Int
  }

  type Query {
    getUsers(args: GetUsersInput!): GetUsersOutput
  }

  input UpdateUserInput {
    id: ID!
    email: String!
    username: String!
    role: Role!
    password: String
  }

  type Mutation {
    updateUser(args: UpdateUserInput!): User
    deleteUser(id: ID!): Int
  }
`;

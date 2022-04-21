export const GET_USER = `
query($args: GetUsersInput!) {
  getUsers(args: $args) {
    users {
      id
      email
      username
      role
    }
    count
  }
}`;

export const REGISTER = `
mutation Register($args: UserCreateInput!) {
  register(args: $args) {
    token
  }
}
`;

export const DELETE_USER = `
mutation ($id: ID!) {
  deleteUser(id: $id)
}`;

export const UPDATE_USER = `
mutation($args: UpdateUserInput!) {
  updateUser(args: $args) {
    id
  }
}`;

export const LOGIN = `
  mutation($args: UserLoginInput!) {
    login(args: $args) {
      token
    }
  }
`;

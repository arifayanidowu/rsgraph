import { gql } from "apollo-boost";

export const LOGIN_USER = gql`
  mutation Login($email: String, $password: String) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

export const GET_USERS = gql`
  {
    getUsers {
      id
      email
      password
      username
    }
  }
`;

export const AUTH_USER = gql`
  {
    authUser {
      id
      email
      password
      username
    }
  }
`;

const {
  gql,
  ApolloServer,
  AuthenticationError,
  ApolloError
} = require("apollo-server-express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const typeDefs = gql`
  type User {
    id: ID
    email: String
    password: String
    username: String
  }

  type Query {
    getUsers: [User]
    getUser(id: ID!): User
  }

  type Mutation {
    addUser(email: String, password: String, username: String): User
    deleteUser(id: ID!): User
  }
`;

const resolvers = {
  Query: {
    getUsers: async (_, {}, { User }) => {
      try {
        const users = await User.find({}).sort({ createdAt: "desc" });

        return users;
      } catch (error) {
        return error;
      }
    },
    getUser: async (_, { id }, { User }) => {
      try {
        const user = await User.findOne({ _id: id });
        return user;
      } catch (error) {
        return error;
      }
    }
  },
  Mutation: {
    addUser: async (_, { email, password, username }, { User }) => {
      try {
        const isRegistered = await User.findOne({ email });
        if (isRegistered) {
          console.log("Already registered");
          throw new ApolloError("Already Registered");
          return;
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const user = new User();
        user.email = email;
        user.username = username;
        user.password = hash;
        return user.save();
      } catch (error) {
        throw new ApolloError("Unable to create account.");
      }
    },
    deleteUser: async (_, { id }, { User }) => {
      try {
        const user = await User.findOneAndDelete({ _id: id });
        return user;
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  }
};

const context = ({ req }) => {
  const token = req.headers.authorization || "";

  return {
    token,
    User
  };
};

const server = new ApolloServer({ typeDefs, resolvers, context });

module.exports = server;

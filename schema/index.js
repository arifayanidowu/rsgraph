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
  type AuthData {
    token: String
  }
  type User {
    id: ID
    email: String
    password: String
    username: String
  }

  type Query {
    getUsers: [User]
    getUser(id: ID!): User
    authUser: User
  }

  type Mutation {
    addUser(email: String, password: String, username: String): User
    deleteUser(id: ID!): User
    login(email: String, password: String): AuthData
  }
`;

const resolvers = {
  Query: {
    getUsers: async (_, {}, { User, currentUser }) => {
      try {
        const users = await User.find({}).sort({ createdAt: "desc" });

        return users;
      } catch (error) {
        return error;
      }
    },
    getUser: async (_, { id }, { User, currentUser }) => {
      try {
        const user = await User.findOne({ _id: id });
        console.log(currentUser);
        return user;
      } catch (error) {
        return error;
      }
    },

    authUser: async (_, {}, { User, currentUser }) => {
      if (!currentUser || currentUser === null) {
        throw new AuthenticationError("Unauthorized");
      }
      try {
        const user = await User.findOne({ _id: currentUser.userId });
        return user;
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  },
  Mutation: {
    addUser: async (
      _,
      { email, password, username },
      { User, currentUser }
    ) => {
      if (!currentUser || currentUser === null) {
        throw new AuthenticationError("Unauthorized");
      }
      try {
        const isRegistered = await User.findOne({ email });
        if (isRegistered) {
          console.log("Already registered");
          throw new ApolloError("Already Registered");
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
    },
    login: async (_, { email, password }, { User }) => {
      try {
        const user = await User.findOne({ email });
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          throw new ApolloError("Password does not match");
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1d"
        });
        return { token: token };
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  }
};

const getUser = token => {
  if (token) {
    return jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
  } else {
    return null;
  }
};

const context = ({ req }) => {
  const token = req.headers.authorization || "";
  const currentUser = getUser(token);
  return {
    User,
    currentUser
  };
};

const server = new ApolloServer({ typeDefs, resolvers, context });

module.exports = server;

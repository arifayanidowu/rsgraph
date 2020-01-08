require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User");
const jwt = require("jsonwebtoken");

const server = require("./schema");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log(`> [MongoDB] connected to database`))
  .catch(err => console.error(err));

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(500).json("User does not exist");
      return;
    }
    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(500).json("Passwords do not match");
      return;
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d"
      });
      res.status(200).json(token);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

server.applyMiddleware({ app, path: "/graphql" });
app.listen(PORT, err => {
  if (err) throw err;
  console.log(`> [Server] Listening on port ${PORT}`);
});

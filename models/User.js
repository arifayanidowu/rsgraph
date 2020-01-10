const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      unique: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("User", UserSchema);

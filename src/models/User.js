const Mongoose = require("mongoose");
const passwordComplexity = require("joi-password-complexity");
passwordComplexity().validate("aPassword123!");

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
});

const User = Mongoose.model("user", UserSchema);

module.exports = User;

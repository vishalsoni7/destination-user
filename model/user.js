const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: String,
  userName: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: Number
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;

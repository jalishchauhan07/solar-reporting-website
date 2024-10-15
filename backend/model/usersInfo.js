const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  typeOfUser: {
    type: String,
    required: true,
  },
  project: {
    type: [],
    required: false,
  },
});

const userInfo = mongoose.model("userInfo", userSchema);

module.exports = userInfo;

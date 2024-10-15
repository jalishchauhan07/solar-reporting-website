const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const projectInfoSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  projectName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createTime: {
    type: String,
    required: true,
  },
  modifiedTime: {
    type: String,
    required: false,
  },
  users: {
    type: [],
    required: false,
  },
});

const projectInfo = mongoose.model("projectInfo", projectInfoSchema);

module.exports = projectInfo;

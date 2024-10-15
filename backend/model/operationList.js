const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const operationalListSchema = new Schema({
  projectID: {
    type: String,
  },
  tasks: {
    type: [],
    required: true,
  },
  
});

const operationalList = mongoose.model("operationList", operationalListSchema);
module.exports = operationalList;

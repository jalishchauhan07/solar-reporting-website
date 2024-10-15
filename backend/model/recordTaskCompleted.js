const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const recordTaskCompleteSchema = new Schema({
  projectID: {
    type: String,
  },
  taskComplete: {
    type: [],
  },
  dueTask: {
    type: {
      type: String,
    },
  },
});

const recordTaskComplete = mongoose.model(
  "recordTaskComplete",
  recordTaskCompleteSchema
);

module.exports = recordTaskComplete;

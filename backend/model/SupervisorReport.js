const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const supervisorReportSchema = new Schema({
  projectName: {
    type: String,
    required: true,
  },
  projectID: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const supervisorReport = mongoose.model("report", supervisorReportSchema);
module.exports = supervisorReport;

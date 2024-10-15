const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const siteInfoSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  Photo: {
    type: String,
    required: true,
  },

  time: {
    type: String,
    required: true,
  },
});

const siteInfo = mongoose.model("siteInfo", siteInfoSchema);
module.exports = siteInfo;

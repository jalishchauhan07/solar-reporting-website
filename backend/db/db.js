const mongoose = require("mongoose");

try {
  const db = mongoose.connect(
    "mongodb+srv://admin:admin@cluster0.aqddycg.mongodb.net/db"
  );
} catch (err) {
  console.log(err);
}

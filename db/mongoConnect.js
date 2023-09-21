const mongoose = require("mongoose");
require("dotenv").config();

async function main() {
  await mongoose.connect(process.env.MONGO_DB_URL);
  console.log("toys DB atlas connect");
}
main().catch((err) => console.log(err));

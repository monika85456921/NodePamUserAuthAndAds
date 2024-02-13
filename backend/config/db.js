const mongoose = require("mongoose");
const connectingToDb = async () => {
  try {
    const connecting = await mongoose.connect(`${process.env.MONGO_DB_URL}`);
    console.log(`connected to mongo DB: ${connecting.connection.host}`);
  } catch (err) {
    console.log(`couldnt connect to mongo DB: ${err}`);
  }
};
module.exports = connectingToDb;

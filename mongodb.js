let mongoose = require("mongoose");

let mongoDB = `mongodb+srv://amreshkipm:Amreshsingh@online-auction-system.pfzpznr.mongodb.net/test`;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connected: DATABESE IS CONNECTED`);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

module.exports = { connectDB };

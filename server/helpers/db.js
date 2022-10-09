const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
    });
    console.log(`DB Connected: ${connect.connection.host}`.green.bold);
  } catch (err) {
    console.log(`DB Connection Error: ${err.message}`.red.bold);
    process.exit();
  }
};

module.exports = connectDB;

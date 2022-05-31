const Mongoose = require("mongoose");

const localDB = `mongodb+srv://admin:admin@pfs.2q42h.mongodb.net/pfs`;


const connectDB = async () => {
  await Mongoose.connect(localDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });


  console.log("MongoDB Connected");
};

module.exports = connectDB;

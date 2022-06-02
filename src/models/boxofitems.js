const Mongoose = require("mongoose");


const BoxOfItemsSchema = new Mongoose.Schema({
  _id: Mongoose.Types.ObjectId,
  location: String,
  RFIDSerialNumber: String,
});

const BoxOfItems = Mongoose.model("boxofitem", BoxOfItemsSchema);

module.exports = BoxOfItems;

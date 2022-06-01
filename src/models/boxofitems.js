const Mongoose = require("mongoose");

const ObjectID = Mongoose.Schema.Types.ObjectId();

const BoxOfItemsSchema = new Mongoose.Schema({
  _id: ObjectID,
  itemTypeID: ObjectID,
  location: String,
  RFIDSerialNumber: String,
});

const BoxOfItems = Mongoose.model("boxofitems", BoxOfItemsSchema);

module.exports = BoxOfItems;

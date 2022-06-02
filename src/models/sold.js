const Mongoose = require("mongoose");

const SoldSchema = new Mongoose.Schema({
  _id: Mongoose.Types.ObjectId,
  boxID: Mongoose.Types.ObjectId,
  itemTypeID: Mongoose.Types.ObjectId,
});

const Sold = Mongoose.model("sold", SoldSchema);

module.exports = Sold;

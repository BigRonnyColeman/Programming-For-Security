const Mongoose = require("mongoose");

const ItemSchema = new Mongoose.Schema({
  _id: Mongoose.Types.ObjectId,
  boxID: Mongoose.Types.ObjectId,
});

const Item = Mongoose.model("item", ItemSchema);

module.exports = Item;

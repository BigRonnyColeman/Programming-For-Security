const Mongoose = require("mongoose");

const ObjectID = Mongoose.Schema.Types.ObjectId();

const ItemSchema = new Mongoose.Schema({
  _id: ObjectID,
  boxID: ObjectID,
});

const Item = Mongoose.model("item", ItemSchema);

module.exports = Item;

const Mongoose = require("mongoose");


const ItemTypeSchema = new Mongoose.Schema({
  _id: Mongoose.Types.ObjectId,
  itemName: String,
  itemSel: Number,
  itemCost: Number,
  supplier: String,
});

const ItemType = Mongoose.model("itemtype", ItemTypeSchema);

module.exports = ItemType;

const Mongoose = require("mongoose");
const BoxOfItems = require("./boxofitems");

const ItemSchema = new Mongoose.Schema({
  _id: Mongoose.Types.ObjectId,
  boxID: {
    type: Mongoose.Types.ObjectId, 
    ref: 'boxofitem'
  },
  itemTypeID: Mongoose.Types.ObjectId,
});


const Item = Mongoose.model("item", ItemSchema);


module.exports = Item;


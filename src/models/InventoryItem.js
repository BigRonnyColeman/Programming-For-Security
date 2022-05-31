const Mongoose = require("mongoose");

const InventoryItemSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  role: {
    type: String,
    default: "Basic",
    required: true,
  },
});

const InventoryItem = Mongoose.model("InventoryItem", InventoryItemSchema);

module.exports = InventoryItem;

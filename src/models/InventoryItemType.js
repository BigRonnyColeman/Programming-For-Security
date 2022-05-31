const Mongoose = require("mongoose");

const InventoryItemTypeSchema = new Mongoose.Schema({
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

const InventoryItemType = Mongoose.model("InventoryItemType", InventoryItemTypeSchema);

module.exports = InventoryItemType;

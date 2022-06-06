const express = require("express");
const router = express.Router();

const { register, login, updateUser, deleteUser, Users, info, AllItemType, AllItem, allBoxes, 
    ItemTypeByID, ItemByID, BoxByID, ItemTypeByName, ItemTypeBySupplier, 
    ItemTypeBySell, ItemTypeByCost, BoxesByItemType, ItemsByItemType, 
    ItemsByBoxID, deleteItemType, AddItemType, UpdateCost, UpdateSell, AddItems,
    MoveItem, MoveBox, UpdateRFID, SellItem, BoxByRFID, LocationByItemType, ItemCount} = require("../controllers/posts");
const { adminAuth, userAuth } = require("../middleware/auth");

/* Public API Endpoints */
router.route("/login").post(login);
router.route("/getinfo").get(info);

/* User API Enpoints */
router.route("/register").post(userAuth, register);
router.route("/allInventoryItemType").get(userAuth, AllItemType);
router.route("/allInventoryItem").get(userAuth, AllItem);
router.route("/allBoxes").get(userAuth, allBoxes);
router.route("/ItemTypeByID").post(userAuth, ItemTypeByID);
router.route("/ItemByID").post(userAuth, ItemByID);
router.route("/BoxByID").post(userAuth, BoxByID);
router.route("/ItemTypeByName").post(userAuth, ItemTypeByName);
router.route("/ItemTypeBySupplier").post(userAuth, ItemTypeBySupplier);
router.route("/ItemTypeBySell").post(userAuth, ItemTypeBySell);
router.route("/ItemTypeByCost").post(userAuth, ItemTypeByCost);
router.route("/BoxesByItemType").post(userAuth, BoxesByItemType);
router.route("/ItemsByItemType").post(userAuth, ItemsByItemType);
router.route("/ItemsByBoxID").post(userAuth, ItemsByBoxID);
router.route("/AddItems").post(userAuth, AddItems);
router.route("/MoveItem").put(userAuth, MoveItem);
router.route("/MoveBox").put(userAuth, MoveBox);
router.route("/SellItem").post(userAuth, SellItem);
router.route("/UpdateRFID").put(userAuth, UpdateRFID);
router.route("/BoxByRFID").post(userAuth, BoxByRFID);
router.route("/LocationByItemType").post(userAuth, LocationByItemType);
router.route("/ItemCount").post(userAuth, ItemCount);

/* Admin API Endpoints */
router.route("/updateUser").put(adminAuth, updateUser);
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/deleteItemType").delete(adminAuth, deleteItemType);
router.route("/UpdateCost").put(adminAuth, UpdateCost);
router.route("/UpdateSell").put(adminAuth, UpdateSell);
router.route("/AddItemType").post(adminAuth, AddItemType);
router.route("/getUsers").get(adminAuth, Users);

module.exports = router;

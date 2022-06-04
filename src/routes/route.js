const express = require("express");
const router = express.Router();

const { register, login, update, deleteUser, getUsers, getinfo, getAllItemType, getAllItem, getallBoxes, 
    getItemTypeByID, getItemByID, getBoxByID, getItemTypeByName, getItemTypeBySupplier, 
    getItemTypeBySell, getItemTypeByCost, getBoxesByItemType, getItemsByItemType, 
    getItemsByBoxID, deleteItemType, AddItemType, UpdateCost, UpdateSell, AddItems,
    MoveItem, MoveBox, UpdateRFID, SellItem, BoxByRFID} = require("../controllers/posts");
const { adminAuth, userAuth } = require("../middleware/auth");

/* Public API Endpoints */
router.route("/login").post(login);
router.route("/getinfo").get(getinfo);


/* User API Enpoints */
router.route("/register").post(userAuth, register);

// Get ALL
router.route("/allInventoryItemType").get(userAuth, getAllItemType);
router.route("/allInventoryItem").get(userAuth, getAllItem);
router.route("/allBoxes").get(userAuth, getallBoxes);
// Get By ID
router.route("/ItemTypeByID").post(userAuth, getItemTypeByID);
router.route("/ItemByID").post(userAuth, getItemByID);
router.route("/BoxByID").post(userAuth, getBoxByID);
// Get By Name
router.route("/ItemTypeByName").post(userAuth, getItemTypeByName);
// Get By Supplier
router.route("/ItemTypeBySupplier").post(userAuth, getItemTypeBySupplier);
// Get By Price Range
router.route("/ItemTypeBySell").post(userAuth, getItemTypeBySell);
router.route("/ItemTypeByCost").post(userAuth, getItemTypeByCost);
// Get By itemType
router.route("/BoxesByItemType").post(userAuth, getBoxesByItemType);
router.route("/ItemsByItemType").post(userAuth, getItemsByItemType);
router.route("/ItemsByBoxID").post(userAuth, getItemsByBoxID);
router.route("/AddItems").post(userAuth, AddItems);
router.route("/MoveItem").put(userAuth, MoveItem);
router.route("/MoveBox").put(userAuth, MoveBox);
router.route("/SellItem").post(userAuth, SellItem);

router.route("/UpdateRFID").put(userAuth, UpdateRFID);
router.route("/BoxByRFID").post(userAuth, BoxByRFID);



/* Admin API Endpoints */
router.route("/update").put(adminAuth, update);
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/deleteItemType").delete(adminAuth, deleteItemType);
router.route("/UpdateCost").put(adminAuth, UpdateCost);
router.route("/UpdateSell").put(adminAuth, UpdateSell);
router.route("/AddItemType").post(adminAuth, AddItemType);


router.route("/getUsers").get(adminAuth, getUsers);

module.exports = router;

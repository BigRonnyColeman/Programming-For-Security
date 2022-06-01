const express = require("express");
const router = express.Router();

const { register, login, update, deleteUser, getUsers, getinfo, getAllItemType, getAllItem, getallBoxes, 
    getItemTypeByID, getItemByID, getBoxByID, getItemTypeByName, getItemTypeBySupplier, 
    getItemTypeBySell, getItemTypeByCost} = require("../controllers/posts");
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
router.route("/ItemTypeByID").get(userAuth, getItemTypeByID);
router.route("/ItemByID").get(userAuth, getItemByID);
router.route("/BoxByID").get(userAuth, getBoxByID);
// Get By Name
router.route("/ItemTypeByName").get(userAuth, getItemTypeByName);
// Get By Supplier
router.route("/ItemTypeBySupplier").get(userAuth, getItemTypeBySupplier);
// Get By Price Range
// Find where sellcost > 5, sort by price
router.route("/ItemTypeBySell").get(userAuth, getItemTypeBySell);
router.route("/ItemTypeByCost").get(userAuth, getItemTypeByCost);


/* Admin API Endpoints */
router.route("/update").put(adminAuth, update);
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/getUsers").get(adminAuth, getUsers);

module.exports = router;

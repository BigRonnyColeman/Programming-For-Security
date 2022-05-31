const express = require("express");
const router = express.Router();

const { register, login, update, deleteUser, getUsers } = require("../controllers/posts");
const { adminAuth, userAuth } = require("../middleware/auth");

/* Public API Endpoints */
router.route("/login").post(login);

/* User API Enpoints */
router.route("/register").post(userAuth, register);


/* Admin API Endpoints */
router.route("/update").put(adminAuth, update);
router.route("/deleteUser").delete(adminAuth, deleteUser);
router.route("/getUsers").get(adminAuth, getUsers);

module.exports = router;

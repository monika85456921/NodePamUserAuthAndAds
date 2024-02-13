const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

//protect funkcija requirint
const { protect } = require("../middlewares/authMiddleware.js");
const { protectAdmin } = require("../middlewares/adminAuthMiddleware.js");

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, getUser);
router.get("/list", protectAdmin, getUsers);

///
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

//
module.exports = router;

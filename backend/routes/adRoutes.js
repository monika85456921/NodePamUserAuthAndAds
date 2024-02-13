const express = require("express");
const router = express.Router();

const {
  setAd,
  getAds,
  updateAd,
  deleteAd,
} = require("../controllers/adController.js");

const { protect } = require("../middlewares/authMiddleware.js");

router.route("/").post(protect, setAd).get(protect, getAds);
router.route("/:id").put(protect, updateAd).delete(protect, deleteAd);

module.exports = router;

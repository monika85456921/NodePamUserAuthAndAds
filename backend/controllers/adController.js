const asyncHandler = require("express-async-handler");

const Ad = require("../models/adModel.js");

//@desciption -- Set ads
//@route POST /api/ads
//@access PRIVATE
const setAd = asyncHandler(async (req, res) => {
  if (!req.body.text || !req.body.description || !req.body.price) {
    res.status(400);

    throw new Error("Add all information");
  }
  const ad = await Ad.create({
    text: req.body.text,
    description: req.body.description,
    price: req.body.price,
    user: req.user.id,
  });
  res.status(200).json(ad);
});

//@description -- Get ad
//@route GET /api/ads/
//@access PRIVATE

const getAds = asyncHandler(async (req, res) => {
  const ads = await Ad.find({ user: req.user.id });
  res.status(200).json(ads);
});

//@description -- Update ad
//@route PUT /api/ads/:id
//@access PRIVATE

const updateAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);
  //jeigu ad nera
  if (!ad) {
    res.status(400);
    throw new Error("Ad not found");
  }
  //iesko user'io
  if (!req.user) {
    res.status(401);
    throw new Error("User not found");
  }

  //check if logged user matches ad user
  if (ad.user.toString() !== req.user.id && req.body.role !== "admin") {
    res.status(401);
    throw new Error("User not authorized");
  }

  if (req.user.role === "admin" || ad.user.toString() === req.user.id) {
    //response should give updated ad
    const updatedAd = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedAd);
  }
});

//@description -- delete ad
//@route DELETE /api/ads/:id
//@access PRIVATE

const deleteAd = asyncHandler(async (req, res) => {
  const ad = await Ad.findById(req.params.id);

  if (!ad) {
    res.status(400);
    throw new Error("ad not found");
  }

  if (!req.user) {
    res.status(401);
    throw new Error("user not found");
  }
  if(ad.user.toString() !== req.user.id){
    res.status(401)
    throw new Error("user not authorized")
  }
  await Ad.findByIdAndDelete(req.params.id)

  res.status(200).json({id:req.params.id})

});

module.exports = {
  setAd,
  getAds,
  updateAd,
  deleteAd
};
